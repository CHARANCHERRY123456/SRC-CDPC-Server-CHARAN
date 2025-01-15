import express from 'express';
import { refreshAccessToken } from '../controllers/auth.controller.js';

const router = express.Router();

// Endpoint for refreshing the access token
router.post('/refresh-token', refreshAccessToken);

export default router;
