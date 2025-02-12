import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createApplication, deleteApplication, getAllApplications, getApplicationById, updateApplicationStatus } from '../controllers/application.controller.js';
const router = express.Router();

router.route("/create").post(verifyJWT,createApplication)
router.route("/get").get(getAllApplications);
router.route("/get/id/:id").get(getApplicationById);
router.route("/update/id/:id").put(updateApplicationStatus);
router.route("/delete/id/:id").delete(deleteApplication);
export default router;
