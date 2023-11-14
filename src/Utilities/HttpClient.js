/**
 * HTTP client for API requests
 * @constructor
 * @param {string} baseUrl - Base URL for API
 * @param {object} logger - Logger object
 */
export function HttpClient(baseUrl, logger) {
  this.baseUrl = baseUrl;
  this.accessToken = null;
  this.logger = logger;
}

/**
 * Sends GET request
 * @param {string} endpoint - API endpoint without base URL
 * @returns {Request} - Request object
 */
HttpClient.prototype.get = function (endpoint) {
  const request = new this.Request("GET", endpoint, null, this.makeRequest.bind(this));
  return request;
};

/**
 * Sends POST request
 * @param {string} endpoint - API endpoint without base URL
 * @param {object} data - Data to send
 * @returns {Request} - Request object
 */
HttpClient.prototype.post = function (endpoint, data) {
  const request = new this.Request("POST", endpoint, data, this.makeRequest.bind(this));
  return request;
};

/**
 * Sends PUT request
 * @param {string} endpoint - API endpoint without base URL
 * @param {object} data - Data to send
 * @returns {Request} - Request object
 */
HttpClient.prototype.put = function (endpoint, data) {
  const request = new this.Request("PUT", endpoint, data, this.makeRequest.bind(this));
  return request;
};

/**
 * Sets JWT token for HTTP client
 * @param {string} token - JWT token to set
 * @returns {void}
 */
HttpClient.prototype.setToken = function (token) {
  this.accessToken = token;
};

/**
 * Creates Request object with delayed send method
 * @constructor
 * @param {string} method - HTTP method GET, POST, PUT, DELETE
 * @param {string} endpoint - API endpoint without base URL
 * @param {object} data - Data to send
 * @param {function} makeRequest - Function to make request
 * @returns {void}
 */
HttpClient.prototype.Request = function (method, endpoint, data, makeRequest) {
  this.send = function (extraHeaders = {}) {
    return makeRequest(method, endpoint, data, extraHeaders);
  };
};

/**
 * Makes HTTP request
 * @param {string} method - HTTP method GET, POST, PUT, DELETE
 * @param {string} endpoint - API endpoint without base URL
 * @param {object} data - Data to send
 * @param {object} headers - Extra headers to send if any
 * @returns {Promise} - Promise object with response
 */
HttpClient.prototype.makeRequest = function (method, endpoint, data, headers = {}) {
  this.logger.log(`HTTP Request ${method} ${this.baseUrl}${endpoint}`, "debug");

  return new Promise((resolve, reject) => {
    const url = this.baseUrl + endpoint;
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (this.accessToken) {
      options.headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          reject(new Error("Network response was not ok"));
        }

        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
