import {InferSchemaType, Schema, model} from "mongoose";


const packageSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    packageName: { type: String, required: true },
    items: { type: Array },
});

type Package = InferSchemaType<typeof packageSchema>;

export default model<Package>('Package', packageSchema);
