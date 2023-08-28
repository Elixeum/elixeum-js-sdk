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

/**
 *  GetNewContract function
 * @param {object} contractData - Object containing contract data from the form.
 * @returns {object} - Object with typeNumber and contractTypeId.
 */
const getNewContract = (contractData) => {
  if (contractData?.typeNumber == null) {
    contractData.typeNumber = 1;
  }

  if (contractData?.contractTypeId == null) {
    contractData.contractTypeId = "6880ffff-fd4a-4d72-9515-3456e477bc65";
  }

  if (contractData.contractFields?.length > 0) {
    let index = 0;
    for (const contractField of contractData.contractFields) {
      contractField.order = index;
      index++;
    }
  }

  return contractData;
};

/**
 * ContractDraft model
 * @param {object} contractDraft - Object containing contract draft data from the form.
 * @returns {object} - Object containing formatted contract draft data.
 */
ContractPlanning.prototype.CreateContractDraftRequest = function (contractDraft) {
  let newContract = getNewContract(contractDraft);
  let newDocument = {
    date: new Date(),
    currencyCode: newContract.currencyCode ?? "CZK",
    contact: null,
  };

  let toCreateContract = {
    contract: newContract,
    document: newDocument,
  };

  return this.httpClient.post("/contract-planning-service/api/contract", toCreateContract);
};
