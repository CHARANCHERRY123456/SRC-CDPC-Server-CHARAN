import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginStudent, logoutStudent, registerStudent } from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Student registration route
router
  .route("/register")
  .post(upload.single("avatar"), (req, res, next) => {
    try {
      registerStudent(req, res, next); // Call the controller
    } catch (err) {
      next(err); // Pass errors to the global error handler
    }
    
  })
  router.route("/login").post(loginStudent)

  // secured routes

  router.route("/logout").post(verifyJWT,logoutStudent)

export default router;
