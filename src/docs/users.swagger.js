/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get travellers list
 *     description: Returns paginated public users list. Users with 0 articles are not returned.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       '200':
 *         description: Travellers list returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f1a2b3c4d5e6f789012345
 *                       name:
 *                         type: string
 *                         example: Софія Мельник
 *                       avatarUrl:
 *                         type: string
 *                         example: https://example.com/avatar.jpg
 *                       articlesAmount:
 *                         type: integer
 *                         example: 12
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 13
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *       '400':
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: Page must be at least 1
 *       '404':
 *         description: Page not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: Page not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get public user profile
 *     description: Returns public information about a user and stories published by this user with pagination.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User MongoDB ObjectId. Backend expects a valid 24-character ObjectId. Use abc to test invalid id behavior.
 *         schema:
 *           type: string
 *         example: "6881563901add19ee16fd011"
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number. Must be an integer greater than or equal to 1. Default is 1.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: perPage
 *         required: false
 *         description: Number of stories per page. Default is 4.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 4
 *         example: 4
 *     responses:
 *       200:
 *         description: Public user profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: "#/components/schemas/User"
 *                     stories:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/Story"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         perPage:
 *                           type: integer
 *                           example: 4
 *                         totalStories:
 *                           type: integer
 *                           example: 2
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *             example:
 *               data:
 *                 user:
 *                   _id: "6881563901add19ee16fd011"
 *                   name: "Test User"
 *                   avatarUrl: ""
 *                   articlesAmount: 2
 *                   savedArticles: []
 *                   email: "testuser@example.com"
 *                 stories:
 *                   - _id: "68498236a100312bea018fe6"
 *                     img: "https://ftp.goit.study/img/green-tourism/68498236a100312bea018fe6.webp"
 *                     title: "Test story title"
 *                     article: "Test story article text."
 *                     category: "6966a5cdbc1b90f344c2e0bb"
 *                     rate: 14
 *                     ownerId: "6881563901add19ee16fd011"
 *                     date: "2025-09-20"
 *                 pagination:
 *                   page: 1
 *                   perPage: 4
 *                   totalStories: 1
 *                   totalPages: 1
 *       400:
 *         description: Invalid user id format or invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "Invalid id format"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "Користувача не знайдено"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user
 *     description: Returns information about the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *             example:
 *               _id: "6881563901add19ee16fd013"
 *               name: "Test User"
 *               avatarUrl: ""
 *               articlesAmount: 0
 *               savedArticles:
 *                 - "68498236a100312bea018fe6"
 *               email: "testuser@example.com"
 *               createdAt: "2026-07-05T15:18:09.263Z"
 *               updatedAt: "2026-07-05T15:18:09.263Z"
 *       401:
 *         description: Not authorized. Bearer token is missing, invalid, or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "Not authorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @swagger
 * /api/users/me/stories:
 *   get:
 *     summary: Get current user's stories
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number. Must be an integer >= 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page. Must be 1–100.
 *     responses:
 *       200:
 *         description: Current user's stories with pagination
 *       401:
 *         description: Not authorized
 */

/**
 * @swagger
 * /api/users/me/saved/{storyId}:
 *   patch:
 *     summary: Add story to saved stories
 *     description: Adds a story to the authenticated user's saved stories.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         description: Story MongoDB ObjectId. Backend validates that it must be a valid 24-character ObjectId. Use abc to test invalid id response.
 *         schema:
 *           type: string
 *         example: "68498236a100312bea018fe6"
 *     responses:
 *       200:
 *         description: Story added to saved successfully
 *       400:
 *         description: Invalid story id format
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid story id format"
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Story not found
 */

/**
 * @swagger
 * /api/users/me/saved/{storyId}:
 *   delete:
 *     summary: Remove story from current user's saved stories
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         description: Story MongoDB ObjectId. Backend validates that it must be a valid 24-character ObjectId. Use abc to test invalid id response.
 *         schema:
 *           type: string
 *         example: "68498236a100312bea018fe6"
 *     responses:
 *       200:
 *         description: Story removed from saved successfully
 *       400:
 *         description: Invalid story id format
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Story not found or story is not saved
 */

/**
 * @swagger
 * /api/users/me/saved:
 *   get:
 *     summary: Get current user's saved stories
 *     description: Returns stories saved by the authenticated user with pagination.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number. Backend validates that it must be an integer greater than or equal to 1. Default is 1.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of saved stories per page. Backend validates that it must be an integer greater than or equal to 1. Default is 10.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: Saved stories returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 stories:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Story"
 *             example:
 *               page: 1
 *               limit: 10
 *               total: 2
 *               totalPages: 1
 *               stories:
 *                 - _id: "68498236a100312bea018fe6"
 *                   img: "https://ftp.goit.study/img/green-tourism/68498236a100312bea018fe6.webp"
 *                   title: "Test story title"
 *                   article: "Test story article text."
 *                   category: "6966a5cdbc1b90f344c2e0bb"
 *                   rate: 14
 *                   ownerId: "6881563901add19ee16fd011"
 *                   date: "2025-09-20"
 *                 - _id: "68498236a100312bea045fe6"
 *                   img: "https://ftp.goit.study/img/green-tourism/68498236a100312bea045fe6.webp"
 *                   title: "Another test story title"
 *                   article: "Another test story article text."
 *                   category: "6966a5cdbc1b90f344c2e0be"
 *                   rate: 10
 *                   ownerId: "6881563901add19ee16fd013"
 *                   date: "2025-09-21"
 *       400:
 *         description: Validation error for query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationErrorResponse"
 *             example:
 *               message: "Validation failed"
 *               errors:
 *                 page:
 *                   - "Page must be greater than or equal to 1"
 *       401:
 *         description: Not authorized. Bearer token is missing, invalid, or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "Not authorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
export {};