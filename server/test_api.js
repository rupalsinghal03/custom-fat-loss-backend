// Test file for Authentication APIs
// Run this file to test the endpoints

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/users';

// Test data
const testUser = {
    fullname: "Test User",
    phone: "+919876543210",
    email: "test.user@example.com",
    college: "Test University",
    password: "testpassword123"
};

// Test signup
async function testSignup() {
    try {
        console.log('Testing Signup...');
        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });
        
        const data = await response.json();
        console.log('Signup Response:', data);
        return data;
    } catch (error) {
        console.error('Signup Error:', error);
    }
}

// Test login with email
async function testLoginWithEmail() {
    try {
        console.log('\nTesting Login with Email...');
        const response = await fetch(`${BASE_URL}/login/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        
        const data = await response.json();
        console.log('Login Response:', data);
        return data;
    } catch (error) {
        console.error('Login Error:', error);
    }
}

// Test send OTP
async function testSendOTP() {
    try {
        console.log('\nTesting Send OTP...');
        const response = await fetch(`${BASE_URL}/login/phone/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: testUser.phone
            })
        });
        
        const data = await response.json();
        console.log('Send OTP Response:', data);
        return data;
    } catch (error) {
        console.error('Send OTP Error:', error);
    }
}

// Test verify OTP (you'll need to use the OTP from the previous response)
async function testVerifyOTP(otp) {
    try {
        console.log('\nTesting Verify OTP...');
        const response = await fetch(`${BASE_URL}/login/phone/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: testUser.phone,
                otp: otp
            })
        });
        
        const data = await response.json();
        console.log('Verify OTP Response:', data);
        return data;
    } catch (error) {
        console.error('Verify OTP Error:', error);
    }
}

// Run all tests
async function runTests() {
    console.log('Starting API Tests...\n');
    
    // Test signup
    const signupResult = await testSignup();
    
    if (signupResult.success) {
        // Test login with email
        await testLoginWithEmail();
        
        // Test send OTP
        const otpResult = await testSendOTP();
        
        if (otpResult.success && otpResult.data.otp) {
            // Test verify OTP
            await testVerifyOTP(otpResult.data.otp);
        }
    }
    
    console.log('\nTests completed!');
}

// Uncomment the line below to run tests
// runTests();

export { testSignup, testLoginWithEmail, testSendOTP, testVerifyOTP, runTests };
