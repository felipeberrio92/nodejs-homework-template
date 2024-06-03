const contactSchema = require("../validation/validation.db");

const listContacts = async () => {
  try {
    const contacts = await contactSchema.find();
    return contacts;
  } catch (error) {
    return { error };
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await contactSchema.findById(contactId).exec();
    return contact;
  } catch (error) {
    return { error };
  }
};

const removeContact = async ({ id: contactId }) => {
  try {
    console.log(contactId);
    const contactRemoved = await contactSchema.findByIdAndDelete(contactId);
    return contactRemoved;
  } catch (error) {
    return { error };
  }
};

const addContact = async (body) => {
  try {
    const newContact = await contactSchema.create({ ...body, favorite: false });
    console.log(newContact);
    return { newContact, status: 200 };
  } catch (error) {
    return { error };
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contactToUpdate = await contactSchema
      .findByIdAndUpdate(contactId, body)
      .exec();
    return contactToUpdate;
  } catch (error) {
    return { error };
  }
};

const updateFavoriteStatusContact = async (contactId, body) => {
  try {
    const contactToUpdateFavorite = await contactSchema
      .findByIdAndUpdate(contactId, body)
      .exec();
    return contactToUpdateFavorite;
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
  updateFavoriteStatusContact,
};
