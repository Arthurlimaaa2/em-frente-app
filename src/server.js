// Base44 managed file: error-capture v1. Keep it as it is, and keep it as `main` in wrangler.jsonc; Base44
// replaces it with newer versions. The Worker's entry: TanStack Start's default one, which also reports a
// page's loader and beforeLoad errors to Base44. What a visitor gets back is unchanged.
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const handler = createStartHandler(defaultStreamHandler);

export default { fetch: handler };
