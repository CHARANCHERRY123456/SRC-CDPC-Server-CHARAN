import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getCurrentAdmin, loginAdmin, logoutAdmin, registerAdmin, updateAccountDetails, updateAvatar } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addJobPost } from "../controllers/jobs.controller.js";
import { addInternshipPost } from "../controllers/internship.controller.js";


const router=Router();

router.route("/register")
.post(upload.single("avatar"),(req,res,next)=>{
    try {
        registerAdmin(req,res,next);
    } catch (error) {
        next(error)
    }
})
router.route("/login").post(loginAdmin);


//secured routes

router.route("/logout").post(verifyJWT,logoutAdmin);

router.route("/update-details").post(verifyJWT,updateAccountDetails)

router.route("/current-admin").get(verifyJWT,getCurrentAdmin)

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)

router.route("/add-job-post").post(verifyJWT,addJobPost)
router.route("/add-internship-post").post(verifyJWT,addInternshipPost)


export default router;