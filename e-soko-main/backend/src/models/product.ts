import {InferSchemaType, Schema, model } from "mongoose";

const productsSchema = new Schema({
    productName: { type: String, required: true },
    productImgKey: { type: String },
    categoryName: { type: String, required: true},
    price: { type: Number, required: true },
    available: { type: Boolean }
});

type Proudct = InferSchemaType<typeof productsSchema>;

export default model<Proudct>("Product", productsSchema);