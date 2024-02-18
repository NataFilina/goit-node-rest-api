import crypto from "node:crypto";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContacts,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

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

export const createContact = async (req, res, next) => {
  try {
    const { error, value } = createContactSchema.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const newContact = { id: crypto.randomUUID(), ...value };
    await addContact(newContact);
    res.status(201).send(newContact);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (Object.keys(req.body).length <= 0) {
      throw new Error("Body must have at least one field");
    }
    const { error, value } = updateContactSchema.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    await updateContacts(id, value);
    const updatedContact = await getContactById(id);
    res.status(200).send(updatedContact);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
