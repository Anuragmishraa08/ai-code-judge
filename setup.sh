#!/bin/bash
cd backend
cp .env.example .env
echo "Backend .env created"
cd ../frontend
cp .env.example .env
echo "Frontend .env created"
echo "✓ Setup complete! Install dependencies with: npm install (in both directories)"
