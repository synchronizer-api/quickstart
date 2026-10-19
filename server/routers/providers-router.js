import { Router } from "express";
import { asyncRoute, nexFetch, nexParams, proxy } from "../utils.js";

const providersRouter = Router();

providersRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/providers", {
      token: req.session.token,
      query: { ...nexParams(), per_page: 50 },
    });

    proxy(res, result);
  })
);

providersRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const result = await nexFetch(`/providers/${req.params.id}`, {
      token: req.session.token,
      query: { subdomain: nexParams().subdomain },
    });

    proxy(res, result);
  })
);

export { providersRouter };
