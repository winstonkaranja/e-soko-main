import { RequestHandler } from "express";
import ProductModel from "../models/product";
import * as s3API from "../aws/s3";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import env from "../utils/validateEnv";
import { unlinkFile } from "../utils/unlinkFIle";


const productsBucket = env.AWS_BUCKET_PRODUCTS_NAME

// getting query data
export const filterProducts: RequestHandler = async (req, res, next) => {
    const query = req.params.query;

    try {
        const products = await ProductModel.find({ productName: new RegExp('^' +query, 'i') });
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
}

// fetch all products available in the db
export const getProducts: RequestHandler = async (req, res, next) => {
    try {
        const products = await ProductModel.find().exec();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

// fetching productimage from s3Bucket
export const getImage: RequestHandler = async (req, res, next) => {
    const key = req.params.key;
    try {
        const readStream = await s3API.getImage(key, productsBucket);
        readStream.pipe(res);
    } catch (error) {
        next(error);
    }    
}


// creating a new product
interface CreateProductBody {
    productName?: string,
    productImg?: File,
    categoryName?: string,
    price?: number,
    available?: string
}
export const createProduct: RequestHandler<unknown, unknown, CreateProductBody, unknown> = async (req, res, next) => {
    const productName = req.body.productName;
    const categoryName = req.body.categoryName;
    const available = req.body.available;
    const price = req.body.price;
    const productImg = req.file;

    if (!productName) {
        throw createHttpError(400, 'Product must have a title');
    }

    let productImgKey = '';

    try {
        if (productImg){
            const result = await s3API.uploadFile(productImg, productsBucket);
            // deleting an image from the upload dir once uploaded
            await unlinkFile(productImg.path);
            
            productImgKey = result.Key;
        }

        // uploading the other records to mongodb
        const newProduct = await ProductModel.create({
            productName: productName,
            productImgKey: productImgKey,
            categoryName: categoryName,
            price: price,
            available: available
        });

        res.status(200).json(newProduct);

    } catch (error) {
        // deleting the uploaded productImg from s3 if it exists
        if (productImgKey) {
            await s3API.deleteImage(productImgKey, productsBucket);
        }
        next(error);
    }
    
}


// updating a product
interface UpdateProductParam {
    productId: mongoose.Types.ObjectId;
}

interface UpdateProductBody {
    productName?: string,
    productImg?: File,
    categoryName?: string,
    available?: boolean,
    price: number
}

export const updateProduct: RequestHandler<unknown, unknown, UpdateProductBody, unknown> = async (req, res, next) => {
    const productId = (req.params as UpdateProductParam).productId;
    const productName = req.body.productName;
    const categoryName = req.body.categoryName;
    const available = req.body.available;
    const price = req.body.price;
    const productImg = req.file;

    try {
        if (!mongoose.isValidObjectId(productId)) {
            throw createHttpError(400, "Product must have a valid id");
        }
        const product = await ProductModel.findById(productId).exec();

        if (!product) {
            throw createHttpError(404, "Product not found");
        }

        if (productName) product.productName = productName;
        if (categoryName) product.categoryName = categoryName;
        if (available) product.available = available;
        if (price) product.price = price;
        
        if (productImg) {
            // deletinng the image from the s3 bucket
            if (product.productImgKey) {
                await s3API.deleteImage(product.productImgKey, productsBucket);
            }
            // uploading the new image to s3
            let imageKey = '';
            const result = await s3API.uploadFile(productImg, productsBucket);
            // deleting an image from the upload dir once uploaded
            await unlinkFile(productImg.path);
            imageKey = result.Key;
            
            product.productImgKey = imageKey;
        }

        const updatedProduct = await product.save();
        res.status(200).send({ 
            success: true, 
            message: "Product updated successfully", 
            data: updatedProduct
         });
    } catch (error) {
        next(error);
    }
};

// deleting a product from the mongodb and s3Bucket
export const deleteProduct: RequestHandler = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        if (!mongoose.isValidObjectId(productId)) {
            throw createHttpError(400, "Product must have a valid id!");
        }
        const product = await ProductModel.findById(productId).exec();

        if(!product) {
            throw createHttpError(404, "Product not found");
        }

        // deleting the image from the s3 bucket
        if (product.productImgKey) {
            await s3API.deleteImage(product.productImgKey, productsBucket);
        }

        // deleting the product details from mongodb
        await product.remove();

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}

