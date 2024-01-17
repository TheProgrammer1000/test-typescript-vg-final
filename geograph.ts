import axios from "axios";

export type Contact = {
  firstname: string,
  lastname: string,
  email: string,
  personalnumber: string,
  address: string,
  zipCode: number,
  city: string,
  country: string
}


export const getLongitudeLatiuide = async () => {

  const apiKey = 'ejAVemc7TNnbVZ7xtflf7w==oevEsgdbvxvMKUTR';
  const apiUrl = 'https://api.api-ninjas.com/v1/geocoding?city=Stockholm';

    const response = await axios.get(apiUrl, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    console.log('response.data: ', response.data);
    if(response.status === 200) {
      return {"latitude": response.data[0].latitude, "longitude": response.data[0].longitude}
    }


}
