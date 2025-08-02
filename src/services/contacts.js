import { Contact } from "../db/models/contact.js"

export const contactsAll = (app) => {
    app.get('/contacts', async (req, res) => {
        try {
            const contacts = await Contact.find();

            res.status(200).json({
                status: 200,
                message: 'Successfully found contacts!',
                data: contacts,
            })
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Server error',
                error: error.message,
            })
        }
    })

    app.get('/contacts/:contactId', async (req, res) => {
        const { contactId } = req.params;

        try {
            const contact = await Contact.findById(contactId);

            if (!contact) {
                return res.status(404).json({
                    message: 'Contact not found!'
                })
            }


        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        })
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Server error',
                error: error.message,
            })
        }
    })
}

