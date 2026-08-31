# VPN Vision Security Platform

A premium, interactive client-server cybersecurity protocol analysis web application designed for enterprise architectures. This application allows network security operators to securely ingest, assess, and monitor encrypted IPsec VPN traffic tunnels and cryptographic configurations.

## Architecture

This project is separated into a clean frontend client and backend server architecture:

- **Backend Server (`server.js`)**: An Express.js application handling:
  - File upload parsing (PCAPs/PCAPNGs).
  - Background PCAP security analysis simulations.
  - JSON API endpoints for Authentication, Telemetry metrics, Analysis task status polling, and Security Findings.
- **Frontend Client (`public/`)**: Decoupled HTML and JS static assets:
  - `public/index.html`: Obsidian-noir UI shell, Tailwind layout layers, and typography styles.
  - `public/app.js`: Interactive client controller. Handles custom routing, polls backend tasks, fetches telemetries, and updates DOM views.

## Technology Stack

- **Backend**: Node.js, Express, Multer, Cors.
- **Frontend**: HTML5, Vanilla ES6 JavaScript (Fetch API), Tailwind CSS CDN, Google Fonts, and Material Symbols.

## Installation & Running

Follow these steps to install backend dependencies and start the local server:

### 1. Install Dependencies
Run the following command in the project directory:
```bash
npm install
```

### 2. Start the Backend Server
Start the Express server:
```bash
npm start
```
The server will start on **`http://localhost:8000`**.

### 3. Open the Application
Navigate to **`http://localhost:8000`** in any modern web browser. The backend server automatically serves the frontend assets from the `public/` directory.
