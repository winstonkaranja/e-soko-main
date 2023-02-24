import AWS from "aws-sdk";
import env from "../utils/validateEnv";

const region = env.AWS_REGION;
const accessKeyId = env.AWS_ACCESS_KEY_ID;
const secretAccessKey = env.AWS_SECRET_KEY;

AWS.config.update({
    region, 
    accessKeyId,
    secretAccessKey
});

export default AWS;

