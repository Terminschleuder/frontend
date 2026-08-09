import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** The MSW request interceptor used across tests. */
export const server = setupServer(...handlers);