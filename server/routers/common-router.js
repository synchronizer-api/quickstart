import { Router } from "express";
import { asyncRoute, nexFetch, nexParams, proxy } from "../utils.js";

const router = Router();

router.get(
  "/patients",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/patients", {
      token: req.session.token,
      query: { ...nexParams(), per_page: 100 },
    });

    proxy(res, result);
  })
);

router.get(
  "/locations",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/locations", {
      token: req.session.token,
    });

    proxy(res, result);
  })
);

export { router };
