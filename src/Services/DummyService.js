// This is only for features testing
// No real-world usage

/**
 * DummyService constructor
 * @constructor
 * @param {object} context - Context object for DI
 */
export function DummyService(context) {
    this.logger = context.logger;
    this.httpClient = context.httpClient;

    this.logger.log("DummyService instance created", "debug");
}

/**
 * TestHttpClient
 */
DummyService.prototype.TestHttpClient = function () {
    this.logger.log("DummyService TestHttpClient", "debug");

    let request = this.httpClient.get("todos/1");

    request.send({ "x-custom-header": "foo-bar" }).then((response) => {
        this.logger.log("DummyService TestHttpClient response", "debug");

        this.logger.log(JSON.stringify(response), "debug");
    }).catch((error) => {
        this.logger.log("DummyService TestHttpClient error", "debug");
        this.logger.log(error, "debug");
    });
};
