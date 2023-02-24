import express from "express";
import * as ProductsController from "../controllers/products";
import multer from "multer";


const router = express.Router();
const upload = multer({ dest: "uploads/" })

// fetching all products
router.get('/', ProductsController.getProducts);

// creating a new product
router.post('/', upload.single('productImg'), ProductsController.createProduct);

// fetching an image
router.get('/:key', ProductsController.getImage);

// updating a product
router.patch('/:productId', upload.single('productImg'), ProductsController.updateProduct);

// filtering a product
router.get('/query/:query', ProductsController.filterProducts);

// deleting a product
router.delete('/:productId', ProductsController.deleteProduct);

export default router;