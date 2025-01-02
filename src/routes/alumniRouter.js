import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getCurrentAlumni, loginAlumni, logoutAlumni, registerAlumni,updateAccountDetails,updateAvatar } from "../controllers/alumni.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register")
.post(upload.single("avatar"),(req,res,next)=>{
    try {
        registerAlumni(req,res,next);
    } catch (error) {
        next(err)
    }
})
router.route("/login").post(loginAlumni);


//secured routes

router.route("/logout").post(verifyJWT,logoutAlumni);

router.route("/update-details").post(verifyJWT,updateAccountDetails)

router.route("/current-alumni").get(verifyJWT,getCurrentAlumni)

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)


export default router;