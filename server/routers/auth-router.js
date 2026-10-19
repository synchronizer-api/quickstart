import { Router } from "express";
import { asyncRoute, nexFetch } from "../utils.js";

const authRouter = Router();

// Exchanges the API key for a bearer token and keeps it in the session.
authRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const { body } = await nexFetch("/authenticates", {
      method: "POST",
      apiKey: process.env.API_KEY,
    });

    if (body.code) {
      req.session.token = body.data.token;
    }

    res.send({
      authenticated: Boolean(body.code),
      error: body.code ? null : body.error,
    });
  })
);

authRouter.get("/logout", (req, res) => {
  req.session.destroy();

  res.send({
    authenticated: false,
  });
});

authRouter.get("/is-authenticated", (req, res) => {
  res.send({
    authenticated: Boolean(req.session.token),
  });
});

export { authRouter };
