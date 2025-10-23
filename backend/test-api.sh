#!/bin/bash

# Frete Inteligente - API Test Script
# This script tests the basic API endpoints

API_URL="http://localhost:3000"
echo "🚀 Testing Frete Inteligente API at $API_URL"
echo ""

# Test 1: Health check
echo "1️⃣ Testing API health..."
HEALTH=$(curl -s $API_URL)
if [[ $HEALTH == *"Frete Inteligente API"* ]]; then
    echo "✅ API is running!"
else
    echo "❌ API is not responding correctly"
    exit 1
fi
echo ""

# Test 2: Register a passenger
echo "2️⃣ Registering a test passenger..."
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "cpf": "12345678901",
    "phone": "85999999999",
    "password": "test123",
    "userType": "passenger"
  }')

if [[ $REGISTER_RESPONSE == *"token"* ]]; then
    echo "✅ User registered successfully!"
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
else
    echo "⚠️  User may already exist, trying login..."
fi
echo ""

# Test 3: Login
echo "3️⃣ Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    echo "✅ Login successful!"
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
else
    echo "❌ Login failed"
    echo $LOGIN_RESPONSE
    exit 1
fi
echo ""

# Test 4: Get profile
echo "4️⃣ Testing authenticated request (get profile)..."
PROFILE_RESPONSE=$(curl -s $API_URL/api/auth/profile \
  -H "Authorization: Bearer $TOKEN")

if [[ $PROFILE_RESPONSE == *"email"* ]]; then
    echo "✅ Profile retrieved successfully!"
else
    echo "❌ Failed to get profile"
    echo $PROFILE_RESPONSE
    exit 1
fi
echo ""

# Test 5: List trips
echo "5️⃣ Testing trips endpoint..."
TRIPS_RESPONSE=$(curl -s $API_URL/api/trips \
  -H "Authorization: Bearer $TOKEN")

if [[ $TRIPS_RESPONSE == *"trips"* ]]; then
    echo "✅ Trips endpoint working!"
else
    echo "❌ Trips endpoint failed"
    echo $TRIPS_RESPONSE
    exit 1
fi
echo ""

echo "🎉 All tests passed! API is working correctly."
echo ""
echo "Next steps:"
echo "1. Start the transport-app: cd transport-app && npm start"
echo "2. Configure the API_BASE_URL in transport-app/src/services/api.js"
echo "3. Scan QR code with Expo Go app"
