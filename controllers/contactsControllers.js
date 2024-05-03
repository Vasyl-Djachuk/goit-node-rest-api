import HttpError from "../helpers/HttpError.js";
import checkUniqueKeyValue from "../helpers/uniqueKeyError.js";
import checkId from "../helpers/checkId.js";
import Contacts from "../model/contact.js";

const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, favorite = null } = req.query;
    const skip = (page - 1) * limit;

    let searchParams = { owner: req.user.id };

    if (favorite === "true" || favorite === "false")
      searchParams.favorite = favorite;

    const contacts = await Contacts.find(searchParams, null, {
      skip,
      limit,
    });
    res.status(200).send(contacts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkId(id, next);
    const contact = await Contacts.findOne({ _id: id });
    if (!contact || contact.owner?.toString() !== req.user.id) {
      return next(HttpError(404));
    }
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkId(id, next);

    const removeContact = await Contacts.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
    removeContact ? res.status(200).json(removeContact) : next(HttpError(404));
  } catch (err) {
    next(err);
  }
};

const createContact = async (req, res, next) => {
  try {
    const addedContact = await Contacts.create({
      ...req.body,
      owner: req.user.id,
    });
    res.status(201).json(addedContact);
  } catch (err) {
    checkUniqueKeyValue(err, next);
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkId(id, next);
    const editedContact = await Contacts.findOneAndUpdate(
      { _id: id, owner: req.user.id },
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

const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    checkId(id, next);
    const { favorite } = req.body;

    const status = await Contacts.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      { favorite },
      { new: true }
    );
    status ? res.status(200).json(status) : next(HttpError(404));
  } catch (err) {
    next(err);
  }
};
export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
