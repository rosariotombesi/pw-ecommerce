import handler from "../../../../server/api/ordenes/[id]";
import { runPagesHandler } from "../../../../lib/routeHandlerAdapter";

export function GET(request, context) {
  return runPagesHandler(handler, request, context);
}

export function PATCH(request, context) {
  return runPagesHandler(handler, request, context);
}
