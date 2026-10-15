import { Router } from "express";
import { asyncRoute, nexFetch, nexParams, proxy } from "../utils.js";

const appointmentTypesRouter = Router();

appointmentTypesRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/appointment_types", {
      token: req.session.token,
      query: nexParams(),
    });

    proxy(res, result);
  })
);

appointmentTypesRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const result = await nexFetch(`/appointment_types/${req.params.id}`, {
      token: req.session.token,
      query: nexParams(),
    });

    proxy(res, result);
  })
);

// Expects `{ appointment_type: { name, minutes, parent_type, bookable_online } }`.
appointmentTypesRouter.post(
  "/",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/appointment_types", {
      method: "POST",
      token: req.session.token,
      query: nexParams(),
      body: req.body,
    });

    proxy(res, result);
  })
);

appointmentTypesRouter.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    const result = await nexFetch(`/appointment_types/${req.params.id}`, {
      method: "DELETE",
      token: req.session.token,
      query: nexParams(),
    });

    proxy(res, result);
  })
);

export { appointmentTypesRouter };
