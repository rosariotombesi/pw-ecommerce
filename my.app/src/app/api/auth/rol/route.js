import handler from "../../../../server/api/auth/rol";
import { runPagesHandler } from "../../../../lib/routeHandlerAdapter";

export function GET(request) {
  return runPagesHandler(handler, request);
}
