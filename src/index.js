import { CRM } from "./Services/CRM.js";
import { ContractPlanning } from "./Services/ContractPlanning.js";
import { DummyService } from "./Services/DummyService.js";
import { HttpClient } from "./Utilities/HttpClient.js";
import { Logger } from "./Utilities/Logger.js";

/**
 * ElixeumClient constructor
 * @constructor
 * @param {object} config - Configuration object
 */
function ElixeumClient(config) {
  this.configuration = config;
  this.logger = new Logger();

  // Validate config
  if (!this.validateConfig(this.configuration)) {
    this.logger.log("SDK failed to initialize, invalid configuration!", "error");
    return;
  }

  this.logger.log("SDK initialization started", "info");

  this.logger.log("Creating new HTTP client", "debug");

  // Prepare HTTP client
  this.httpClient = new HttpClient(this.configuration.api, this.logger);
  this.httpClient.setToken(this.configuration.token);

  // Create DI context
  const context = {
    logger: this.logger,
    httpClient: this.httpClient,
  };

  // Initialize services
  this.ContractPlanning = () => new ContractPlanning(context);
  this.CRM = () => new CRM(context);
  this.DummyService = () => new DummyService(context);
}

/**
 * Validates configuration object
 * @param {object} configObject - Configuration object
 * @returns {boolean} - True if config is valid, false otherwise
 */
ElixeumClient.prototype.validateConfig = function (configObject) {
  if (typeof configObject !== "object" || configObject === null) {
    this.logger.log("Invalid config object. Must be an object.", "error");
    return false;
  }

  const requiredKeys = ["api", "token"];
  const missingKeys = requiredKeys.filter((key) => !(key in configObject));

  if (missingKeys.length > 0) {
    this.logger.log(`Missing keys in config object: ${missingKeys.join(", ")}`, "error");
    return false;
  }

  // Check if `api` key is real and valid URL
  try {
    new URL(configObject.api);
  } catch (_) {
    this.logger.log("Invalid API URL", "error");
    return false;
  }

  // Check if `api` is containing `elixeum.cloud` domain
  if (!configObject.api.includes("elixeum.cloud")) {
    this.logger.log("The API URL should be pointing to elixeum.cloud domain", "warn");
  }

  // All checks passed
  this.logger.log("Configuration object appears to be valid", "info");

  return true;
};

export default ElixeumClient;
