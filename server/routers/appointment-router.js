import { Router } from "express";
import { asyncRoute, nexFetch, nexParams, proxy } from "../utils.js";

const appointmentRouter = Router();

/**
 * v3 appointment rows are flat (patient_id, provider_name, ...) and no longer
 * embed the patient. The UI shows the patient's name, so look each unique
 * patient up once and attach `patient: { id, name }` to every row.
 */
async function attachPatients(appointments, token) {
  const ids = [...new Set(appointments.map((appt) => appt.patient_id))].filter(
    Boolean
  );

  const lookups = await Promise.all(
    ids.map((id) =>
      nexFetch(`/patients/${id}`, {
        token,
        query: { subdomain: nexParams().subdomain },
      })
        .then(({ body }) => [id, body.code && body.data ? body.data.name : null])
        .catch(() => [id, null])
    )
  );

  const names = Object.fromEntries(lookups);

  return appointments.map((appt) => ({
    ...appt,
    patient: {
      id: appt.patient_id,
      name: names[appt.patient_id] || `Patient #${appt.patient_id}`,
    },
  }));
}

appointmentRouter.get(
  "/",
  asyncRoute(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        code: false,
        description: null,
        data: null,
        error: ["startDate and endDate are required"],
      });
    }

    const result = await nexFetch("/appointments", {
      token: req.session.token,
      query: {
        ...nexParams(),
        start: startDate,
        end: endDate,
        cancelled: false,
        per_page: 50,
      },
    });

    if (result.body.code && Array.isArray(result.body.data)) {
      result.body.data = await attachPatients(
        result.body.data,
        req.session.token
      );
    }

    proxy(res, result);
  })
);

appointmentRouter.get(
  "/slots",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/available_slots", {
      token: req.session.token,
      query: {
        subdomain: nexParams().subdomain,
        start_date: req.query.startDate,
        days: 1,
        slot_length: 30,
        "lids[]": req.query.locationId,
        "pids[]": req.query.providerId,
        "operatory_ids[]": req.query.operatoryId,
      },
    });

    proxy(res, result);
  })
);

appointmentRouter.post(
  "/book-appointment",
  asyncRoute(async (req, res) => {
    const result = await nexFetch("/appointments", {
      method: "POST",
      token: req.session.token,
      query: nexParams(),
      body: req.body,
    });

    proxy(res, result);
  })
);

appointmentRouter.patch(
  "/cancel-appointment/:id",
  asyncRoute(async (req, res) => {
    const result = await nexFetch(`/appointments/${req.params.id}`, {
      method: "PATCH",
      token: req.session.token,
      query: { subdomain: nexParams().subdomain },
      body: req.body,
    });

    proxy(res, result);
  })
);

export { appointmentRouter };
