import fetch from "node-fetch";
import serverConfig from "./server-config.js";

serverConfig();

/** API version sent on every request. See https://docs.nexhealth.com/reference/versioning */
export const NEX_API_VERSION = "v3.0.0";

/** Query params that scope almost every NexHealth request. Read lazily so dotenv has loaded. */
export const nexParams = () => ({
  subdomain: process.env.SUBDOMAIN,
  location_id: process.env.LOCATION_ID,
});

/**
 * Calls the NexHealth API and returns `{ status, body }`.
 *
 * - `path`: e.g. "/appointments" or "/working_hours/123" (no query string)
 * - `query`: object; array values are appended once per item ("include[]": [...]);
 *   undefined/null/"" values are skipped
 * - `token`: bearer token from the session; pass `apiKey` instead for /authenticates
 * - `body`: JSON-serialisable request body
 *
 * The body is always an envelope `{ code, description, data, error }`, even when
 * NexHealth replies with an empty body (e.g. 204 on DELETE) or non-JSON.
 */
export async function nexFetch(
  path,
  { method = "GET", token, apiKey, query = {}, body } = {}
) {
  const url = new URL(`${process.env.API_URL}${path}`);

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    const values = Array.isArray(value) ? value : [value];
    values.forEach((v) => url.searchParams.append(key, v));
  }

  const headers = {
    "Nex-Api-Version": NEX_API_VERSION,
    Accept: "application/json",
    Authorization: apiKey || `Bearer ${token}`,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let parsed = null;

  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
  }

  if (!parsed || typeof parsed !== "object") {
    parsed = {
      code: response.ok,
      description: null,
      data: null,
      error: response.ok ? null : [text || `HTTP ${response.status}`],
    };
  }

  return { status: response.status, body: parsed };
}

/** Wraps an async route handler so a rejected promise reaches the Express error handler. */
export const asyncRoute = (fn) => (req, res, next) =>
  fn(req, res, next).catch(next);

/** Sends the upstream status and envelope through unchanged. */
export const proxy = (res, { status, body }) => res.status(status).json(body);
