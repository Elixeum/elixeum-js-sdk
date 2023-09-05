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
    contractData.typeNumber = 414;
  }

  if (contractData?.contractTypeId == null) {
    contractData.contractTypeId = "52b4807d-aaeb-4522-bd49-b8c3e8375a70";
  }

  contractData.contractFields = [
    { customFieldId: "6e69b2ce-18ff-475e-95e6-a09a0bd84de6", value: contractData.rooftop_type },
    { customFieldId: "8cff81e9-160c-4ebc-bb2d-dd3f931314b8", value: contractData.solar_panels },
  ];

  if (contractData.contractFields?.length > 0) {
    let index = 0;
    for (const contractField of contractData.contractFields) {
      contractField.order = index;
      index++;
    }
  }

  contractData.customs = {
    "6e69b2ce-18ff-475e-95e6-a09a0bd84de6": contractData.rooftop_type,
    "8cff81e9-160c-4ebc-bb2d-dd3f931314b8": contractData.solar_panels,
  };

  return contractData;
};

/**
 * GetNewDocument function
 * @param {object} contractData - Object containing contract data from the form.
 * @returns {object} - Object with date, currencyCode and contact.
 */
const getNewDocument = (contractData) => {
  let contact = contractData?.contact_information ?? {};

  let newDocument = {
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
ContractPlanning.prototype.CreateContractDraftRequest = function (contractDraft) {
  let newContract = getNewContract(contractDraft);
  let newDocument = getNewDocument(contractDraft);

  let toCreateContract = {
    contract: newContract,
    document: newDocument,
  };

  return this.httpClient.post("/contract-planning-service/api/contract", toCreateContract);
};
