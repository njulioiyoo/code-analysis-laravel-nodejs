const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Disable Helmet completely for local development to avoid HTTPS issues
// app.use(helmet({
//   contentSecurityPolicy: false, // Disable CSP completely
//   crossOriginOpenerPolicy: false,
//   originAgentCluster: false,
//   hsts: false,
//   forceHttps: false
// }));
// Middleware to prevent HTTPS upgrades
app.use((req, res, next) => {
  // Override the setHeader method to prevent HTTPS-related headers
  const originalSetHeader = res.setHeader;
  res.setHeader = function(name, value) {
    // Block security headers that force HTTPS
    const blockedHeaders = [
      'strict-transport-security',
      'upgrade-insecure-requests', 
      'content-security-policy'
    ];
    
    if (blockedHeaders.includes(name.toLowerCase())) {
      console.log(`Blocked security header: ${name}`);
      return;
    }
    
    // If CSP header, remove upgrade-insecure-requests directive
    if (name.toLowerCase() === 'content-security-policy' && 
        typeof value === 'string' && 
        value.includes('upgrade-insecure-requests')) {
      value = value.replace(/upgrade-insecure-requests;?\s*/g, '');
      console.log(`Modified CSP header: ${value}`);
    }
    
    return originalSetHeader.call(this, name, value);
  };
  
  // Explicitly set headers to prevent HTTPS upgrade
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files with correct paths
app.use('/views/public', express.static('public'));
app.use('/views/components', express.static('components'));
app.use('/views', express.static('views'));

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Node.js App</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                background: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 500px;
            }
            h1 {
                color: #333;
                margin-bottom: 1rem;
            }
            p {
                color: #666;
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            .version {
                background: #f8f9fa;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                margin: 1rem 0;
                font-family: monospace;
            }
            .links {
                margin-top: 2rem;
            }
            .links a {
                display: inline-block;
                margin: 0 10px;
                padding: 0.5rem 1rem;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                transition: background 0.3s;
            }
            .links a:hover {
                background: #5a67d8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Welcome to Node.js App</h1>
            <p>Your Express.js application is running successfully!</p>
            <div class="version">Version: 1.0.0</div>
            <p>This is a containerized Node.js application with Docker support.</p>
            <div class="links">
                <a href="/dashboard">📊 Dashboard</a>
                <a href="/health">Health Check</a>
                <a href="/api">API Info</a>
                <a href="/db-test">Database Test</a>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Dashboard routes
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/views/dashboard-structured.html');
});

// Alternative dashboards
app.get('/dashboard-fixed', (req, res) => {
  res.sendFile(__dirname + '/views/vue-dashboard-fixed.html');
});

app.get('/dashboard-vue', (req, res) => {
  res.sendFile(__dirname + '/views/vue-dashboard.html');
});

app.get('/dashboard-vanilla', (req, res) => {
  res.sendFile(__dirname + '/views/dashboard.html');
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Node.js Code Analysis API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      'GET /': 'Welcome page',
      'GET /health': 'Health check',
      'GET /api': 'API information',
      'GET /db-test': 'Database connection test'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/db-test', async (req, res) => {
  try {
    const isConnected = await db.testConnection();
    if (isConnected) {
      const tables = await db.query('SHOW TABLES');
      res.json({
        status: 'connected',
        database: process.env.DB_DATABASE || 'codeanalysis',
        tables: tables,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        status: 'connection failed',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Testing database connection...');
  await db.testConnection();
});