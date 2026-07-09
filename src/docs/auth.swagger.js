/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterRequest"
 *           example:
 *             name: "Test User"
 *             email: "testuser@example.com"
 *             password: "password123!"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   $ref: "#/components/schemas/AuthUser"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationErrorResponse"
 *       409:
 *         description: User with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "User with this email already exists"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: |
 *       Login with email and password.
 *
 *       On successful login, the backend returns an accessToken in the response body
 *       and sets a refreshToken as an HTTP-only cookie.
 *
 *       QA flow:
 *       1. Execute this endpoint.
 *       2. Copy the accessToken from the response body.
 *       3. Confirm that the response contains a Set-Cookie header with refreshToken.
 *       4. Use the accessToken in Swagger Authorize or as Bearer token in Postman.
 *       5. Use POST /api/auth/refresh to get a new accessToken from the refreshToken cookie.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *           example:
 *             email: "testuser@example.com"
 *             password: "password123!"
 *     responses:
 *       200:
 *         description: Login successful. Returns accessToken and sets refreshToken cookie.
 *         headers:
 *           Set-Cookie:
 *             description: >
 *               HTTP-only refreshToken cookie. It is used by POST /api/auth/refresh
 *               to issue a new access token.
 *             schema:
 *               type: string
 *               example: "refreshToken=jwt-refresh-token; HttpOnly; SameSite=Strict; Max-Age=604800"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token used as Bearer token for protected endpoints.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationErrorResponse"
 *       401:
 *         description: Email or password is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "Email or password is invalid"
 *       500:
 *         description: Server error, for example missing JWT secrets in environment variables
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: >
 *       Creates a new access token using the refreshToken stored in an HTTP-only cookie.
 *       The request body is not required. The refreshToken cookie is set during login
 *       and should be sent automatically by the browser or Postman.
 *
 *       QA flow:
 *       1. Login with POST /api/auth/login.
 *       2. Confirm that the response sets a refreshToken cookie.
 *       3. Execute POST /api/auth/refresh without a request body.
 *       4. Use the returned accessToken to authorize private endpoints.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         description: >
 *           Refresh token stored as an HTTP-only cookie after successful login.
 *           In Swagger UI or Postman, this cookie is usually sent automatically
 *           after login if cookies are enabled.
 *         schema:
 *           type: string
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token. Use it as Bearer token for protected endpoints.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Refresh token is missing, invalid, or expired
 *         content:
 *           application/json:
 *             examples:
 *               refreshTokenMissing:
 *                 summary: Refresh token cookie is missing
 *                 value:
 *                   message: "Refresh token missing"
 *               invalidRefreshToken:
 *                 summary: Refresh token is invalid
 *                 value:
 *                   message: "Invalid refresh token"
 *               refreshTokenExpired:
 *                 summary: Refresh token is expired
 *                 value:
 *                   message: "Refresh token expired"
 *               notAuthorized:
 *                 summary: User is not authorized
 *                 value:
 *                   message: "Not authorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Check current session
 *     description: >
 *       Checks whether the current JWT session is active.
 *       Requires a valid Bearer access token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session is active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session is active"
 *                 user:
 *                   $ref: "#/components/schemas/AuthUser"
 *                 accessToken:
 *                   type: string
 *                   description: Fresh access token returned by the session check.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             example:
 *               message: "Session is active"
 *               user:
 *                 id: "6881563901add19ee16fd011"
 *                 name: "Test User"
 *                 email: "testuser@example.com"
 *                 avatarUrl: ""
 *                 articlesAmount: 0
 *                 savedArticles: []
 *                 createdAt: "2026-07-05T15:18:09.263Z"
 *                 updatedAt: "2026-07-05T15:18:09.263Z"
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             example:
 *               message: "Not authorized"
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: >
 *       Logs out the current user. Requires a valid Bearer access token.
 *       The backend clears the refreshToken cookie and invalidates the stored
 *       access token and refresh token in the database.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful. No content is returned.
 *         headers:
 *           Set-Cookie:
 *             description: Clears the refreshToken cookie.
 *             schema:
 *               type: string
 *               example: "refreshToken=; Max-Age=0"
 *       401:
 *         description: Not authorized
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
 *             example:
 *               message: "Internal Server Error"
 */

export {};