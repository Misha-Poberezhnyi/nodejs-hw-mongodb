import createHttpError from "http-errors";
import { Contact } from "../db/models/contact.js";
import { saveFileLocal } from "../utils/saveFileLocal.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { saveFile } from "../utils/saveFile.js";

export const createContactService = async (contactData, userId) => {
    const newContact = new Contact({...contactData,userId});
    await newContact.save();
    return newContact;
};

export const updateContactService = async (contactId, updateData, userId) => {
    return await Contact.findByIdAndUpdate(
        { _id: contactId, userId },
        updateData,
        { new: true }
    );
};


export const uploadContactsPhoto = async (contactId, file) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

    const filePath = await saveFile(file);

  contact.photo = filePath;
  await contact.save();

  return contact;
};


export const deleteContactService = async (contactId, userId) => {
    return await Contact.findOneAndDelete({ _id: contactId, userId });
}