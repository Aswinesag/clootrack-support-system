# Testing Guide for Clootrack Support System

This document provides comprehensive test cases and instructions for testing the support ticket system.

## 🧪 Backend Tests (Django)

### Test Coverage Areas

#### 1. **Ticket Model Tests** (`TicketModelTest`)
- ✅ Ticket creation with all fields
- ✅ String representation of tickets
- ✅ Timestamp fields (created_at, updated_at)

#### 2. **Ticket API Tests** (`TicketAPITest`)
- ✅ **CRUD Operations**:
  - Create new ticket (`POST /api/tickets/`)
  - Get all tickets (`GET /api/tickets/`)
  - Get single ticket (`GET /api/tickets/{id}/`)
  - Update ticket (`PATCH /api/tickets/{id}/`)
  - Delete ticket (`DELETE /api/tickets/{id}/`)

- ✅ **Filtering & Search**:
  - Filter by status (`?status=open`)
  - Filter by category (`?category=technical`)
  - Search by title/description (`?search=login`)

#### 3. **Statistics Tests** (`TicketStatsTest`)
- ✅ Total tickets count
- ✅ Open tickets count
- ✅ Priority breakdown (high/medium/low)
- ✅ Category breakdown (technical/billing/account/general)
- ✅ Average tickets per day calculation

#### 4. **Classification Tests** (`TicketClassificationTest`)
- ✅ Ticket classification with description
- ✅ Error handling for missing description
- ⚠️ Requires valid GROQ_API_KEY for full functionality

### Running Backend Tests

#### Option 1: Using the Test Runner Script
```bash
cd backend
python run_tests.py
```

#### Option 2: Using Django's Test Command
```bash
cd backend

# Run all ticket tests
python manage.py test tickets.tests

# Run specific test class
python manage.py test tickets.tests.TicketAPITest

# Run specific test method
python manage.py test tickets.tests.TicketAPITest.test_create_ticket

# Run with verbose output
python manage.py test tickets.tests --verbosity=2

# Run with coverage (if installed)
pip install coverage
coverage run --source='.' manage.py test tickets.tests
coverage report
```

### Sample Test Output
```
🧪 Running Django Test Suite
==================================================

📋 Running tickets.tests.TicketModelTest
------------------------------
✅ tickets.tests.TicketModelTest - All tests passed!

📋 Running tickets.tests.TicketAPITest
------------------------------
✅ tickets.tests.TicketAPITest - All tests passed!

📋 Running tickets.tests.TicketStatsTest
------------------------------
✅ tickets.tests.TicketStatsTest - All tests passed!

📋 Running tickets.tests.TicketClassificationTest
------------------------------
✅ tickets.tests.TicketClassificationTest - All tests passed!
```

## 🎨 Frontend Tests (React)

### Test Coverage Areas

#### 1. **Component Rendering**
- ✅ Ticket list displays correctly
- ✅ Loading states
- ✅ Search and filter inputs
- ✅ New ticket button

#### 2. **User Interactions**
- ✅ Search functionality
- ✅ Category filtering
- ✅ Status filtering
- ✅ Modal interactions
- ✅ Form submissions

#### 3. **API Integration**
- ✅ Fetching tickets
- ✅ Creating new tickets
- ✅ Error handling
- ✅ Loading states

#### 4. **Data Display**
- ✅ Ticket cards show correct information
- ✅ Status badges display correctly
- ✅ Priority indicators
- ✅ Timestamps formatted properly

### Running Frontend Tests

#### Prerequisites
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

