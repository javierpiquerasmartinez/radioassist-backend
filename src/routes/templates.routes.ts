import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/templates.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Report template management
 */

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: List all templates for the authenticated user
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: Array of templates
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/templates:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, content]
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', create);

/**
 * @swagger
 * /api/templates/{id}:
 *   put:
 *     summary: Update a template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, content]
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Template updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Template not found
 */
router.put('/:id', update);

/**
 * @swagger
 * /api/templates/{id}:
 *   delete:
 *     summary: Delete a template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Template deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Template not found
 */
router.delete('/:id', remove);

export default router;
