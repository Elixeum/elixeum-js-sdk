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
 *  GetNewContact model
 * @param {object} contactDraft - Object containing contact draft data from the form.
 * @returns {object} - Object with currencyCode, displayName, identifier, languageCode and person.
 */
CRM.prototype.GetNewContact = function (contactDraft) {
  return {
    currencyCode: "CZK",
    displayName: contactDraft.companyName,
    identifier: contactDraft.email,
    languageCode: "cs",
    person: {
      firstName: contactDraft.firstName,
      lastName: contactDraft.lastName,
      pin: contactDraft.email,
    },
  };
};

/**
 * ContactDraft model
 * @param {object} contactDraft - Object containing contact draft data from the form.
 * @returns {object} - Object containing formatted contract draft data.
 */
CRM.prototype.CreateContactDraftRequest = function (contactDraft) {
  let toCreateContact = this.GetNewContact(contactDraft);

  return this.httpClient.post("/party/api/contact", toCreateContact);
};

/**
 * ContactDraft model
 * @param {object} contactDraft - Object containing contact draft data from the form.
 * @param {string} contactId - Id of the previosly created contact.
 * @returns {object} - Object containing formatted customer data.
 */
CRM.prototype.CreateCustomerRequest = function (contactDraft, contactId) {
  let toCreateCustomer = {
    contactId: contactId,
    contact: this.GetNewContact(contactDraft),
    emailList: [
      {
        isActive: true,
        isMain: true,
        value: contactDraft.email,
      },
    ],
    telephoneList: [
      {
        isActive: true,
        isMain: true,
        value: contactDraft.phone,
      },
    ],
  };

  return this.httpClient.post("/party/api/customer", toCreateCustomer);
};
