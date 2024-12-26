import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginAlumni, logoutAlumni, registerAlumni } from "../controllers/alumni.controller.js";
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
export default router;