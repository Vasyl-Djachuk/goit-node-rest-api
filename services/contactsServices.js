import Contacts from "../schemas/dbSchemas.js";

async function listContacts() {
  return Contacts.find();
}

async function getContactById(contactId) {
  return Contacts.findOne({ _id: contactId });
}

async function removeContact(contactId) {
  return Contacts.findByIdAndDelete({ _id: contactId });
}

async function addContact({ name, email, phone, favorite }) {
  return Contacts.create({ name, email, phone, favorite });
}
async function updateContact(id, fields) {
  return Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true });
}

export default {
  addContact,
  removeContact,
  getContactById,
  listContacts,
  updateContact,
};
