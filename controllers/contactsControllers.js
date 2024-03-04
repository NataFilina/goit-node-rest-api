import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContacts,
  updateStatusContact,
  favoriteContacts,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const favorite = req.query.favorite;
  try {
    let contacts = await listContacts(req.user._id, page, limit);

    if (favorite) {
      contacts = await favoriteContacts(req.user._id);
    }
    res.send(contacts);
  } catch (error) {
    next(HttpError(500, "Internal server error"));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    if (contact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404, "Contact not found");
    }
    res.send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    if (contact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404, "Contact not found");
    }
    await removeContact(id);
    res.send(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res) => {
  const newContact = { ...req.body, owner: req.user._id };
  const cratedContact = await addContact(newContact);
  res.status(201).send(cratedContact);
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    if (contact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404, "Contact not found");
    }
    const updatedContact = await updateContacts(id, req.body);
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    if (contact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404, "Contact not found");
    }
    const updatedContact = await updateStatusContact(id, req.body);
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};
