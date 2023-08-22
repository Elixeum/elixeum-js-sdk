/**
 * Contract Planning module constructor
 * @constructor
 * @param {object} context - Context object for DI
 */
export function ContractPlanning(context) {
    this.logger = context.logger;
    this.httpClient = context.httpClient;

    this.logger.log("ContractPlanning instance created", "debug");
}

/**
 * ContractModel model
 * @param {string} name - Name used in the message.
 */
ContractPlanning.prototype.ContractModel = function () {
    this.userId = 0;
    this.id = 0;
    this.title = "";
    this.completed = true;
};
