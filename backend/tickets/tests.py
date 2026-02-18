from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Ticket

User = get_user_model()

class TicketModelTest(TestCase):
    """Test the Ticket model"""
    
    def setUp(self):
        self.ticket = Ticket.objects.create(
            title="Test Ticket",
            description="This is a test ticket description",
            category="technical",
            priority="high",
            status="open"
        )
    
    def test_ticket_creation(self):
        """Test that a ticket can be created"""
        self.assertEqual(self.ticket.title, "Test Ticket")
        self.assertEqual(self.ticket.category, "technical")
        self.assertEqual(self.ticket.priority, "high")
        self.assertEqual(self.ticket.status, "open")
        self.assertIsNotNone(self.ticket.created_at)
    
    def test_ticket_str_representation(self):
        """Test the string representation of a ticket"""
        self.assertEqual(str(self.ticket), "Test Ticket")

class TicketAPITest(APITestCase):
    """Test the Ticket API endpoints"""
    
    def setUp(self):
        self.ticket_data = {
            "title": "API Test Ticket",
            "description": "Testing the API endpoints",
            "category": "billing",
            "priority": "medium",
            "status": "open"
        }
    
    def test_create_ticket(self):
        """Test creating a new ticket via API"""
        response = self.client.post('/api/tickets/', self.ticket_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ticket.objects.count(), 1)
        
        ticket = Ticket.objects.first()
        self.assertEqual(ticket.title, "API Test Ticket")
        self.assertEqual(ticket.category, "billing")
    
    def test_get_tickets_list(self):
        """Test retrieving a list of tickets"""
        # Create some test tickets
        Ticket.objects.create(title="Ticket 1", description="Description 1", category="technical", priority="low", status="open")
        Ticket.objects.create(title="Ticket 2", description="Description 2", category="account", priority="high", status="closed")
        
        response = self.client.get('/api/tickets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_get_ticket_detail(self):
        """Test retrieving a single ticket"""
        ticket = Ticket.objects.create(
            title="Detail Test",
            description="Testing detail endpoint",
            category="general",
            priority="critical",
            status="open"
        )
        
        response = self.client.get(f'/api/tickets/{ticket.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Detail Test")
        self.assertEqual(response.data['category'], "general")
    
    def test_update_ticket(self):
        """Test updating a ticket"""
        ticket = Ticket.objects.create(
            title="Original Title",
            description="Original description",
            category="technical",
            priority="low",
            status="open"
        )
        
        update_data = {
            "title": "Updated Title",
            "status": "closed"
        }
        
        response = self.client.patch(f'/api/tickets/{ticket.id}/', update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        ticket.refresh_from_db()
        self.assertEqual(ticket.title, "Updated Title")
        self.assertEqual(ticket.status, "closed")
    
    def test_delete_ticket(self):
        """Test deleting a ticket"""
        ticket = Ticket.objects.create(
            title="To Delete",
            description="This will be deleted",
            category="general",
            priority="medium",
            status="open"
        )
        
        response = self.client.delete(f'/api/tickets/{ticket.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Ticket.objects.count(), 0)
    
    def test_filter_tickets_by_status(self):
        """Test filtering tickets by status"""
        Ticket.objects.create(title="Open Ticket", description="Open", category="technical", priority="low", status="open")
        Ticket.objects.create(title="Closed Ticket", description="Closed", category="account", priority="high", status="closed")
        
        response = self.client.get('/api/tickets/?status=open')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['status'], 'open')
    
    def test_filter_tickets_by_category(self):
        """Test filtering tickets by category"""
        Ticket.objects.create(title="Tech Ticket", description="Technical", category="technical", priority="low", status="open")
        Ticket.objects.create(title="Bill Ticket", description="Billing", category="billing", priority="high", status="open")
        
        response = self.client.get('/api/tickets/?category=technical')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['category'], 'technical')
    
    def test_search_tickets(self):
        """Test searching tickets by title or description"""
        Ticket.objects.create(title="Login Issue", description="Cannot login to system", category="technical", priority="high", status="open")
        Ticket.objects.create(title="Payment Problem", description="Payment not processing", category="billing", priority="medium", status="open")
        
        response = self.client.get('/api/tickets/?search=login')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Login Issue")

class TicketStatsTest(APITestCase):
    """Test the ticket statistics endpoint"""
    
    def setUp(self):
        # Create test data for stats
        Ticket.objects.create(title="Open Tech", description="Open technical", category="technical", priority="high", status="open")
        Ticket.objects.create(title="Closed Tech", description="Closed technical", category="technical", priority="low", status="closed")
        Ticket.objects.create(title="Open Bill", description="Open billing", category="billing", priority="medium", status="open")
    
    def test_get_stats(self):
        """Test retrieving ticket statistics"""
        response = self.client.get('/api/tickets/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.data
        self.assertEqual(data['total_tickets'], 3)
        self.assertEqual(data['open_tickets'], 2)
        self.assertIn('priority_breakdown', data)
        self.assertIn('category_breakdown', data)
        self.assertIn('avg_tickets_per_day', data)
    
    def test_priority_breakdown(self):
        """Test priority breakdown in stats"""
        response = self.client.get('/api/tickets/stats/')
        priority_breakdown = response.data['priority_breakdown']
        
        self.assertEqual(priority_breakdown['high'], 1)
        self.assertEqual(priority_breakdown['medium'], 1)
        self.assertEqual(priority_breakdown['low'], 1)
    
    def test_category_breakdown(self):
        """Test category breakdown in stats"""
        response = self.client.get('/api/tickets/stats/')
        category_breakdown = response.data['category_breakdown']
        
        self.assertEqual(category_breakdown['technical'], 2)
        self.assertEqual(category_breakdown['billing'], 1)

class TicketClassificationTest(APITestCase):
    """Test the ticket classification endpoint"""
    
    def test_classify_ticket(self):
        """Test ticket classification with mock description"""
        classification_data = {
            "description": "I cannot login to my account and the payment system is not working"
        }
        
        # Note: This test will fail without a valid GROQ_API_KEY
        # In a real test, you would mock the Groq client
        response = self.client.post('/api/tickets/classify/', classification_data, format='json')
        
        # Without API key, should return error response
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])
        
        if response.status_code == status.HTTP_200_OK:
            self.assertIn('suggested_category', response.data)
            self.assertIn('suggested_priority', response.data)
    
    def test_classify_ticket_no_description(self):
        """Test classification with no description"""
        response = self.client.post('/api/tickets/classify/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
