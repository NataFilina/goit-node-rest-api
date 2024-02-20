import crypto from "node:crypto";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContacts,
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
    if (!contact) {
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
    const contact = await removeContact(id);
    if (!contact) {
      throw new Error("Not found");
    }
    res.send(contact);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const createContact = async (req, res) => {
  const newContact = { id: crypto.randomUUID(), ...req.body };
  await addContact(newContact);
  res.status(201).send(newContact);
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    await updateContacts(id, req.body);
    const updatedContact = await getContactById(id);
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};
