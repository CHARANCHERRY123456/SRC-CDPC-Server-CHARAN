import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createApplicant, getAllApplicants, getApplicantById, updateApplicant,deleteApplicant, getApplicantByEmail } from '../controllers/applicant.controller.js';
const router = express.Router();

router.route("/create").post(verifyJWT,createApplicant)
router.route("/get").get(getAllApplicants);
router.route("/get/id/:id").get(getApplicantById);
router.route("/get/:email").get(getApplicantByEmail)
router.route("/edit/id/:id").put(updateApplicant);
router.route("/delete/id/:id").delete(deleteApplicant);
export default router;
