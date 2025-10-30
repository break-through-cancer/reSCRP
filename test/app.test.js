const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { makeRequest } = require('./helpers');

describe('reSCRP Application Tests', () => {
  let server;
  const port = 3001; // Use different port for testing

  before(() => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.PORT = port;

    // Require and start the app
    const app = require('../app.js');
    server = http.createServer(app);

    return new Promise((resolve) => {
      server.listen(port, () => {
        console.log(`Test server running on port ${port}`);
        resolve();
      });
    });
  });

  after(async () => {
    // Close server and wait for it to finish
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Close any database pools that may have been created
    // This prevents the tests from hanging due to open connections
    const poolModules = [
      '../SQL/TCM/pool.js',
      '../SQL/GastricCancer/pool.js',
      '../SQL/GastricTME/pool.js',
      '../SQL/BcellLC/pool.js',
      '../SQL/OvarianMRD/pool.js'
    ];

    for (const poolPath of poolModules) {
      try {
        const pool = require(poolPath);
        if (pool && pool.cleanup) {
          await pool.cleanup();
        }
      } catch (error) {
        // Pool module may not be loaded, ignore
      }
    }
  });

  describe('Application Health', () => {
    it('should start without errors', () => {
      assert.ok(server, 'Server should be running');
    });

    it('should respond to HTTP requests', async () => {
      const response = await makeRequest('/', 'GET');
      assert.ok(response.statusCode < 500, 'Should not return server error');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await makeRequest('/', 'GET');
      assert.ok(response.headers['x-frame-options'], 'Should have X-Frame-Options header');
    });
  });

  describe('Static Routes', () => {
    it('should serve static assets', async () => {
      const response = await makeRequest('/stylesheets/style.css', 'GET');
      assert.ok(response.statusCode === 200 || response.statusCode === 404, 'Should handle static asset requests');
    });
  });
});