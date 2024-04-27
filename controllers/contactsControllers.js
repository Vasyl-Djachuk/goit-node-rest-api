import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.status(200).send(contacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    next(HttpError(404));
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const removeContact = await contactsService.removeContact(id);
  if (removeContact) {
    res.status(200).json(removeContact);
  } else {
    next(HttpError(404));
  }
};

export const createContact = async (req, res) => {
  const addedContact = await contactsService.addContact(req.body);
  res.status(201).json(addedContact);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const editedContact = await contactsService.updateContact({
    ...req.body,
    id,
  });
  if (editedContact === null) return next(HttpError(404));
  res.status(200).json(editedContact);
};
