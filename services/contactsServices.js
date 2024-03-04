import Contact from "../models/contact.js";

export async function listContacts(owner, page = 1, limit = 20) {
  const options = {
    page: page,
    limit: limit,
  };

  const data = await Contact.paginate(
    { owner },
    options,
    function (err, result) {
      return result.docs;
    }
  );
  return data;
}

export async function favoriteContacts(owner) {
  const data = await Contact.find({ owner, favorite: true });
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
