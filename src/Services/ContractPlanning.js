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
    contractData.typeNumber = 69;
  }

  if (contractData?.contractTypeId == null) {
    contractData.contractTypeId = "1348e339-be9a-47bc-b685-e6ad942f6fd9";
  }

  contractData.contractFields = [
    { customFieldId: "22d35354-cd3d-451b-81c4-94af534d8345", value: contractData.rooftop_type },
    { customFieldId: "c00d5545-52ff-4ddb-a8fc-a46e04058967", value: contractData.solar_panels },
  ];

  if (contractData.contractFields?.length > 0) {
    let index = 0;
    for (const contractField of contractData.contractFields) {
      contractField.order = index;
      index++;
    }
  }

  contractData.customs = {
    "22d35354-cd3d-451b-81c4-94af534d8345": contractData.rooftop_type,
    "c00d5545-52ff-4ddb-a8fc-a46e04058967": contractData.solar_panels,
  };

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
