import handler from "../../../server/api/carrito";
import { runPagesHandler } from "../../../lib/routeHandlerAdapter";

export function GET(request) {
  return runPagesHandler(handler, request);
}

export function POST(request) {
  return runPagesHandler(handler, request);
}

export function DELETE(request) {
  return runPagesHandler(handler, request);
}
