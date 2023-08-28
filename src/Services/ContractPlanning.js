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
    contractData.contractTypeId = "efd2f66b-dd44-4727-9718-2a84e12de6c4";
  }

  contractData.contractFields = [
    { customFieldId: "7b249d38-b918-44ad-90c8-5dbdce222c1c", value: contractData.rooftop_type },
    { customFieldId: "7943ae28-0e05-460f-9575-6b83d86434ed", value: contractData.solar_panels },
  ];

  if (contractData.contractFields?.length > 0) {
    let index = 0;
    for (const contractField of contractData.contractFields) {
      contractField.order = index;
      index++;
    }
  }

  contractData.customs = {
    "7b249d38-b918-44ad-90c8-5dbdce222c1c": contractData.rooftop_type,
    "7943ae28-0e05-460f-9575-6b83d86434ed": contractData.solar_panels,
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
    contact: {
      roleType: 0,
      phone: "+1",
      displayName: "undefined undefined",
      person: {},
      addresses: [],
    },
  };

  let toCreateContract = {
    contract: newContract,
    document: newDocument,
  };

  return this.httpClient.post("/contract-planning-service/api/contract", toCreateContract);
};
