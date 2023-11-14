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
 *  GetNewContract model
 * @param {object} dataFromForm - Object containing contract data from the form.
 * @param {object} dataFromPortal - Object containing contract data from the portal. (custom fields, contract type, etc.)
 * @returns {object} - Object with typeNumber, contractTypeId and contractFields.
 */
ContractPlanning.prototype.GetNewContract = function (dataFromForm, dataFromPortal) {
  dataFromForm.typeNumber = dataFromPortal.contract?.typeNumber;
  dataFromForm.contractTypeId = dataFromPortal.contract?.contractTypeId;
  dataFromForm.contractFields = dataFromPortal.customFields;

  if (dataFromForm.contractFields?.length > 0) {
    let index = 0;
    for (const contractField of dataFromForm.contractFields) {
      contractField.order = index;
      index++;
    }
  }

  return dataFromForm;
};

/**
 * GetNewDocument model
 * @param {object} contractData - Object containing contract data from the form.
 * @returns {object} - Object with date, currencyCode and contact.
 */
ContractPlanning.prototype.GetNewDocument = function (contractData) {
  const contact = contractData?.contact_information ?? {};

  const newDocument = {
    date: new Date(),
    currencyCode: contractData.currencyCode ?? "CZK",
    contact: contact,
  };

  return newDocument;
};

/**
 * ContractDraft model
 * @param {object} contractDraft - Object containing contract draft data from the form.
 * @returns {object} - Object containing formatted contract draft data.
 */
ContractPlanning.prototype.CreateContractDraftRequest = function (dataFromForm, dataFromPortal) {
  const newContract = this.GetNewContract(dataFromForm, dataFromPortal);
  const newDocument = this.GetNewDocument(dataFromForm);

  const toCreateContract = {
    contract: newContract,
    document: newDocument,
  };

  return this.httpClient.post("/contract-planning-service/api/contract", toCreateContract);
};
