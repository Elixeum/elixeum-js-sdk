/**
 * Trivial logger class
 * @constructor
 */
export function Logger() {
  this.prefix = "Elixeum SDK";
}

/**
 * Logs message to console
 * @param {string} message - Message to log
 * @param {string} level - Log level
 */
Logger.prototype.log = function (message, level = "info") {
  switch (level) {
    case "info":
      console.info(`${this.prefix} [INFO]: ${message}`);
      break;
    case "warn":
      console.warn(`${this.prefix} [WARN]: ${message}`);
      break;
    case "error":
      console.error(`${this.prefix} [ERROR]: ${message}`);
      break;
    case "debug":
      console.debug(`${this.prefix} [DEBUG]: ${message}`);
      break;
    default:
      console.log(`${this.prefix} [${level.toUpperCase()}]: ${message}`);
  }
};

/**
 * Logs message to console with level "info"
 * @param {string} message - Message to log
 */
Logger.prototype.info = function (message) {
  this.log(message, "info");
};

/**
 * Logs message to console with level "warn"
 * @param {string} message - Message to log
 */
Logger.prototype.warn = function (message) {
  this.log(message, "warn");
};

/**
 * Logs message to console with level "error"
 * @param {string} message - Message to log
 */
Logger.prototype.error = function (message) {
  this.log(message, "error");
};

/**
 * Logs message to console with level "debug"
 * @param {string} message - Message to log
 */
Logger.prototype.debug = function (message) {
  this.log(message, "debug");
};
