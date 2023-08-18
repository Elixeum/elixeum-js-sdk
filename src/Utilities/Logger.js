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
