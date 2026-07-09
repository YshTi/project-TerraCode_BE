/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get travellers list
 *     description: >
 *       Returns paginated public users list.
 *       Users with 0 articles are not returned.
 *
 *       Valid page and limit values must be positive integers.
 *       For QA testing, you can enter page=0 or limit=0 to check validation errors.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: >
 *           Page number. Must be an integer greater than or equal to 1.
 *           Use 0 to test the validation error.
 *         schema:
 *           type: integer
 *           default: 1
 *         examples:
 *           valid:
 *             summary: Valid page
 *             value: 1
 *           invalidZero:
 *             summary: Invalid page for testing
 *             value: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         description: >
 *           Number of users per page. Must be an integer from 1 to 100.
 *           Use 0 to test the validation error.
 *         schema:
 *           type: integer
 *           default: 12
 *         examples:
 *           valid:
 *             summary: Valid limit
 *             value: 12
 *           invalidZero:
 *             summary: Invalid limit for testing
 *             value: 0
 *           invalidTooLarge:
 *             summary: Invalid limit greater than 100
 *             value: 101
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
 *                         example: "64f1a2b3c4d5e6f789012345"
 *                       name:
 *                         type: string
 *                         example: "Софія Мельник"
 *                       avatarUrl:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
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
 *             example:
 *               status: 200
 *               data:
 *                 - _id: "64f1a2b3c4d5e6f789012345"
 *                   name: "Софія Мельник"
 *                   avatarUrl: "https://example.com/avatar.jpg"
 *                   articlesAmount: 12
 *                 - _id: "64f1a2b3c4d5e6f789012346"
 *                   name: "Анна Коваль"
 *                   avatarUrl: "https://example.com/avatar2.jpg"
 *                   articlesAmount: 7
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 13
 *                 totalPages: 2
 *       '400':
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             examples:
 *               invalidPageType:
 *                 summary: Page is not an integer
 *                 value:
 *                   message: "Page must be an integer"
 *               invalidPageMin:
 *                 summary: Page is less than 1
 *                 value:
 *                   message: "Page must be at least 1"
 *               invalidLimitType:
 *                 summary: Limit is not an integer
 *                 value:
 *                   message: "Limit must be an integer"
 *               invalidLimitMin:
 *                 summary: Limit is less than 1
 *                 value:
 *                   message: "Limit must be at least 1"
 *               invalidLimitMax:
 *                 summary: Limit is greater than 100
 *                 value:
 *                   message: "Limit must be at most 100"
 *       '404':
 *         description: Requested page does not exist
 *         content:
 *           application/json:
 *             example:
 *               message: "Page not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
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
 * /api/users/me:
 *   patch:
 *     summary: Update current user profile
 *     description: >
 *       Updates the current authenticated user's profile.
 *
 *       The user can update name and avatarUrl directly.
 *       If email is provided, the email is not changed immediately.
 *       Instead, the backend sends a verification email to the new address.
 *
 *       The avatarUrl must be a valid image URL. The backend checks the remote
 *       image with a HEAD request, requires Content-Length, and rejects images
 *       larger than 1MB.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 32
 *                 description: >
 *                   User name. Can contain only English or Ukrainian letters,
 *                   spaces, hyphens and apostrophes.
 *                 example: "Test User Updated"
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 64
 *                 description: >
 *                   New email address. If provided, the backend sends a verification
 *                   email first. The email is updated only after the verification
 *                   link is opened.
 *                 example: "new-email@example.com"
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 description: >
 *                   Avatar image URL. The URL must be accessible by the backend,
 *                   must point to an image, must provide Content-Length, and the
 *                   image size must be less than 1MB.
 *                 example: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg"
 *           examples:
 *             updateName:
 *               summary: Update name
 *               value:
 *                 name: "Test User Updated"
 *             updateAvatar:
 *               summary: Update avatar with valid small image
 *               value:
 *                 avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg"
 *             updateEmail:
 *               summary: Request email change
 *               value:
 *                 email: "new-email@example.com"
 *             invalidBigAvatar:
 *               summary: Invalid avatar larger than 1MB for testing
 *               value:
 *                 avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg"
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User updated successfully"
 *               user:
 *                 id: "6a4cc59220dfa9bd7d20befb"
 *                 name: "Test User Updated"
 *                 email: "testuser@example.com"
 *                 avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg"
 *                 articlesAmount: 0
 *                 savedArticles: []
 *                 createdAt: "2026-07-07T09:23:31.055Z"
 *                 updatedAt: "2026-07-09T11:20:41.628Z"
 *       202:
 *         description: Verification email was sent for email change
 *         content:
 *           application/json:
 *             example:
 *               requiresEmailVerification: true
 *               message: "Verification email sent. Please confirm the new email address."
 *               email: "new-email@example.com"
 *       400:
 *         description: Validation error or invalid avatar image URL
 *         content:
 *           application/json:
 *             examples:
 *               noFields:
 *                 summary: No valid fields provided
 *                 value:
 *                   message: "No valid fields provided"
 *               invalidName:
 *                 summary: Invalid name
 *                 value:
 *                   message: "Name must be at least 2 characters"
 *               invalidEmail:
 *                 summary: Invalid email
 *                 value:
 *                   message: "Email must be a valid email"
 *               invalidAvatarUrl:
 *                 summary: Avatar URL is not a valid URL
 *                 value:
 *                   message: "Avatar URL must be a valid URL"
 *               avatarNotAccessible:
 *                 summary: Avatar image URL is not accessible
 *                 value:
 *                   message: "Avatar image URL is not accessible or invalid"
 *               avatarNotImage:
 *                 summary: Avatar URL does not point to an image
 *                 value:
 *                   message: "Avatar image URL must point to an image"
 *               avatarSizeUnknown:
 *                 summary: Avatar image size cannot be verified
 *                 value:
 *                   message: "Unable to verify avatar image size"
 *               avatarTooLarge:
 *                 summary: Avatar image is larger than 1MB
 *                 value:
 *                   message: "Avatar image size must be less than 1MB"
 *       401:
 *         description: User is not authorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Not authorized"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             example:
 *               message: "User with this email already exists"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

