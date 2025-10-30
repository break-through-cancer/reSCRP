const http = require('node:http');

/**
 * Helper function to make HTTP requests for testing
 * @param {string} path - The URL path to request
 * @param {string} method - HTTP method (default: 'GET')
 * @param {number} port - Port number (default: 3001)
 * @returns {Promise<{statusCode: number, headers: object, body: string}>}
 */
function makeRequest(path, method = 'GET', port = 3001) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

module.exports = {
  makeRequest
};
