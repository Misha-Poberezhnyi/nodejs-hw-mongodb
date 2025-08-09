import { updateContact } from "../controllers/contacts.js";
import { Contact } from "../db/models/contact.js";

export const createContactService = async (contactData) => {
    const newContact = new Contact(contactData);
    await newContact.save();
    return newContact;
};

export const updateContactService = async (contactId, updateData) => {
    const updateContact = await Contact.findByIdAndUpdate(
        contactId, updateData, { new: true }
    );
    return updateContact;
};

export const deleteContactService = async (contactId) => {
    const result = await Contact.findByIdAndDelete(contactId);
    return result;
}