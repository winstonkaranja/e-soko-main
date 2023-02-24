import axios from 'axios';
import { btoa } from "../utils/btoa";
import env from "../utils/validateEnv";

export const fetchAuthorizationKey = async () => {
  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: { Authorization: 'Basic ' + btoa(`${env.MPESACONSUMERKEY}:${env.MPESACONSUMERSECRETKEY}`) }
      }
    );
    return response.data.access_token;

  } catch (error) {
    console.log(error);   
    
  }
}