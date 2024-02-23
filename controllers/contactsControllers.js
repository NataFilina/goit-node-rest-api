import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContacts,
  updateStatusContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.send(contacts);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (contact === null) {
      throw new Error("Not found");
    }
    res.send(contact);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (contact === null) {
      throw new Error("Not found");
    }
    await removeContact(id);
    res.send(contact);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const createContact = async (req, res) => {
  const newContact = { ...req.body };
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
    const updatedContact = await updateStatusContact(id, req.body);
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};
