#!/usr/bin/env node

/**
 * Quick Diagnostic Tool for Invest App
 * Tests all connections and requirements
 * 
 * Usage: node diagnose.js
 */

const http = require('http');
const { exec } = require('child_process');
const path = require('path');

console.log('🔍 Invest Application Diagnostic Tool\n');

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

// Test 1: Check if ports are available
test('Port 3000 (Backend)', async () => {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:3000', { method: 'GET' }, (res) => {
      resolve(res.statusCode === 404 ? '✅ Backend running' : '⚠️  Unexpected response');
    });
    req.on('error', () => {
      resolve('❌ Backend not running on port 3000');
    });
    req.end();
  });
});

test('Port 5173 (Frontend Dev)', async () => {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:5173', { method: 'GET' }, (res) => {
      resolve('✅ Frontend dev server running');
    });
    req.on('error', () => {
      resolve('❌ Frontend dev server not running on port 5173');
    });
    req.end();
  });
});

test('Port 4173 (Frontend Preview)', async () => {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:4173', { method: 'GET' }, (res) => {
      resolve('✅ Frontend preview server running');
    });
    req.on('error', () => {
      resolve('❌ Frontend preview server not running on port 4173');
    });
    req.end();
  });
});

// Test 2: Check MongoDB endpoint
test('API Endpoint /api/auth/login', async () => {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ email: 'test@example.com', password: 'test' });
    const req = http.request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 500) {
          resolve('⚠️  Endpoint exists but backend error (likely MongoDB issue)');
        } else if (res.statusCode === 401) {
          resolve('✅ Auth endpoint working (user not found/invalid)');
        } else {
          resolve(`⚠️  Unexpected status: ${res.statusCode}`);
        }
      });
    });
    req.on('error', () => {
      resolve('❌ Cannot reach backend API');
    });
    req.write(postData);
    req.end();
  });
});

// Run all tests
async function runTests() {
  console.log('Running tests...\n');
  
  for (const { name, fn } of tests) {
    try {
      const result = await fn();
      console.log(`${name.padEnd(40)} ${result}`);
    } catch (error) {
      console.log(`${name.padEnd(40)} ❌ Error: ${error.message}`);
    }
  }

  console.log('\n📋 Summary:');
  console.log('✅ = Ready');
  console.log('❌ = Not running / error');
  console.log('⚠️  = Running but may have issues');
  console.log('\n💡 If backend shows "not running":\n  1. cd server\n  2. node server.js\n');
  console.log('💡 If frontend shows "not running":\n  1. cd Client\n  2. npm run dev\n');
}

runTests();
