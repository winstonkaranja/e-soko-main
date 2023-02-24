import {InferSchemaType, Schema, model} from "mongoose";

// productSchema
const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, select: false },
    phoneNumber: { type: Number, required: true },
    location: { type: String, required: true },
    password: { type: String, required: true, select: false },
    profileImgKey: { type: String },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>('User', userSchema);