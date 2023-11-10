/**
 * CRM module constructor
 * @constructor
 * @param {object} context - Context object for DI
 */
export function CRM(context) {
  this.logger = context.logger;
  this.httpClient = context.httpClient;

  this.logger.log("CRM instance created", "debug");
}

/**
 * ContactModel model
 * @param {string} name - Name used in the message.
 */
CRM.prototype.ContactModel = function () {
  this.userId = 0;
  this.id = 0;
  this.title = "";
  this.completed = true;
};

/**
 * ContactDraft model
 * @param {object} contactDraft - Object containing contact draft data from the form.
 * @returns {object} - Object containing formatted contract draft data.
 */
CRM.prototype.CreateContactDraftRequest = function (contactDraft) {
  console.log(contactDraft);

  let toCreateContact = {
    currencyCode: "CZK",
    displayName: contactDraft.displayName,
    identifier: contactDraft.email,
    languageCode: "cs",
    person: {
      firstName: contactDraft.firstName,
      lastName: contactDraft.lastName,
      pin: contactDraft.email,
    },
  };

  console.log(toCreateContact);

  // TODO: get Id from created contact and create customer with email and telephone from the example form (/party/api/customer)

  return this.httpClient.post("/party/api/contact", toCreateContact);
};