/**
 * @swagger
 * /api/users/me/verify-email:
 *   get:
 *     summary: Verify email change
 *     description: >
 *       Verifies an email-change token and updates the user's email address.
 *       The token is sent in the verification email generated by PATCH /api/users/me.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Email verification token from the email link.
 *         schema:
 *           type: string
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Email was updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Email was updated successfully"
 *               user:
 *                 id: "6a4cc59220dfa9bd7d20befb"
 *                 name: "Test User"
 *                 email: "new-email@example.com"
 *                 avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg"
 *                 articlesAmount: 0
 *                 savedArticles: []
 *                 createdAt: "2026-07-07T09:23:31.055Z"
 *                 updatedAt: "2026-07-09T11:20:41.628Z"
 *       400:
 *         description: Missing verification token
 *         content:
 *           application/json:
 *             example:
 *               message: "Token is required"
 *       401:
 *         description: Invalid or expired verification token
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid or expired verification token"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             example:
 *               message: "User with this email already exists"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

/**
 * @swagger
 * /api/users/me/updateAvatar:
 *   patch:
 *     summary: Upload current user avatar
 *     description: >
 *       Uploads a new avatar image for the authenticated user.
 *
 *       This endpoint uses multipart/form-data, not JSON.
 *       The file field name must be avatar.
 *
 *       Allowed file types: JPEG, JPG, PNG, GIF, and WebP.
 *       Maximum file size: 1MB.
 *
 *       After successful upload, the image is saved to Cloudinary and the user's
 *       avatarUrl is updated.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: >
 *                   Avatar image file. Allowed formats: JPEG, JPG, PNG, GIF, WebP.
 *                   Maximum size: 1MB.
 *           encoding:
 *             avatar:
 *               contentType: image/jpeg, image/png, image/gif, image/webp
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Avatar updated successfully"
 *               user:
 *                 id: "6a4cc59220dfa9bd7d20befb"
 *                 name: "Test User"
 *                 email: "testuser@example.com"
 *                 avatarUrl: "https://res.cloudinary.com/demo/image/upload/v1234567890/userAvatars/avatar_6a4cc59220dfa9bd7d20befb.jpg"
 *                 articlesAmount: 0
 *                 savedArticles: []
 *                 createdAt: "2026-07-07T09:23:31.055Z"
 *                 updatedAt: "2026-07-09T12:49:41.628Z"
 *       400:
 *         description: Missing file, invalid file type, or file too large
 *         content:
 *           application/json:
 *             examples:
 *               missingAvatar:
 *                 summary: Avatar file was not provided
 *                 value:
 *                   message: "Avatar file is required"
 *               fileTooLarge:
 *                 summary: Avatar file is larger than 1MB
 *                 value:
 *                   message: "Avatar file size must be less than 1MB"
 *               invalidFileType:
 *                 summary: Unsupported file type
 *                 value:
 *                   message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
 *       401:
 *         description: User is not authorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Not authorized"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
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