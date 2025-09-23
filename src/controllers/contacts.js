import { Contact } from '../db/models/contact.js';
import createError from 'http-errors';
import { createContactService, deleteContactService, updateContactService } from '../services/contacts.js';

export const getContactsAll = async (req, res) => {

      const contacts = await Contact.find();

      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
  };

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found')
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res, next) => {
  const { name, phoneNumber, contactType, email, isFavourite } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields: name, phoneNumber, or contactType');
  }

  const newContact = await createContactService({
    name,
    phoneNumber,
    contactType,
    email,
    isFavourite,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updateData = req.body;

  const updateContact = await updateContactService(contactId, updateData);

  if (!updateContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200, message: 'Successfully patched a contact!',
    data: updateContact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const deleteContact = await deleteContactService(contactId);

  if (!deleteContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
}