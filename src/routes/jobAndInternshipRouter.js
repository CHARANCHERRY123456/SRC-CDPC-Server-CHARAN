import { Router } from "express";
import { deactivateJob, deleteJobPost, getJobById, getJobPosts, getJobsByCompany, reactivateJob, updateJobPost } from "../controllers/jobs.controller.js";
import { getInternshipPosts } from "../controllers/internship.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addJobPost } from "../controllers/jobs.controller.js";
const router=Router();
router.route("/add").post(verifyJWT,addJobPost)
// router.route("/add-internship-post").post(verifyJWT,addInternshipPost)
router.route("/get-job-posts").get(getJobPosts);
router.route("/id/:id")
.put(verifyJWT,updateJobPost)
.get(getJobById)
.delete(verifyJWT,deleteJobPost)
router.route("/activate/id/:id").patch(reactivateJob);
router.route("/de-activate/id/:id").patch(deactivateJob);
router.route("/company/id/:id").get(getJobsByCompany)
router.route("/get-internship-posts").get(getInternshipPosts)
export default router;