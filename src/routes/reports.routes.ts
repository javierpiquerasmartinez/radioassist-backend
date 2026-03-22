import { Router } from 'express';
import { generate, getHistory } from '../controllers/reports.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: AI report generation and history
 */

/**
 * @swagger
 * /api/reports/generate:
 *   post:
 *     summary: Generate a radiology report using AI
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dictation]
 *             properties:
 *               dictation:
 *                 type: string
 *                 description: The radiologist's dictation text
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *                 description: Groups multiple reports from the same patient session
 *               sessionHistory:
 *                 type: array
 *                 description: Previous conversation turns within the current session
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: AI response — either a complete report or a clarifying question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   enum: [report, question]
 *                 content:
 *                   type: string
 *                 templateDetected:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/generate', generate);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get report history for the authenticated user
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Array of saved reports ordered by date descending
 *       401:
 *         description: Unauthorized
 */
router.get('/', getHistory);

export default router;
