import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createEvent,deleteEvent,getAllEvents, getEventById, updateEvent, updateFeedback} from "../controllers/event.controller.js";
import { createRegistration, deleteRegistration, getAllRegistrations, updateRegistration,getRegistrationsByEventId } from "../controllers/eventRegistration.controller.js";

const router=Router();

router.route("/create-event").post(verifyJWT,upload.single("image"),createEvent);
router.route("/events").get(getAllEvents);
router.route("/id/:id")
.get(getEventById)
.delete(verifyJWT,deleteEvent)
.post(verifyJWT,upload.single("image"),updateEvent);

router.route("/registrations")
.get(getAllRegistrations)
.post(verifyJWT,createRegistration);
router.route("/registrations/feedback").post(verifyJWT,updateFeedback);
router.route("/registrations/event/:eventId").get(getRegistrationsByEventId);
router.route("/registrations/id/:id")
.delete(verifyJWT,deleteRegistration)
.put(verifyJWT,updateRegistration);

export default router;
