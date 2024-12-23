import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginStudent, registerStudent } from "../controllers/student.controller.js";

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

export default router;
