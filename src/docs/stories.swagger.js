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
 *           Leave empty or omit this parameter for the default story list.
 *           If category is provided, stories from that category are returned.
 *           Use popular to sort stories by popularity or rating.
 *           Any other value is invalid.
 *         schema:
 *           type: string
 *           enum:
 *             - popular
 *         example: popular
 *     responses:
 *       200:
 *         description: Stories list returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stories:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Story"
 *                 pagination:
 *                   $ref: "#/components/schemas/Pagination"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

/**
 * @swagger
 * /api/stories:
 *   post:
 *     summary: Create story
 *     description: >
 *       Private endpoint for creating a new story by the currently authenticated user.
 *
 *       The ownerId is taken from the authenticated user and must not be sent
 *       in the request body.
 *
 *       The image must be sent using multipart/form-data with the field name img.
 *       Supported image formats are JPEG, PNG, and WEBP.
 *       The maximum image size is 1 MB.
 *
 *       The date field is optional. If it is omitted, the backend sets
 *       the current date automatically.
 *
 *       After successful creation, the current user's articlesAmount
 *       is incremented by 1.
 *     tags:
 *       - Stories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - img
 *               - title
 *               - article
 *               - category
 *             additionalProperties: false
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: JPEG, PNG, or WEBP image. Maximum size is 1 MB.
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 40
 *                 description: Story title. Must be between 2 and 40 characters.
 *                 example: "My Green Tourism Story"
 *               article:
 *                 type: string
 *                 minLength: 12
 *                 maxLength: 3000
 *                 description: Story article text. Must be between 12 and 3000 characters.
 *                 example: "This is a story about a beautiful green tourism trip in Ukraine."
 *               category:
 *                 type: string
 *                 description: Existing category MongoDB ObjectId.
 *                 example: "6966a5cdbc1b90f344c2e0bf"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: >
 *                   Optional story date in YYYY-MM-DD format.
 *                   If omitted, the backend uses the current date.
 *                 example: "2026-07-14"
 *     responses:
 *       201:
 *         description: Story created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 201
 *               message: "Story created successfully"
 *               data:
 *                 _id: "68498236a100312bea016fe6"
 *                 img: "https://res.cloudinary.com/example/image/upload/story.webp"
 *                 title: "My Green Tourism Story"
 *                 article: "This is a story about a beautiful green tourism trip in Ukraine."
 *                 category: "6966a5cdbc1b90f344c2e0bf"
 *                 rate: 0
 *                 ownerId: "6881563901add19ee16fd011"
 *                 date: "2026-07-14"
 *                 createdAt: "2026-07-14T18:00:00.000Z"
 *                 updatedAt: "2026-07-14T18:00:00.000Z"
 *       400:
 *         description: Validation error, invalid image, or invalid category
 *         content:
 *           application/json:
 *             examples:
 *               missingImage:
 *                 summary: Image is missing
 *                 value:
 *                   message: "Image is required"
 *               unexpectedImageField:
 *                 summary: Wrong multipart file field
 *                 value:
 *                   message: "Unexpected field"
 *               invalidImageType:
 *                 summary: Unsupported image format
 *                 value:
 *                   message: "Only JPEG, PNG and WEBP images are allowed"
 *               imageTooLarge:
 *                 summary: Image is larger than 1 MB
 *                 value:
 *                   message: "File too large"
 *               missingFields:
 *                 summary: Required text fields are missing
 *                 value:
 *                   message: "Validation failed"
 *               invalidTitleMinLength:
 *                 summary: Title is too short
 *                 value:
 *                   message: "Title must be at least 2 characters"
 *               invalidTitleMaxLength:
 *                 summary: Title is too long
 *                 value:
 *                   message: "Title must be at most 40 characters"
 *               invalidArticleMinLength:
 *                 summary: Article is too short
 *                 value:
 *                   message: "Article must be at least 12 characters"
 *               invalidArticleMaxLength:
 *                 summary: Article is too long
 *                 value:
 *                   message: "Article must be at most 3000 characters"
 *               invalidCategoryFormat:
 *                 summary: Invalid category ObjectId format
 *                 value:
 *                   message: "Invalid id format"
 *               categoryDoesNotExist:
 *                 summary: Category does not exist
 *                 value:
 *                   message: "Category does not exist"
 *               invalidDate:
 *                 summary: Invalid date format
 *                 value:
 *                   message: "Date must be in YYYY-MM-DD format"
 *               unknownField:
 *                 summary: Unknown field in request body
 *                 value:
 *                   message: "\"ownerId\" is not allowed"
 *       401:
 *         description: User is not authorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Not authorized"
 *       409:
 *         description: Duplicate story
 *         content:
 *           application/json:
 *             example:
 *               message: "You have already created a story with this title and text"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
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
 *         description: >
 *           Story MongoDB ObjectId.
 *           The backend validates that it is a valid 24-character ObjectId.
 *           Use abc to test an invalid id response.
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "Internal Server Error"
 *
 *   patch:
 *     summary: Update current user's story
 *     description: >
 *       Private endpoint for updating an existing story.
 *
 *       The authenticated user may update only a story whose ownerId matches
 *       the authenticated user's id.
 *
 *       The endpoint supports partial updates. At least one of title, article,
 *       or category must be provided.
 *
 *       The fields img, ownerId, rate, date, and _id cannot be modified
 *       through this endpoint.
 *     tags:
 *       - Stories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         description: Story MongoDB ObjectId.
 *         schema:
 *           type: string
 *         example: "68498236a100312bea018fe6"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             additionalProperties: false
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 40
 *                 description: Updated story title.
 *                 example: "Updated story title"
 *               article:
 *                 type: string
 *                 minLength: 12
 *                 maxLength: 3000
 *                 description: Updated story article.
 *                 example: "Updated story article with enough characters."
 *               category:
 *                 type: string
 *                 description: Existing category MongoDB ObjectId.
 *                 example: "6966a5cdbc1b90f344c2e0bf"
 *           examples:
 *             updateTitle:
 *               summary: Update only title
 *               value:
 *                 title: "Updated story title"
 *             updateArticle:
 *               summary: Update only article
 *               value:
 *                 article: "Updated story article with enough characters."
 *             updateCategory:
 *               summary: Update only category
 *               value:
 *                 category: "6966a5cdbc1b90f344c2e0bf"
 *             updateSeveralFields:
 *               summary: Update several fields
 *               value:
 *                 title: "Updated story title"
 *                 article: "Updated story article with enough characters."
 *                 category: "6966a5cdbc1b90f344c2e0bf"
 *     responses:
 *       200:
 *         description: Story updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               message: "Story updated successfully"
 *               data:
 *                 _id: "68498236a100312bea018fe6"
 *                 img: "https://ftp.goit.study/img/green-tourism/68498236a100312bea018fe6.webp"
 *                 title: "Updated story title"
 *                 article: "Updated story article with enough characters."
 *                 category:
 *                   _id: "6966a5cdbc1b90f344c2e0bf"
 *                   category: "Еко-ферми та гастротури"
 *                 rate: 14
 *                 ownerId:
 *                   _id: "6881563901add19ee16fd011"
 *                   name: "Test User"
 *                   avatarUrl: ""
 *                 date: "2025-09-20"
 *       400:
 *         description: Invalid story id or invalid update body
 *         content:
 *           application/json:
 *             examples:
 *               invalidStoryId:
 *                 summary: Invalid story id format
 *                 value:
 *                   message: "Invalid id format"
 *               emptyBody:
 *                 summary: No update fields provided
 *                 value:
 *                   message: "No valid fields provided"
 *               invalidTitleMinLength:
 *                 summary: Title is too short
 *                 value:
 *                   message: "Title must be at least 2 characters"
 *               invalidTitleMaxLength:
 *                 summary: Title is too long
 *                 value:
 *                   message: "Title must be at most 40 characters"
 *               invalidArticleMinLength:
 *                 summary: Article is too short
 *                 value:
 *                   message: "Article must be at least 12 characters"
 *               invalidArticleMaxLength:
 *                 summary: Article is too long
 *                 value:
 *                   message: "Article must be at most 3000 characters"
 *               invalidCategoryId:
 *                 summary: Invalid category id format
 *                 value:
 *                   message: "Invalid category id"
 *               unknownField:
 *                 summary: Field cannot be modified
 *                 value:
 *                   message: "Unknown fields are not allowed"
 *       401:
 *         description: User is not authorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Not authorized"
 *       403:
 *         description: Authenticated user does not own this story
 *         content:
 *           application/json:
 *             example:
 *               message: "You can update only your own stories"
 *       404:
 *         description: Story or category not found
 *         content:
 *           application/json:
 *             examples:
 *               storyNotFound:
 *                 summary: Story does not exist
 *                 value:
 *                   message: "Story not found"
 *               categoryNotFound:
 *                 summary: Category does not exist
 *                 value:
 *                   message: "Category not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 *
 *   delete:
 *     summary: Delete current user's story
 *     description: >
 *       Private endpoint for deleting an existing story.
 *
 *       The authenticated user may delete only a story whose ownerId matches
 *       the authenticated user's id.
 *
 *       After successful deletion:
 *       the story is removed from the stories collection;
 *       the story id is removed from every user's savedArticles array;
 *       the owner's articlesAmount is reduced by 1 when it is greater than 0.
 *     tags:
 *       - Stories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         description: Story MongoDB ObjectId.
 *         schema:
 *           type: string
 *         example: "68498236a100312bea018fe6"
 *     responses:
 *       200:
 *         description: Story deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               message: "Story deleted successfully"
 *       400:
 *         description: Invalid story id format
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid id format"
 *       401:
 *         description: User is not authorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Not authorized"
 *       403:
 *         description: Authenticated user does not own this story
 *         content:
 *           application/json:
 *             example:
 *               message: "You can delete only your own stories"
 *       404:
 *         description: Story not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Story not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

/**
 * @swagger
 * /api/stories/recommended:
 *   get:
 *     summary: Get recommended stories by category
 *     description: >
 *       Returns recommended stories from a specified category.
 *       Stories are ordered by the number of users who saved them.
 *     tags:
 *       - Stories
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         description: >
 *           Required category ObjectId.
 *           The backend validates that it is a valid 24-character MongoDB ObjectId.
 *           Use abc to test an invalid id response.
 *         schema:
 *           type: string
 *         example: "6966a5cdbc1b90f344c2e0bb"
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
 *         description: Items per page. Must be between 1 and 50.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: Recommended stories returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/RecommendedStory"
 *       400:
 *         description: Invalid category id or invalid pagination
 *         content:
 *           application/json:
 *             examples:
 *               missingCategory:
 *                 summary: Category is missing
 *                 value:
 *                   message: "\"category\" is required"
 *               invalidCategory:
 *                 summary: Invalid category id format
 *                 value:
 *                   message: "Invalid id format"
 *               invalidPage:
 *                 summary: Invalid page
 *                 value:
 *                   message: "\"page\" must be greater than or equal to 1"
 *               invalidLimit:
 *                 summary: Invalid limit
 *                 value:
 *                   message: "\"limit\" must be less than or equal to 50"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Category not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

export {};