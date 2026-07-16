# 🌿 Nature Trips API — TerraCode Backend

Back-end service for the **Природні Мандри** web platform.

The API provides authentication, user profiles, story management, saved stories, image uploads, email verification, categories, pagination, filtering, and integration with the front-end application.

---

## 🔗 Links

- **Live front end:** https://project-terra-code-fe.vercel.app
- **Front-end repository:** https://github.com/YshTi/project-TerraCode_FE
- **Back-end repository:** https://github.com/YshTi/project-TerraCode_BE
- **Swagger documentation:** https://project-terracode-be.onrender.com/api-docs
- **Deployed API:** https://project-terracode-be.onrender.com

---

## 📖 About the project

The Nature Trips API supports a platform where users can discover and share travel stories about Ukraine, ecological tourism, natural landmarks, and local culture.

The back end is responsible for:

- user registration and login;
- authentication and session management;
- access and refresh token generation;
- user profile management;
- avatar uploads;
- email address verification;
- password changes;
- story creation, editing, deletion, and retrieval;
- story filtering and pagination;
- saved stories;
- category management;
- image storage;
- email delivery;
- API documentation and validation.

---

## ✨ Main functionality

### Authentication

- User registration
- User login
- User logout
- Session validation
- Access-token generation
- Refresh-token generation
- Access-token renewal
- HTTP-only cookie support
- Protected routes
- Password hashing
- Authentication middleware

### Users

- Get current user
- Update current user
- Update avatar
- Update password
- Request email change
- Verify new email address
- Get public traveller list
- Get traveller profile
- Get current user stories
- Get saved stories

### Stories

- Get all stories
- Get story by ID
- Create a story
- Edit a story
- Delete a story
- Filter by category
- Filter by popularity
- Pagination
- Recommended stories
- Save a story
- Remove a story from saved stories

### Categories

- Get all categories
- Use categories for story filtering
- Validate category identifiers

---

## 🛠 Technologies

### Back-end

- Node.js
- Express.js
- JavaScript
- REST API
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Cloudinary
- Swagger
- Joi
- Celebrate
- Brevo
- CORS
- Cookie-based authentication
- HTTP errors
- Environment variables

### Development tools

- Git
- GitHub
- VS Code
- Postman
- Swagger UI
- MongoDB Compass
- Render
- ESLint
- Nodemon
- npm

---

## 🏗 Architecture

The application follows a layered structure:

```text
src/
├── controllers/          # Request and response handling
├── services/             # Business logic
├── models/               # Mongoose schemas and models
├── routes/               # Express routes
├── middlewares/          # Authentication, validation, uploads
├── validations/          # Joi and Celebrate schemas
├── utils/                # Shared helper functions
├── docs/                 # Swagger documentation
├── constants/            # Constants and configuration values
├── app.js                # Express application configuration
└── server.js             # Server entry point
```

# Collaborators:
- Fullstack
  - [Anna Smyrnova](https://github.com/Anna-Smyrnova)
  - [grytsaidmitry](https://github.com/grytsaidmitry)
  - [Tymofii-Danilov](https://github.com/Tymofii-Danilov)
  - [Valentyna Modyrka](https://github.com/MoVa-ops)
  - [vitalii-sementsov](https://github.com/vitalii-sementsov)
  - [Yurii Davydiuk](https://github.com/YuriiDavydiuk)
  - [Erik](https://github.com/AvalianY)
  - [Lara Kosta](https://github.com/Larimar4you)
  - [Maksym Orlenko](https://github.com/MaksOrlenko)
  - [ROMAN LUBENNIKOV](https://github.com/RomanLubennikov)
- QA:
  - [doroninroma93](https://github.com/doroninroma93)
  - [Yaroslava Rozhkova](https://github.com/slava-rozh)
  - [Anastasiia Tkachyck](https://github.com/weaver-ast)
