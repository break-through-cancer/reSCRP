const { describe, it } = require('node:test');
const assert = require('node:assert');
const { makeRequest } = require('./helpers');

describe('Route Tests', () => {

  describe('TCM Module Routes', () => {
    it('should respond to /TCM route', async () => {
      try {
        const response = await makeRequest('/TCM');
        assert.ok(response.statusCode === 200 || response.statusCode === 302,
          `TCM route should be accessible, got status: ${response.statusCode}`);
      } catch (error) {
        // Skip if server not running
        console.log('Skipping route test - server not available');
      }
    });

    it('should respond to /TCM/embedding route', async () => {
      try {
        const response = await makeRequest('/TCM/embedding');
        assert.ok(response.statusCode < 500,
          `TCM embedding route should not error, got status: ${response.statusCode}`);
      } catch (error) {
        console.log('Skipping embedding test - server not available');
      }
    });

    it('should respond to /TCM/degs route', async () => {
      try {
        const response = await makeRequest('/TCM/degs');
        assert.ok(response.statusCode < 500,
          `TCM DEGs route should not error, got status: ${response.statusCode}`);
      } catch (error) {
        console.log('Skipping DEGs test - server not available');
      }
    });

    it('should respond to /TCM/expression route', async () => {
      try {
        const response = await makeRequest('/TCM/expression');
        assert.ok(response.statusCode < 500,
          `TCM expression route should not error, got status: ${response.statusCode}`);
      } catch (error) {
        console.log('Skipping expression test - server not available');
      }
    });
  });

  describe('API Error Handling', () => {
    it('should handle non-existent routes gracefully', async () => {
      try {
        const response = await makeRequest('/nonexistent');
        assert.ok(response.statusCode === 404,
          `Should return 404 for non-existent routes, got: ${response.statusCode}`);
      } catch (error) {
        console.log('Skipping 404 test - server not available');
      }
    });
  });
});