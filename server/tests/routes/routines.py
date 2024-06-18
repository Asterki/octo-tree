import unittest
from flask import Flask
from flask.testing import FlaskClient
from unittest.mock import patch
from routes.routines import routines_router

class GetRoutinesTestCase(unittest.TestCase):
    def setUp(self):
        # Create a test Flask app and register the routines_router blueprint
        self.app = Flask(__name__)
        self.app.register_blueprint(routines_router)
        self.client = self.app.test_client()

    def test_get_routines_success(self):
        # Mock the DatabaseService.get_instance().get method to return some routines
        with patch('services.database.DatabaseService.get_instance') as mock_get_instance:
            mock_db_service = mock_get_instance.return_value
            mock_db_service.get.return_value = ["Routine 1", "Routine 2"]

            # Send a GET request to the /api/routines/get endpoint
            response = self.client.get('/api/routines/get')

            # Assert that the response status code is 200
            self.assertEqual(response.status_code, 200)

            # Assert that the response JSON contains the expected routines
            expected_response = {"routines": ["Routine 1", "Routine 2"]}
            self.assertEqual(response.get_json(), expected_response)

    def test_get_routines_no_data(self):
        # Mock the DatabaseService.get_instance().get method to return an empty list
        with patch('services.database.DatabaseService.get_instance') as mock_get_instance:
            mock_db_service = mock_get_instance.return_value
            mock_db_service.get.return_value = []

            # Send a GET request to the /api/routines/get endpoint
            response = self.client.get('/api/routines/get')

            # Assert that the response status code is 200
            self.assertEqual(response.status_code, 200)

            # Assert that the response JSON contains an empty list of routines
            expected_response = {"routines": []}
            self.assertEqual(response.get_json(), expected_response)

if __name__ == '__main__':
    unittest.main()