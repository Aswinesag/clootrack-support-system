#!/usr/bin/env python
"""
Test runner script for the Django backend
This script demonstrates how to run the comprehensive test suite
"""

import os
import sys
import django
from django.conf import settings
from django.test.utils import get_runner

if __name__ == "__main__":
    os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
    django.setup()
    
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    
    # Run all tests
    print("🧪 Running Django Test Suite")
    print("=" * 50)
    
    # Specific test modules to run
    test_modules = [
        'tickets.tests.TicketModelTest',
        'tickets.tests.TicketAPITest', 
        'tickets.tests.TicketStatsTest',
        'tickets.tests.TicketClassificationTest'
    ]
    
    for module in test_modules:
        print(f"\n📋 Running {module}")
        print("-" * 30)
        failures = test_runner.run_tests([module])
        
        if failures == 0:
            print(f"✅ {module} - All tests passed!")
        else:
            print(f"❌ {module} - {failures} test(s) failed")
    
    print("\n" + "=" * 50)
    print("🎯 Test Summary:")
    print("• TicketModelTest: Tests model creation and string representation")
    print("• TicketAPITest: Tests CRUD operations, filtering, and search")
    print("• TicketStatsTest: Tests statistics endpoint calculations")
    print("• TicketClassificationTest: Tests AI-powered ticket classification")
    print("\n💡 To run tests manually:")
    print("  python manage.py test tickets.tests")
    print("  python manage.py test tickets.tests.TicketAPITest.test_create_ticket")
