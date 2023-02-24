import { RequestHandler } from "express";
import OrderModel from "../models/order";
import mongoose from "mongoose";
import { assertIsDefined }  from "../utils/asserIsDefined";
import PackageModel from "../models/package";
import createHttpError from "http-errors";
import { mpesaExpress } from "../daraja/mpesa-express";

// getting all orders for a specific user
export const getOrders: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const orders = await OrderModel.find({ userId: authenticatedUserId});

        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}


// creating a new order
interface OrderCreateParams {
    packageId: mongoose.Types.ObjectId;
}

interface OrderBody {
    userId: string,
    price: number,
    paymentType: string
}

export const createOrder: RequestHandler<OrderCreateParams, unknown, OrderBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const authenticatedUserPhoneNumber = req.session.phoneNumber;
    const packageId = req.params.packageId;
    const price = req.body.price;
    const paymentType = req.body.paymentType

    try {
        assertIsDefined(authenticatedUserId);
        
        if (!packageId) {
            throw createHttpError(400, "No package checked out!");
        }

        const packageFromDb = await PackageModel.findById(packageId);

        if (!packageFromDb) {
            createHttpError(404, "Invalid PackageId, package not found!");
        }

        // checking if a certain package is already checkedOut
        const packageIdChecker = await OrderModel.find({ packageId: packageId }).count();

        if (packageIdChecker) {
            throw createHttpError(404, "Package already checked out");
        }

        let newOrder;
        const newOrderParams = {
            userId: authenticatedUserId,
            packageId: packageId,
            price: price,
            paymentStatus: 'notPaid',
            delivered: false
            };
        
        if (paymentType && price && authenticatedUserPhoneNumber) {
            switch (paymentType) {
                // will add other payment methods here
                case 'mpesa':
                    // eslint-disable-next-line no-case-declarations
                    const response = await mpesaExpress(price, authenticatedUserPhoneNumber);
                    // eslint-disable-next-line no-case-declarations
                    const resultCode = response.ResponseCode;
                    
                    if (resultCode) {
                        newOrderParams.paymentStatus = 'pending';
                        newOrder = await OrderModel.create(newOrderParams);
        
                        res.status(201).json(newOrder);
                    }
                    
                    break;
            
            }
        } else {
            newOrder = await OrderModel.create(newOrderParams);
            res.status(201).json(newOrder);

        }

        

    } catch (error) {
        next(error);
    }
}

// canceling an order
export const cancelOrder: RequestHandler = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        if (!mongoose.isValidObjectId(orderId)) {
            throw createHttpError(400, "Order must be a valid id!")
        }

        const order = await OrderModel.findById(orderId).exec();
        if (!order) {
            throw createHttpError(404, "Order not found");
        }
        await order.remove();

    } catch (err) {
        next(err);
    }
}


