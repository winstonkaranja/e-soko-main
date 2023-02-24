import {InferSchemaType, Schema, model} from "mongoose";

const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    packageId: { type: Schema.Types.ObjectId, required: true, },
    price: { type: Number, required: true },
    paymentStatus: { type: String, default: false },
    delivered: { type: Boolean, default: false }
});

type Order = InferSchemaType<typeof OrderSchema>;

export default model<Order>('Order', OrderSchema);