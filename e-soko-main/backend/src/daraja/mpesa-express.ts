import axios from "axios";
import env from "../utils/validateEnv";
import { btoa } from "../utils/btoa";
import { fetchAuthorizationKey } from "./authKey";
import { formatDate } from "../utils/formatDate";

export const mpesaExpress = async (price: number, phoneNumber: number) => {
    try {
        const authKey = await fetchAuthorizationKey();
        const timeStamp = formatDate(new Date);
        
        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', 
        {
            "BusinessShortCode": env.MPESABUSINESSSHORTCODE,
            "Password": btoa(`${env.MPESABUSINESSSHORTCODE}${env.MPESAPASSKEY}${timeStamp}`),
            "Timestamp": timeStamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": price,
            "PartyA": phoneNumber,
            "PartyB": env.MPESABUSINESSSHORTCODE,
            "PhoneNumber": phoneNumber,
            "CallBackURL": "https://mydomain.com/path",
            "AccountReference":  env.MPESABUSINESSSHORTCODE,
            "TransactionDesc": "Payment of X"
        },
        {
            headers: { 
                'Authorization': 'Bearer ' + authKey,
                'content-type': 'application/json'
             },
        });

        return response.data;
    } catch (error) {
        console.log(error);
        
    }
}