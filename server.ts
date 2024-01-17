import mongoose from 'mongoose';
import { makeApp } from './app';
import { createContact, getContactById, getAllContacts } from './database';

const port = 8081;
const app = makeApp({createContact, getContactById, getAllContacts});

export const server = {};

mongoose.connect('mongodb://localhost:27017').then(() => {
  app.listen(port, () => {
    console.log(`App listening to port ${port}`)
  })
})
