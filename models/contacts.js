const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");

const contactsPath = path.join(".", "models", "contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    return contacts.toString();
  } catch (error) {
    return { error };
  }
};

const getContactById = async (contactId) => {
  try {
    let message = "";
    const contacts = await fs.readFile(contactsPath);
    const dataToArray = JSON.parse(contacts);
    const filterContact = dataToArray.findIndex(
      (contact) => contact.id === contactId
    );
    if (filterContact === -1) {
      message = "Failed to get contact: The contact does not exist.";
      return { message, status: 404 };
    }
    return dataToArray[filterContact];
  } catch (error) {
    return { error };
  }
};

const removeContact = async ({ id: contactId }) => {
  try {
    let message = "";
    const contacts = await fs.readFile(contactsPath);
    const dataToArray = JSON.parse(contacts);
    const filterContact = dataToArray.findIndex(
      (contact) => contact.id === contactId
    );
    if (filterContact === -1) {
      message = "Failed to remove contact: The contact does not exist.";
      return { message, status: 404 };
    }
    dataToArray.splice(filterContact, 1);
    await fs.writeFile(contactsPath, JSON.stringify(dataToArray));
    message = "Contact was removed.";
    return { message, status: 200 };
  } catch (error) {
    return { error };
  }
};

const addContact = async (body) => {
  try {
    const name = body.name || null;
    const email = body.email || null;
    const phone = body.phone || null;
    let message = "";
    const contacts = await fs.readFile(contactsPath);
    const dataToArray = JSON.parse(contacts);
    const filterContact = dataToArray.findIndex(
      (contact) => contact.name === body.name
    );
    if (filterContact !== -1) {
      message = "Failed to create contact: The contact already exist.";
      return { message, status: 400 };
    }
    if (name === null) {
      message = "Failed to create contact: name field not found.";
      return { message, status: 400 };
    }
    if (email === null) {
      message = "Failed to create contact: email field not found.";
      return { message, status: 400 };
    }
    if (phone === null) {
      message = "Failed to create contact: phone field not found.";
      return { message, status: 400 };
    }
    const newContact = {
      id: uuid(),
      name: body.name,
      phone: body.phone,
      email: body.email,
    };
    dataToArray.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(dataToArray));
    return { newContact, status: 201 };
  } catch (error) {
    return { error };
  }
};

const updateContact = async (contactId, body) => {
  try {
    console.log("ContactId => ", contactId);
    console.log("body => ", body);
    const name = body.name || null;
    const email = body.email || null;
    const phone = body.phone || null;
    let message = "";
    const contacts = await fs.readFile(contactsPath);
    const dataToArray = JSON.parse(contacts);
    const filterContact = dataToArray.findIndex(
      (contact) => contact.id === contactId
    );
    console.log(filterContact);
    if (filterContact === -1) {
      message = "Failed to remove contact: The contact does not exist.";
      return { message, status: 404 };
    }
    if (name === null) {
      message = "Failed to create contact: name field not found.";
      return { message, status: 400 };
    }
    if (email === null) {
      message = "Failed to create contact: email field not found.";
      return { message, status: 400 };
    }
    if (phone === null) {
      message = "Failed to create contact: phone field not found.";
      return { message, status: 400 };
    }
    const updatedContact = {
      name,
      email,
      phone,
    };
    dataToArray[filterContact] = {
      ...dataToArray[filterContact],
      ...updatedContact,
    };
    await fs.writeFile(contactsPath, JSON.stringify(dataToArray));
    return { updatedContact, status: 200 };
  } catch (error) {
    return { error };
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
