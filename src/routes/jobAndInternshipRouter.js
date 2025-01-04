import { Router } from "express";
import { getJobPosts } from "../controllers/jobs.controller.js";
import { getInternshipPosts } from "../controllers/internship.controller.js";


const router=Router();

router.route("/get-job-posts").get(getJobPosts);

router.route("/get-internship-posts").get(getInternshipPosts)
export default router;