#### Running Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- TicketList.test.jsx
```

### Sample Test Cases

#### Test Case 1: Create a New Ticket
```javascript
// Expected behavior:
// 1. Click "New Ticket" button
// 2. Modal opens with form
// 3. Fill in title and description
// 4. Submit form
// 5. API call made to POST /api/tickets/
// 6. Ticket appears in list
```

#### Test Case 2: Filter Tickets by Status
```javascript
// Expected behavior:
// 1. Select "open" from status dropdown
// 2. API call made to GET /api/tickets/?status=open
// 3. Only open tickets displayed
// 4. Filter persists in URL
```

#### Test Case 3: Search Tickets
```javascript
// Expected behavior:
// 1. Type "login" in search box
// 2. API call made after debounce
// 3. Only tickets matching "login" shown
// 4. Search term highlighted
```

## 🐳 Docker Testing

### Testing in Docker Environment

#### 1. **Build and Start Services**
```bash
docker compose up -d
```

#### 2. **Run Backend Tests in Container**
```bash
docker compose exec backend python manage.py test tickets.tests
```

#### 3. **Test API Endpoints**
```bash
# Test backend health
curl http://localhost:8000/api/tickets/

# Test frontend
curl http://localhost:5173/

# Test service communication
docker compose logs frontend
docker compose logs backend
```

## 📊 Integration Tests

### End-to-End Test Scenario

#### Scenario: Complete Ticket Lifecycle
1. **Create Ticket**
   - Navigate to frontend
   - Click "New Ticket"
   - Fill form with title: "Login Issue"
   - Description: "Cannot login with correct credentials"
   - Submit form

2. **Verify Backend**
   - Check ticket appears in database
   - Verify API response includes new ticket

3. **Update Ticket**
   - Click on ticket in frontend
   - Change status to "in_progress"
   - Save changes

4. **Verify Update**
   - Check backend API reflects changes
   - Verify frontend displays updated status

5. **Classify Ticket**
   - Use classification endpoint
   - Verify AI suggests appropriate category/priority

### Test Data

#### Sample Tickets for Testing
```json
[
  {
    "title": "Login Issue",
    "description": "Cannot login to account with correct password",
    "category": "technical",
    "priority": "high",
    "status": "open"
  },
  {
    "title": "Billing Question",
    "description": "Question about last month's invoice",
    "category": "billing", 
    "priority": "medium",
    "status": "closed"
  },
  {
    "title": "Account Setup",
    "description": "Need help setting up new user account",
    "category": "account",
    "priority": "low",
    "status": "open"
  }
]
```

## 🔧 Troubleshooting Tests

### Common Issues

#### 1. **Backend Tests Fail**
- **Issue**: Database connection errors
- **Solution**: Ensure PostgreSQL is running and configured
- **Command**: `docker compose up -d db`

#### 2. **Frontend Tests Fail**
- **Issue**: Module resolution errors
- **Solution**: Check Jest configuration and imports
- **Command**: `npm install --save-dev @testing-library/jest-dom`

#### 3. **Integration Tests Fail**
- **Issue**: Service communication errors
- **Solution**: Check Docker networking and service names
- **Command**: `docker compose logs`

#### 4. **Classification Tests Fail**
- **Issue**: Missing GROQ_API_KEY
- **Solution**: Set environment variable in .env file
- **Command**: Add `GROQ_API_KEY=your_key` to backend/.env

### Debug Commands

```bash
# Check service status
docker compose ps

# View logs
docker compose logs backend
docker compose logs frontend

# Test API directly
curl -X GET http://localhost:8000/api/tickets/
curl -X POST http://localhost:8000/api/tickets/ -H "Content-Type: application/json" -d '{"title":"Test","description":"Test ticket"}'

# Database operations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

## 📈 Test Coverage Goals

### Target Coverage
- **Backend**: 90%+ line coverage
- **Frontend**: 85%+ line coverage
- **Integration**: All critical user flows

### Coverage Reports
```bash
# Backend coverage
cd backend
coverage run --source='.' manage.py test tickets.tests
coverage report
coverage html

# Frontend coverage
cd frontend
npm test -- --coverage --coverageReporters=text-lcov | coveralls
```

This comprehensive test suite ensures the reliability and functionality of the Clootrack Support System across all components and integration points.
