import sharp from "sharp";
import AWS from "./aws";

const s3 = new AWS.S3();


// upload a file to s3
export async function uploadFile(file: Express.Multer.File, bucketName: string) {
    // resizing the image before uploading to s3
    const productImg = await sharp(file.path)
        .resize({width: 400, height: 400, fit: 'inside'})
        .toBuffer();

    const uploadParams = {
        Bucket: bucketName,
        Body: productImg,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise();
}

// downloading an image from s3
export async function getImage(filekey: string, bucketName: string){
    const params = {
        Key: filekey,
        Bucket: bucketName
    }

    return s3.getObject(params).createReadStream();
}

// deleting an image from s3
export async function deleteImage(filekey: string, bucketName: string) {
    const params = {
        Key: filekey,
        Bucket: bucketName
    }
    return s3.deleteObject(params).promise()
}