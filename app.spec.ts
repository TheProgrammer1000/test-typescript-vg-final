import {default as request} from 'supertest'
import { makeApp } from "./app";
import nock from 'nock';


type Contact = {
  firstname: string,
  lastname: string,
  email: string,
  personalnumber: string,
  address: string,
  zipCode: number,
  city: string,
  country: string
}


const createContact = jest.fn();
const getContactById = jest.fn();
const getAllContacts = jest.fn();


const app = makeApp({createContact, getContactById, getAllContacts});

const validContact = {
  firstname: "Tom",
  lastname: "Kalle",
  email: "dennis.karlsson@gmail.com",
  personalnumber: "950510-5432",
  address: 'toppergatan 5',
  zipCode: 11345,
  city: 'Stockholm',
  country: 'Sweden'
}

const invalid = {
  firstname: "Dennis",
  lastname: "Karlsson",
  email: "denniskarlssongmail.com",
  personalnumber: "950510-5432",
  address: 'toppergatan 5',
  zipCode: 11345,
  city: 'Stockholm',
  country: 'Sweden'
}


describe('GET /contact', () => {
  beforeEach(() => {
    nock('https://api.api-ninjas.com')
      .get('/v1/geocoding')
      .query({ city: 'Stockholm' })
      .times(6)
      .reply(200, [{ latitude: 59.3293, longitude: 18.0686 }]); // Simulating a successful response with latitude and longitude
  });

  const mockContact: Contact = {
    firstname: 'Dennis',
    lastname: "Karlsson",
    email: "dennis.karlsson@gmail.com",
    personalnumber: "950510-5432",
    address: 'vlödmanagatan 10',
    zipCode: 11345,
    city: 'Stockholm',
    country: 'Sweden'
  }


    beforeEach(async () => {
      getAllContacts.mockReset();
      getAllContacts.mockResolvedValue([mockContact])
    })


    it('should get all contacts and getting coordinates of that contact', async() => {
      const response = await request(app).get('/contact');
      console.log(response.body);
      expect(response.body[0].city).toBe("Stockholm");

    })
})

describe('GET /contact:id', () => {
  beforeEach(() => {
    getContactById.mockReset();
    getContactById.mockResolvedValue({firstname: 'Dennis',
    lastname: "Karlsson",
    email: "dennis.karlsson@gmail.com",
    personalnumber: "950510-5432",
    address: 'vlödmanagatan 10',
    zipCode: 11345,
    city: 'Stockholm',
    country: 'Sweden'});
  })

    it('should return statusCode 200 on valid contactID', async() => {
      const response = await request(app).get('/contact/638dfd606c803c13707be651');
      console.log(response.body)
      expect(response.body.firstname).toBe('Dennis');
      expect(response.statusCode).toBe(200);
    })

    it('should return statusCode 404 on invalid contactID', async () => {
      const response = await request(app).get('/contact/fejkid');
      expect(response.statusCode).toBe(404);
    })
})

describe('POST /contact', () => {

  const mockContact: Contact = {
    firstname: 'Dennis',
    lastname: "Karlsson",
    email: "dennis.karlsson@gmail.com",
    personalnumber: "980713-3450",
    address: 'vingårdsgatan 5',
    zipCode: 11345,
    city: 'Stockholm',
    country: 'Sweden'
  }

    beforeEach(async () => {
      createContact.mockResolvedValue(mockContact)
    })

    it('should have all fields with required types', async () => {
        const response = await request(app).post('/contact').send(validContact);
        expect(response.statusCode).toBe(201);
      }
    )

    it('should return statusCode 201 when valid', async () => {
        const response = await request(app).post('/contact').send(validContact);
        expect(response.statusCode).toBe(201);
    })
    it('should return statusCode 400 when invalid', async () => {
      const response = await request(app).post('/contact').send(invalid)
      expect(response.statusCode).toBe(400)
    })
})
