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
    displayName: contactDraft.firstName + " " + contactDraft.lastName,
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
 * ToTimestampFromDate model
 * @param {object} value - Object containing date value.
 * @returns {object} - Object with seconds and nanos.
 */
CRM.prototype.ToTimestampFromDate = function (value) {
  // eslint-disable-next-line eqeqeq
  if (value == null || value === "") {
    return {
      seconds: 0,
      nanos: 0,
    };
  }

  //NOTE: Implicit conversion from js string to Date object
  let dateValue = value;
  if (typeof value === "string" || value instanceof String) {
    dateValue = new Date(value);
  }

  const timestamp = {
    seconds: Math.floor(dateValue.getTime() / 1000),
    nanos: (dateValue.getTime() % 1000) * 1e6,
  };

  return timestamp;
};

/**
 * ContactMethodType model
 * @returns {object} - Object containing contact method type data.
 */
CRM.prototype.GetContactMethodTypes = function () {
  return this.httpClient.get("/party/api/contact-method-type");
};

/**
 * NoteType model
 * @returns {object} - Object containing note type data.
 */
CRM.prototype.GetNoteTypes = function () {
  return this.httpClient.get("/party/api/note-type");
};

/**
 * ContactDraft model
 * @param {object} contactDraft - Object containing contact draft data from the form.
 * @returns {object} - Object containing formatted contract draft data.
 */
CRM.prototype.CreateContactDraftRequest = function (contactDraft) {
  const toCreateContact = this.GetNewContact(contactDraft);

  return this.httpClient.post("/party/api/contact", toCreateContact);
};

/**
 * ContactDraft model
 * @param {object} contactDraft - Object containing contact draft data from the form.
 * @param {string} contactId - Id of the previosly created contact.
 * @returns {object} - Object containing formatted customer data.
 */
CRM.prototype.CreateCustomerRequest = async function (contactDraft, contactId) {
  const contact = this.GetNewContact(contactDraft);
  const contactMethodTypes = this.GetContactMethodTypes()
    .send()
    .then(async (response) => {
      return await response;
    });

  const noteTypes = this.GetNoteTypes()
    .send()
    .then(async (response) => {
      return await response;
    });

  const getType = async (typeOfWhat) => {
    let types = [];

    if (typeOfWhat === "contactMethod") {
      types = await contactMethodTypes;
    } else if (typeOfWhat === "note") {
      types = await noteTypes;
    }

    return types.find(({ code }) => code === "OTHER") ?? types[0];
  };

  const contactMethodType = await getType("contactMethod");
  const noteType = await getType("note");

  contact.contactRoleList = [{ id: contactId, roleType: 0, displayName: contactDraft.displayName }];

  const toCreateCustomer = {
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
    noteList: [
      {
        userId: "",
        created: this.ToTimestampFromDate(new Date()),
        noteType: noteType,
        text: contactDraft.note,
      },
    ],
  };

  return this.httpClient.post("/party/api/customer", toCreateCustomer);
};
