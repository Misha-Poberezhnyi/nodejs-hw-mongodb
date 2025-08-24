import { updateContact } from "../controllers/contacts.js";
import { Contact } from "../db/models/contact.js";

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

export const deleteContactService = async (contactId, userId) => {
    return await Contact.findOneAndDelete({ _id: contactId, userId });
}