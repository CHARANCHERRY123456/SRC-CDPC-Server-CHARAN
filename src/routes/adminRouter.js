import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginAdmin, logoutAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


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
export default router;