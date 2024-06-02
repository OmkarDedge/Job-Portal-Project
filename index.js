import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import "express-async-errors";
import ExpressMongoSanitize from "express-mongo-sanitize";

import connectDB from "./config/db.js";
import router from "./routes/testRoutes.js";
import userRouter from "./routes/userRoutes.js";
import errorMiddleware from "./middlewares/error.js";
import actionRouter from "./routes/userActionRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
//config env

dotenv.config();

// DB connection
connectDB();

// Swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job portal Application",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      //{ url: "http://localhost:8000" }
      {url : "https://job-portal-project-7030.onrender.com/"}
      ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);

const app = express();
//Port
const PORT = process.env.PORT || 8000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(ExpressMongoSanitize());

app.use("/api/v1/test", router);
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/user", actionRouter);
app.use("/api/v1/job", jobRouter);

// home route
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server started on Port:${PORT} in ${process.env.DEV_MODE} mode`);
});
