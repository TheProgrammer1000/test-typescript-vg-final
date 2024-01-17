import express, {json} from 'express';
import { isValidId } from "./database";
import {Contact} from './types/contactType'
import { getLongitudeLatiuide } from "./geograph";

const app = express();

type AppProps = {
  createContact: (contact: Contact) => any
  getContactById: (id: string) => any
  getAllContacts: () => any
}

const validateEmail = (email: string): boolean => {
  const pattern: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  return pattern.test(email);
}

const validateZIPCode = (zipCode: string): boolean => {
  const pattern: RegExp = /^\d{5}(?:-\d{4})?$/;

  return pattern.test(zipCode);
}

const validatePersonalNumber = (personalNumber: string): boolean => {
  // Define the regular expression pattern for a generic personal number validation
  // Adjust the pattern based on the specific format and rules for your case
  const pattern: RegExp = /^[0-9]{6}-[0-9]{4}$/;

  // Use test() method to check if the personal number matches the pattern
  return pattern.test(personalNumber);
}

const validateText = (text: string): boolean => {
  // Define the regular expression pattern for text validation (letters and spaces)
  const pattern: RegExp = /^[a-zA-Z\s]+$/;

  // Use test() method to check if the text matches the pattern
  return pattern.test(text);
}


export const makeApp = ({createContact, getContactById, getAllContacts}: AppProps) => {
    app.use(json())

    app.get('/', (req, res) => {
      res.send("tjaba")
    })

    app.get('/contact', async (req, res) => {

      const contacts = await getAllContacts();
      const longitudeLatiude = await getLongitudeLatiuide();

      console.log(
        'contacts: ', contacts,
        'longitudeLatiude: ', longitudeLatiude
      )


      const newContact = contacts.map((contact: any) => ({
        ...contact,
        longitude: longitudeLatiude?.longitude,
        latitude: longitudeLatiude?.latitude
      }));



      res.status(200).json(newContact);

    })

    app.get('/contact/:id', async (req, res) => {
      if (!isValidId(req.params.id)) {
        res.status(404).send();
      }
      else {
        const contact = await getContactById(req.params.id);
        const longitudeLatiude = await getLongitudeLatiuide();

        const newContact = { ...contact, ...longitudeLatiude };

        console.log('newContact: ', newContact)
        res.status(200).json(newContact);
      }
    })

    app.post('/contact', async (req, res) => {

      let errors = [];

      const email: string = req.body.email
      const personalNumber = req.body.personalnumber
      const zipcode = req.body.zipCode


      const isZipCode: boolean = validateZIPCode(zipcode)
      const isPersonalNumber: boolean = validatePersonalNumber(personalNumber)
      const isEmail: boolean = validateEmail(email)

      if(!isEmail) {
        errors.push({
          "error": "email is not valid"
        })
        return res.status(400).json(errors)
      }
      if(!isPersonalNumber) {
        errors.push({
          "error": "personalNumber is not valid"
        })
        return res.status(400).json(errors)
      }
      if(!isZipCode) {
        errors.push({
          "error": "zipcode is not valid"
        })
        return res.status(400).json(errors)
      }

      const contact = await createContact(req.body);
      //console.log('contact: ', contact)
      res.status(201).json(contact)
    });

    return app;
}
