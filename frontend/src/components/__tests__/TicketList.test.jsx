import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TicketList from '../TicketList';

// Mock the API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('TicketList Component', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('renders ticket list with loading state', () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    
    render(<TicketList />);
    
    expect(screen.getByText('Support Tickets')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search tickets...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('all')).toBeInTheDocument(); // Category filter
    expect(screen.getByDisplayValue('all')).toBeInTheDocument(); // Status filter
  });

  test('displays tickets when data is loaded', async () => {
    const mockTickets = [
      {
        id: 1,
        title: 'Login Issue',
        description: 'Cannot login to account',
        category: 'technical',
        priority: 'high',
        status: 'open',
        created_at: '2026-02-19T00:00:00Z'
      },
      {
        id: 2,
        title: 'Billing Question',
        description: 'Question about invoice',
        category: 'billing',
        priority: 'medium',
        status: 'closed',
        created_at: '2026-02-18T00:00:00Z'
      }
    ];

    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockTickets) })
    );

    render(<TicketList />);

    await waitFor(() => {
      expect(screen.getByText('Login Issue')).toBeInTheDocument();
      expect(screen.getByText('Billing Question')).toBeInTheDocument();
      expect(screen.getByText('Cannot login to account')).toBeInTheDocument();
      expect(screen.getByText('Question about invoice')).toBeInTheDocument();
    });
  });

  test('filters tickets by search term', async () => {
    const mockTickets = [
      {
        id: 1,
        title: 'Login Issue',
        description: 'Cannot login to account',
        category: 'technical',
        priority: 'high',
        status: 'open',
        created_at: '2026-02-19T00:00:00Z'
      }
    ];

    // Mock the search API call
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockTickets) })
    );

    render(<TicketList />);

    const searchInput = screen.getByPlaceholderText('Search tickets...');
    fireEvent.change(searchInput, { target: { value: 'login' } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=login'),
        expect.any(Object)
      );
    });
  });

  test('filters tickets by category', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    render(<TicketList />);

    const categorySelect = screen.getByDisplayValue('all');
    fireEvent.change(categorySelect, { target: { value: 'technical' } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('category=technical'),
        expect.any(Object)
      );
    });
  });

  test('filters tickets by status', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    render(<TicketList />);

    const statusSelect = screen.getAllByDisplayValue('all')[1]; // Second select is status
    fireEvent.change(statusSelect, { target: { value: 'open' } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('status=open'),
        expect.any(Object)
      );
    });
  });

  test('displays error message when API fails', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );

    render(<TicketList />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tickets/)).toBeInTheDocument();
    });
  });

  test('opens new ticket modal when button is clicked', () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    
    render(<TicketList />);
    
    const newTicketButton = screen.getByText('New Ticket');
    fireEvent.click(newTicketButton);
    
    expect(screen.getByText('Create New Ticket')).toBeInTheDocument();
  });

  test('submits new ticket form', async () => {
    mockFetch
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }))
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 1 }) }));

    render(<TicketList />);
    
    // Open modal
    fireEvent.click(screen.getByText('New Ticket'));
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Ticket title'), { 
      target: { value: 'Test Ticket' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Describe your issue...'), { 
      target: { value: 'Test description' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Create Ticket'));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/tickets/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('Test Ticket')
        })
      );
    });
  });
});
