import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { errors } from "celebrate";
import cookieParser from "cookie-parser";
import { connectMongoDB } from "./db/connectToMongoDB.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import storiesRouter from "./routes/storiesRouter.js";


const PORT = process.env.PORT ?? 3000;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "5mb" }));
app.use(cors({ methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"] }));
app.use(helmet());
app.use(cookieParser());


app.use("/api-docs-assets", express.static(path.join(__dirname, "docs")));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: "/api-docs-assets/swagger-custom.css",
    customJs: "/api-docs-assets/swagger-token.js",
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});


app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/stories", storiesRouter);



app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});