import { Contact } from '../db/models/contact.js';
import createError from 'http-errors';
import { createContactService, deleteContactService, updateContactService, uploadContactsPhoto } from '../services/contacts.js';


export const getContactsAll = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const skip = (page - 1) * perPage;

  const allowedSortFields = ['name'];
  const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'name';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  const sortOptions = { [sortBy]: sortOrder };

  const filter = {userId: req.user._id};

  if (req.query.type) {
    filter.contactType = req.query.type;
  }
  if (req.query.isFavourite !== undefined) {
    filter.isFavourite = req.query.isFavourite === 'true';
  }

  const [contacts, totalItems] = await Promise.all([Contact.find(filter).sort(sortOptions).skip(skip).limit(perPage), Contact.countDocuments(filter),]);

  const totalPages = Math.ceil(totalItems / perPage);

      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: {
          data: contacts,
          page,
          perPage,
          totalItems,
          totalPages,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPages,
        },
      });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById({_id: contactId, userId: req.user._id});

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

  const newContact = await createContactService({
    name,
    phoneNumber,
    contactType,
    email,
    isFavourite,
  },
  req.user._id
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const uploadContactsPhotoController = async (req, res) => {
  const contact = await uploadContactsPhoto(req.params.contactId, req.file)

  res.send({
    status: 200,
    message: 'Successfully uploaded a photo for a contact!',
    data: contact,
  });

}

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updateData = req.body;

  const updateContact = await updateContactService(contactId, updateData, req.user._id);

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

  const deleteContact = await deleteContactService(contactId, req.user._id);

  if (!deleteContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
