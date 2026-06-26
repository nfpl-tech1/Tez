"""
Models Package

Exports all database models for easy importing.
"""
from .user import User
from .department import Department
from .tool import Tool, tool_departments
from .notification import Notification
from .issue import Issue

__all__ = ["User", "Department", "Tool", "tool_departments", "Notification", "Issue"]
