import { Suspense } from "react";
export const dynamic = "force-dynamic";
async function Delayed() {
  await new Promise(resolve => setTimeout(resolve, 5000));
  return <p>Completed normally.</p>;
}
export default function Page() {
  return <main><h1>RSC cancellation reproduction</h1>
    <Suspense fallback={<p>Waiting...</p>}><Delayed /></Suspense>
  </main>;
}
