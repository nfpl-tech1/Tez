# Tool Repository

A web-based tool repository application where developers can publish .exe applications with usage instructions.

## Features

- **Admin Dashboard**: Manage team members, review and approve tools
- **Team Member Portal**: Upload tools, manage own submissions
- **Public Access**: Browse and download approved tools (open access)
- **Markdown Support**: Rich formatting for tool instructions
- **Search**: Find tools by name or description
- **Department Categories**: Organize tools by department

## Tech Stack

- **Backend**: FastAPI (Python 3.11+)
- **Database**: SQLite with SQLAlchemy ORM
- **Auth**: Session-based authentication
- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI
- **State Management**: TanStack Query
- **Deployment**: Docker + Dokploy

## Quick Start

### Local Development (Without Docker)

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

#### Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Run the development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

## Default Admin Credentials

- **Username**: nagarkotadmin
- **Password**: nagarkotadmin

> ⚠️ Change these credentials after first login!

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./data/tool_repository.db
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=157286400  # 150MB
```

## Project Structure

```
Tool-Repository/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── config.py         # Configuration
│   │   ├── database.py       # Database setup
│   │   ├── models/           # SQLAlchemy models
│   │   ├── routers/          # API routes
│   │   │   ├── auth.py       # Authentication
│   │   │   ├── public.py     # Public routes
│   │   │   ├── admin/        # Admin endpoints
│   │   │   └── team/         # Team endpoints
│   │   ├── schemas/          # Pydantic schemas
│   │   └── services/         # Business logic
│   ├── data/                 # SQLite database
│   ├── uploads/              # Uploaded files
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities & API
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

## License

Internal use only - Nagarkot Technologies
