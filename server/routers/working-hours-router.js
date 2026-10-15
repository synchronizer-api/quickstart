import { Router } from "express";
import { asyncRoute, nexFetch, nexParams, proxy } from "../utils.js";

// Provider working hours (called "availabilities" in API v2).
const workingHoursRouter = Router();

workingHoursRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/working_hours", {
      token: req.session.token,
      query: {
        ...nexParams(),
        per_page: 50,
        active: true,
        ignore_past_dates: false,
        "include[]": "appointment_types",
      },
    });

    proxy(res, result);
  })
);

workingHoursRouter.get(
  "/provider/:id",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/working_hours", {
      token: req.session.token,
      query: {
        ...nexParams(),
        per_page: 50,
        active: true,
        provider_id: req.params.id,
        "include[]": "appointment_types",
      },
    });

    proxy(res, result);
  })
);

// NexHealth answers 204 with no body on success; the UI expects an envelope.
workingHoursRouter.delete(
  "/delete/:id",
  asyncRoute(async (req, res) => {
    const result = await nexFetch(`/working_hours/${req.params.id}`, {
      method: "DELETE",
      token: req.session.token,
      query: { subdomain: nexParams().subdomain },
    });

    if (result.status === 204) {
      return res.json({
        code: true,
        description: "Working hour deleted",
        data: { id: Number(req.params.id) },
        error: null,
      });
    }

    proxy(res, result);
  })
);

// Expects `{ working_hour: { provider_id, operatory_id, begin_time, end_time, days, appointment_type_ids, active } }`.
workingHoursRouter.post(
  "/create",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/working_hours", {
      method: "POST",
      token: req.session.token,
      query: nexParams(),
      body: req.body,
    });

    proxy(res, result);
  })
);

workingHoursRouter.get(
  "/:id",
  asyncRoute(async (req, res) => {
    const result = await nexFetch(`/working_hours/${req.params.id}`, {
      token: req.session.token,
      query: {
        subdomain: nexParams().subdomain,
        "include[]": "appointment_types",
      },
    });

    proxy(res, result);
  })
);

export { workingHoursRouter };
