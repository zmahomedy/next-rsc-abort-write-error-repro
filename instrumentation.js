export function onRequestError(error, request, context) {
  console.error("REPRO_REQUEST_ERROR", JSON.stringify({
    name: error.name, message: error.message,
    path: request.path, renderSource: context.renderSource
  }));
}
