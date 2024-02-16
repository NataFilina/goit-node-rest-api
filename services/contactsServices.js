const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPat = path.join(__dirname, "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPat, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeContacts(newContact) {
  return fs.writeFile(contactsPat, JSON.stringify(newContact, undefined, 2));
}

async function listContacts() {
  return await readContacts();
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  return contacts.find((contact) => contact.id === contactId) ?? null;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index < 0) return null;
  const removedContact = contacts[index];
  contacts.splice(index, 1);
  await writeContacts(contacts);
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
