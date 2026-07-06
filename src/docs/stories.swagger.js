/**
 * @swagger
 * /api/stories:
 *   get:
 *     summary: Get stories list
 *     description: >
 *       Public endpoint for getting a paginated list of stories.
 *       Supports optional filtering by category and optional sorting by popularity.
 *     tags:
 *       - Stories
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number. Must be an integer greater than or equal to 1.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of stories per page. Must be between 1 and 100.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: category
 *         required: false
 *         description: Optional existing category ObjectId to filter stories by category.
 *         schema:
 *           type: string
 *         example: "6966a5cdbc1b90f344c2e0bf"
 *       - in: query
 *         name: type
 *         required: false
 *         description: >
 *           Leave empty/not selected for the default story list.
 *           If category is provided, this returns all stories from that category.
 *           Use popular to sort stories by popularity/rating.
 *           Any other value is invalid and returns a validation error.
 *         schema:
 *           type: string
 *         example: popular
 *     responses:
 *       200:
 *         description: Stories list returned successfully
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             examples:
 *               invalidPage:
 *                 summary: Invalid page
 *                 value:
 *                   message: "\"page\" must be greater than or equal to 1"
 *               invalidLimit:
 *                 summary: Invalid limit
 *                 value:
 *                   message: "\"limit\" must be less than or equal to 100"
 *               invalidCategoryFormat:
 *                 summary: Invalid category ObjectId format
 *                 value:
 *                   message: "Invalid id format"
 *               invalidType:
 *                 summary: Invalid type
 *                 value:
 *                   message: "\"type\" must be [popular]"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Category not found"
 */

/**
 * @swagger
 * /api/stories/{storyId}:
 *   get:
 *     summary: Get story by id
 *     description: Returns detailed information about one story.
 *     tags:
 *       - Stories
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
 *         description: Story returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Story"
 *             example:
 *               _id: "68498236a100312bea018fe6"
 *               img: "https://ftp.goit.study/img/green-tourism/68498236a100312bea018fe6.webp"
 *               title: "Test story title"
 *               article: "Test story article text."
 *               category: "6966a5cdbc1b90f344c2e0bb"
 *               rate: 14
 *               ownerId: "6881563901add19ee16fd011"
 *               date: "2025-09-20"
 *       400:
 *         description: Invalid story id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "Invalid id format"
 *       404:
 *         description: Story not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "Story not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @swagger
 * /api/stories/recommended:
 *   get:
 *     summary: Get recommended stories by category
 *     tags:
 *       - Stories
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         description: Required category ObjectId. Backend validates that it must be a valid 24-character MongoDB ObjectId. Use abc to test invalid id response.
 *         schema:
 *           type: string
 *         example: "6966a5cdbc1b90f344c2e0bb"
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number. Must be integer >= 1.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Items per page. Must be 1–50.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: Recommended stories returned successfully
 *       400:
 *         description: Invalid category id format or validation error
 */
export {};