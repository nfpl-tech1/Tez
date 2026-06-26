"""
File Service

Handles file upload, download, and storage operations.
Supports PDF and executable files with subfolder organization.
"""
import os
import uuid
from pathlib import Path
from typing import Optional, Tuple
from fastapi import UploadFile

from ..config import get_settings


class FileService:
    """Service for file operations."""
    
    def __init__(self):
        self.settings = get_settings()
        self.upload_dir = Path(self.settings.UPLOAD_DIR)
        self.max_size = self.settings.MAX_FILE_SIZE
        self.allowed_extensions = self.settings.ALLOWED_EXTENSIONS
        # Add PDF to allowed extensions for instructions
        self.pdf_extensions = {'.pdf'}
    
    def validate_file(self, file: UploadFile, allow_pdf: bool = False) -> Tuple[bool, str]:
        """
        Validate uploaded file.
        Returns (is_valid, error_message).
        """
        if file.filename:
            ext = Path(file.filename).suffix.lower()
            allowed = self.allowed_extensions | (self.pdf_extensions if allow_pdf else set())
            if ext not in allowed:
                return False, f"Only {', '.join(allowed)} files are allowed"
        
        return True, ""
    
    async def save_file(
        self, 
        file: UploadFile, 
        subfolder: Optional[str] = None
    ) -> Tuple[str, str, int]:
        """
        Save uploaded file to storage.
        
        Args:
            file: The uploaded file
            subfolder: Optional subfolder within upload directory (e.g., "instructions")
        
        Returns (file_path, original_filename, file_size).
        """
        # Determine target directory
        if subfolder:
            target_dir = self.upload_dir / subfolder
        else:
            target_dir = self.upload_dir
        
        # Ensure directory exists
        target_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        ext = Path(file.filename).suffix.lower() if file.filename else ".dat"
        unique_name = f"{uuid.uuid4()}{ext}"
        file_path = target_dir / unique_name
        
        # Save file
        total_size = 0
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(8192):  # 8KB chunks
                total_size += len(chunk)
                
                # Check size limit
                if total_size > self.max_size:
                    # Clean up partial file
                    os.remove(file_path)
                    raise ValueError(
                        f"File exceeds maximum size of {self.max_size / (1024*1024):.0f}MB"
                    )
                
                buffer.write(chunk)
        
        return str(file_path), file.filename or unique_name, total_size
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file from storage."""
        try:
            path = Path(file_path)
            if path.exists():
                os.remove(path)
                return True
        except Exception:
            pass
        return False
    
    def get_file_path(self, stored_path: str) -> Optional[Path]:
        """Get the full path to a stored file."""
        path = Path(stored_path)
        if path.exists():
            return path
        return None
    
    def get_file_size(self, file_path: str) -> int:
        """Get file size in bytes."""
        path = Path(file_path)
        if path.exists():
            return path.stat().st_size
        return 0
