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

export async function favoriteContacts(owner, page = 1, limit = 20) {
  const options = {
    page: page,
    limit: limit,
  };
  const data = await Contact.paginate(
    { owner, favorite: true },
    options,
    function (err, result) {
      return result.docs;
    }
  );
  return data;
  // find({ owner, favorite: true });
  // return data;
}

export async function getContactById(_id, owner) {
  const contact = await Contact.findOne({ _id, owner });
  return contact;
}

export async function removeContact(_id, owner) {
  await Contact.findOneAndDelete({ _id, owner });
}

export async function addContact(newContact) {
  const cratedContact = await Contact.create(newContact);
  return cratedContact;
}

export async function updateContacts(contactId, body) {
  const contact = await Contact.findOneAndUpdate({ _id: contactId }, body, {
    new: true,
  });
  return contact;
}

export async function updateStatusContact(contactId, body) {
  const contact = await Contact.findOneAndUpdate({ _id: contactId }, body, {
    new: true,
  });
  return contact;
}
