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
    currencyCode: contactDraft.currencyCode,
    displayName: contactDraft.companyName,
    identifier: contactDraft.email,
    languageCode: contactDraft.languageCode,
    contactRoleList: [],
    person: {
      firstName: contactDraft.firstName,
      lastName: contactDraft.lastName,
      pin: contactDraft.email,
    },
  };
};

/**
 * ContactMethodType model
 * @returns {object} - Object containing contact method type data.
 */
CRM.prototype.GetContactMethodTypes = function () {
  return this.httpClient.get("/party/api/contact-method-type");
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
CRM.prototype.CreateCustomerRequest = async function (contactDraft, contactId) {
  let contact = this.GetNewContact(contactDraft);
  let contactMethodTypes = this.GetContactMethodTypes()
    .send()
    .then(async (response) => {
      return await response;
    });

  let contactMethodType = (await contactMethodTypes)[0];

  contact.contactRoleList = [{ id: contactId, roleType: 0, displayName: contactDraft.displayName }];

  let toCreateCustomer = {
    contactId: contactId,
    contact: contact,
    emailList: [
      {
        contactMethodType: contactMethodType,
        isActive: true,
        isMain: true,
        value: contactDraft.email,
      },
    ],
    telephoneList: [
      {
        contactMethodType: contactMethodType,
        isActive: true,
        isMain: true,
        value: contactDraft.telephone,
      },
    ],
  };

  return this.httpClient.post("/party/api/customer", toCreateCustomer);
};
