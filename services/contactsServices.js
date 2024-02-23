import Contact from "../models/contact.js";

export async function listContacts() {
  const data = await Contact.find();
  return data;
}

export async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}

export async function removeContact(contactId) {
  await Contact.findByIdAndDelete(contactId);
}

export async function addContact(newContact) {
  const cratedContact = await Contact.create(newContact);
  return cratedContact;
}

export async function updateContacts(contactId, body) {
  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return contact;
}

export async function updateStatusContact(contactId, body) {
  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return contact;
}
