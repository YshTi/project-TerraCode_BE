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
export {};