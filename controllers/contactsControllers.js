import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import checkUniqueKeyValue from "../helpers/uniqueKeyError.js";

const checkId = (id, next) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(HttpError(400, "Invalid id"));
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).send(contacts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkId(id, next);
    const contact = await contactsService.getContactById(id);
    contact ? res.status(200).json(contact) : next(HttpError(404));
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkId(id, next);
    const removeContact = await contactsService.removeContact(id);
    removeContact ? res.status(200).json(removeContact) : next(HttpError(404));
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const addedContact = await contactsService.addContact(req.body);
    res.status(201).json(addedContact);
  } catch (err) {
    checkUniqueKeyValue(err, next);
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkId(id, next);
    const editedContact = await contactsService.updateContact(id, {
      ...req.body,
    });
    if (editedContact === null) return next(HttpError(404));
    res.status(200).json(editedContact);
  } catch (err) {
    checkUniqueKeyValue(err, next);
    next(err);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkId(id, next);
    const { favorite } = req.body;

    const status = await contactsService.updateContact(id, { favorite });
    status ? res.status(200).json(status) : next(HttpError(404));
  } catch (err) {
    next(err);
  }
};
