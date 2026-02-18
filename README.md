# Clootrack Support System

A full-stack support ticket management system with AI-powered classification capabilities, built with Django REST Framework and React.

## Features

- **Ticket Management**: Create, read, update, and delete support tickets
- **AI-Powered Classification**: Automatic ticket categorization and priority assignment using Groq LLM
- **Real-time Statistics**: Dashboard with ticket analytics and metrics
- **Advanced Filtering**: Search and filter tickets by status, category, and priority
- **Responsive Design**: Modern React frontend with Tailwind CSS
- **RESTful API**: Well-structured Django REST API endpoints

## Technology Stack

### Backend
- **Framework**: Django 6.0.2
- **API**: Django REST Framework 3.16.1
- **Database**: PostgreSQL 16
- **AI Integration**: Groq API for ticket classification
- **Authentication**: Django's built-in authentication system

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL container
- **Environment Management**: Environment variables with .env files

## Project Structure

```
clootrack-assessment/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── tickets/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── tests.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TicketForm.jsx
│   │   │   ├── TicketList.jsx
│   │   │   └── StatsDashboard.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml
├── .env.example
└── README.md
```

## Installation and Setup

### Prerequisites
- Docker and Docker Compose
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aswinesag/clootrack-support-system.git
   cd clootrack-support-system
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example backend/.env
   ```
   Edit the `backend/.env` file and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   POSTGRES_DB=ticketdb
   POSTGRES_USER=ticketuser
   POSTGRES_PASSWORD=ticketpass
   ```

3. **Start the application**
   ```bash
   docker compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api
   - Database: localhost:5432

### Manual Setup (Development)

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Ticket Management
- `GET /api/tickets/` - List all tickets
- `POST /api/tickets/` - Create a new ticket
- `GET /api/tickets/{id}/` - Retrieve a specific ticket
- `PATCH /api/tickets/{id}/` - Update a ticket
- `DELETE /api/tickets/{id}/` - Delete a ticket

### Statistics
- `GET /api/tickets/stats/` - Get ticket statistics and analytics

### AI Classification
- `POST /api/tickets/classify/` - Classify ticket description

### Query Parameters
- `search={query}` - Search tickets by title or description
- `status={open|closed}` - Filter by ticket status
- `category={billing|technical|account|general}` - Filter by category
- `priority={low|medium|high|critical}` - Filter by priority

## Data Models

### Ticket Model
```python
class Ticket(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    created_at = models.DateTimeField(auto_now_add=True)
```

### Categories
- `billing` - Billing and payment related issues
- `technical` - Technical and system issues
- `account` - Account management issues
- `general` - General inquiries

### Priorities
- `low` - Low priority issues
- `medium` - Medium priority issues
- `high` - High priority issues
- `critical` - Critical issues requiring immediate attention

### Statuses
- `open` - Open tickets
- `in_progress` - Tickets being worked on
- `resolved` - Resolved tickets
- `closed` - Closed tickets

## AI Classification System

The system uses Groq's LLM API to automatically classify tickets based on their descriptions. The classification process analyzes the ticket content and suggests:

1. **Category**: Identifies the most appropriate category for the ticket
2. **Priority**: Determines the urgency level based on the description

### Classification Process
1. User enters ticket description
2. System sends description to Groq API with structured prompt
3. LLM analyzes content and returns JSON response
4. Frontend auto-populates category and priority fields
5. User can override suggestions before submission

## Testing

### Running Tests
```bash
cd backend
python manage.py test
```

### Test Coverage
- Model tests for Ticket model
- API endpoint tests for all CRUD operations
- Statistics endpoint tests
- Classification endpoint tests

## Environment Variables

### Backend (.env)
```
GROQ_API_KEY=your_groq_api_key_here
POSTGRES_DB=ticketdb
POSTGRES_USER=ticketuser
POSTGRES_PASSWORD=ticketpass
SECRET_KEY=your_django_secret_key_here
DEBUG=True
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Docker Configuration

The application uses Docker Compose for containerization:

- **PostgreSQL**: Official PostgreSQL 16 image
- **Backend**: Custom Python 3.12 image with Django application
- **Frontend**: Custom Node.js 20 image with React application

### Docker Commands
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs

# Rebuild services
docker compose build --no-cache
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## Acknowledgments

- Groq AI for providing the LLM API for ticket classification
- Django REST Framework for the robust API framework
- React and Vite for the modern frontend development experience
