import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { updateUser } from "../controllers/userActionController.js";

const actionRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - email
 *         - password
 *         - lastName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password (should be greater than 6 characters)
 *         location:
 *           type: string
 *           description: The user's location (city or country)
 *       example:
 *         id: GDHJGD788BJBJ
 *         firstName: John
 *         lastName: Doe
 *         email: johndoe@gmail.com
 *         password: test@123
 *         location: Mumbai
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/v1/user/update-user:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user information was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal server error
 */
actionRouter.put("/update-user", userAuth, updateUser);

export default actionRouter;
