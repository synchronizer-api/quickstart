import { Router } from "express";
import { asyncRoute, nexFetch, nexParams, proxy } from "../utils.js";

const operatoriesRouter = Router();

operatoriesRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/operatories", {
      token: req.session.token,
      query: { ...nexParams(), per_page: 50 },
    });

    proxy(res, result);
  })
);

operatoriesRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const result = await nexFetch(`/operatories/${req.params.id}`, {
      token: req.session.token,
      query: { subdomain: nexParams().subdomain },
    });

    proxy(res, result);
  })
);

export { operatoriesRouter };
