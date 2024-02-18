import fs from "node:fs/promises";
import path from "node:path";

const contactsPat = path.join(process.cwd(), "./db/contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPat, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeContacts(newContact) {
  return fs.writeFile(contactsPat, JSON.stringify(newContact, undefined, 2));
}

export async function listContacts() {
  return await readContacts();
}

export async function getContactById(contactId) {
  const contacts = await readContacts();
  return contacts.find((contact) => contact.id === contactId) ?? null;
}

export async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index < 0) return null;
  const removedContact = contacts[index];
  contacts.splice(index, 1);
  await writeContacts(contacts);
  return removedContact;
}

export async function addContact(newContact) {
  const contacts = await readContacts();
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

export async function updateContacts(contactId, body) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    throw new Error("Not found");
  }
  const updatedContact = { ...contacts[index], ...body };
  contacts[index] = updatedContact;
  await writeContacts(contacts);
  return updatedContact;
}
