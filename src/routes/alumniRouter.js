import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginAlumni, registerAlumni } from "../controllers/alumni.controller.js";

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

export default router;