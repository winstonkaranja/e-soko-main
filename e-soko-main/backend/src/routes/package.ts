import express from "express";
import * as PackageController from "../controllers/package";

const router = express.Router();

// fetching all packages
router.get('/', PackageController.getPackages);

// creating a new package
router.post('/', PackageController.createPackage);

// updating a package
router.patch('/:packageId', PackageController.updatePackage);

export default router;