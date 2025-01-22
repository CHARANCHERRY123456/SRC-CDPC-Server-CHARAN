import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {addAlumniProfile, addInterviewExperience, createCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany, updateLogo} from "../controllers/company.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();

router.route("/create-company").post(verifyJWT,upload.single("logo"),createCompany)
router.route("/").get(getAllCompanies);
router.route("/id/:id").get(getCompanyById);
router.route("/update/:id").put(verifyJWT,updateCompany);
router.route("/update-logo/:id").patch(verifyJWT,upload.single("logo"),updateLogo)
router.route("/delete/:id").delete(verifyJWT,deleteCompany)
router.route("/add-alumni/:id").patch(verifyJWT,addAlumniProfile);
router.route("/add-interview-experience/:id").patch(verifyJWT,addInterviewExperience)




export default router;