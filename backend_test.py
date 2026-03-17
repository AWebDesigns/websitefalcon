import requests
import sys
from datetime import datetime
import json

class FalconWebStudioAPITester:
    def __init__(self, base_url="https://falcon-showcase.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{self.base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success
            }

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    result["response_data"] = response_data
                    if endpoint == "leads" and method == "POST":
                        print(f"   Created lead with ID: {response_data.get('id')}")
                except:
                    result["response_data"] = "Non-JSON response"
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    result["error_data"] = error_data
                    print(f"   Error: {error_data}")
                except:
                    result["error_text"] = response.text[:200]
                    print(f"   Error text: {response.text[:200]}")

            self.test_results.append(result)
            return success, response.json() if success else {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Request Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "success": False,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API endpoint",
            "GET",
            "",
            200
        )

    def test_create_lead(self, lead_data):
        """Test creating a lead"""
        success, response = self.run_test(
            "Create Lead",
            "POST", 
            "leads",
            200,
            data=lead_data
        )
        return response.get('id') if success else None, success

    def test_get_leads(self):
        """Test getting all leads"""
        success, response = self.run_test(
            "Get All Leads",
            "GET",
            "leads", 
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} leads in database")
        return success, response

    def test_invalid_lead_creation(self):
        """Test lead creation with invalid data"""
        invalid_data = {"name": "Test"}  # Missing required email field
        return self.run_test(
            "Create Lead with Invalid Data",
            "POST",
            "leads",
            422,  # FastAPI validation error
            data=invalid_data
        )

def main():
    print("🚀 Starting Falcon Web Studio API Testing")
    print("=" * 50)
    
    tester = FalconWebStudioAPITester()
    
    # Test 1: Root endpoint
    print("\n📋 Testing Core API Endpoints...")
    tester.test_root_endpoint()
    
    # Test 2: Create a test lead
    print("\n📋 Testing Lead Capture Functionality...")
    test_lead_data = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "business_name": "Test Business Inc", 
        "website_url": "https://testbusiness.com",
        "message": "I would like a free website preview for my business"
    }
    
    lead_id, success = tester.test_create_lead(test_lead_data)
    
    # Test 3: Create lead with minimal data (only required fields)
    minimal_lead_data = {
        "name": "Jane Smith",
        "email": "jane.smith@example.com"
    }
    tester.test_create_lead(minimal_lead_data)
    
    # Test 4: Test invalid lead creation
    tester.test_invalid_lead_creation()
    
    # Test 5: Get all leads
    tester.test_get_leads()
    
    # Print detailed results
    print("\n" + "=" * 50)
    print(f"📊 Test Summary:")
    print(f"   Total Tests: {tester.tests_run}")
    print(f"   Passed: {tester.tests_passed}")
    print(f"   Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    # Save detailed results to file for analysis
    with open('/app/test_reports/backend_api_results.json', 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_tests": tester.tests_run,
            "passed_tests": tester.tests_passed,
            "success_rate": f"{(tester.tests_passed/tester.tests_run*100):.1f}%",
            "detailed_results": tester.test_results
        }, f, indent=2)
    
    print(f"   Detailed results saved to: /app/test_reports/backend_api_results.json")
    
    if tester.tests_passed == tester.tests_run:
        print("\n🎉 All API tests passed!")
        return 0
    else:
        print(f"\n⚠️  {tester.tests_run - tester.tests_passed} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())