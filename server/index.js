import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import { appointmentRouter } from "./routers/appointment-router.js";
import { appointmentTypesRouter } from "./routers/appointment-types-router.js";
import { authRouter } from "./routers/auth-router.js";
import { router } from "./routers/common-router.js";
import { operatoriesRouter } from "./routers/operatories-router.js";
import { providersRouter } from "./routers/providers-router.js";
import { workingHoursRouter } from "./routers/working-hours-router.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");
  next();
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes that work without a NexHealth bearer token in the session.
const PUBLIC_PATHS = new Set([
  "/api/auth",
  "/api/auth/logout",
  "/api/auth/is-authenticated",
]);

app.use(function (req, res, next) {
  if (PUBLIC_PATHS.has(req.path) || req.session.token) {
    next();
  } else {
    res.status(401).json({
      code: false,
      description: null,
      data: null,
      error: ["You are not authorized to access this resource"],
    });
  }
});

app.use("/api", router);
app.use("/api/auth", authRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/appointment-types", appointmentTypesRouter);
app.use("/api/working-hours", workingHoursRouter);
app.use("/api/providers", providersRouter);
app.use("/api/operatories", operatoriesRouter);

// Anything thrown by a route (network errors, bad upstream responses) ends up
// here instead of leaving the request hanging.
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(502).json({
    code: false,
    description: null,
    data: null,
    error: [err.message || "Request to the NexHealth API failed"],
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
