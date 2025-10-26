#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Admin Panel Setup & Start${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo -e "${YELLOW}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found:${NC} $(node --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo ""
fi

echo -e "${GREEN}Starting server...${NC}"
echo ""
echo -e "${BLUE}Admin Panel:${NC} http://localhost:3000/admin/login.html"
echo -e "${BLUE}API Endpoint:${NC} http://localhost:3000/api"
echo ""
echo -e "${YELLOW}Login Credentials:${NC}"
echo "  Username: admin"
echo "  Password: password"
echo ""
echo -e "${GREEN}Press Ctrl+C to stop the server${NC}"
echo ""
echo -e "${BLUE}================================${NC}"
echo ""

# Start the server
node server.js
