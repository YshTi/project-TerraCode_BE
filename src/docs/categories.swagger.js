/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Returns the full list of available story categories.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Categories returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6966a5cdbc1b90f344c2e0bb"
 *                   category:
 *                     type: string
 *                     example: "Еко-ферми та гастротури"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-07-05T15:18:09.263Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-07-05T15:18:09.263Z"
 *             example:
 *               - _id: "6966a5cdbc1b90f344c2e0bb"
 *                 category: "Еко-ферми та гастротури"
 *               - _id: "6966a5cdbc1b90f344c2e0bc"
 *                 category: "Національні парки"
 *       500:
 *         description: Server error
 */
export {};