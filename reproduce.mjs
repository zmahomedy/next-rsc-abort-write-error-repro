const base = "http://127.0.0.1:3319";
for (let attempt = 1; attempt <= 5; attempt++) {
  const controller = new AbortController();
  const response = await fetch(base + "/?attempt=" + attempt, {
    headers: { Rsc: "1" }, signal: controller.signal
  });
  if (!response.ok || !response.headers.get("content-type")?.includes("text/x-component")) {
    throw new Error("Expected an RSC response, got " + response.status);
  }
  const reader = response.body.getReader();
  const first = await reader.read();
  if (first.done || !first.value?.length) throw new Error("No streamed chunk");
  console.log("Aborting RSC response", attempt, "after", first.value.length, "bytes");
  controller.abort();
  await new Promise(resolve => setTimeout(resolve, 250));
}
console.log("Inspect server output for REPRO_REQUEST_ERROR and the destination-stream message.");
