import HttpError from "../helpers/HttpError.js";
import checkUniqueKeyValue from "../helpers/uniqueKeyError.js";
import checkId from "../helpers/checkId.js";
import Contacts from "../model/contact.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contacts.find();
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
    const contact = await Contacts.findOne({ _id: id });
    contact ? res.status(200).json(contact) : next(HttpError(404));
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkId(id, next);
    const removeContact = await Contacts.findByIdAndDelete({ _id: id });
    removeContact ? res.status(200).json(removeContact) : next(HttpError(404));
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const addedContact = await Contacts.create(req.body);
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
    const editedContact = await Contacts.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true }
    );
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

    const status = await Contacts.findByIdAndUpdate(
      { _id: id },
      { favorite },
      { new: true }
    );
    status ? res.status(200).json(status) : next(HttpError(404));
  } catch (err) {
    next(err);
  }
};
