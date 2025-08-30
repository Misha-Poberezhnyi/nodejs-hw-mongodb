import { Router } from 'express';
import { getContactById, getContactsAll, createContact, updateContact, deleteContact, uploadContactsPhotoController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsAll));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post(
    '/',
    upload.single('photo'),
    validateBody(createContactSchema),
    ctrlWrapper(createContact)
);

router.put(
    '/:contactId/photo',
    upload.single('photo'),
    ctrlWrapper(uploadContactsPhotoController)
);

router.patch(
    '/:contactId',
    upload.single('photo'),
    validateBody(updateContactSchema),
    ctrlWrapper(updateContact)
);

router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
