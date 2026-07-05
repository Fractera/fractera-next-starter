import { sleep, FatalError } from "workflow";

// 183.B PoC — a single durable workflow proving the Vercel Workflow DevKit runs
// inside the Fractera slot (Next 16.2 + Turbopack, under PM2 with the Local
// World). The "use workflow" directive makes this function durable: its state is
// checkpointed by the active World, so it survives a process restart and resumes
// mid-flight (the point of the whole SDK). Each "use step" is an independently
// retried, checkpointed unit.
//
// Kept deterministic on purpose (no random failure) so the PoC's observability
// signal is clean. The sleep is the durability demonstrator: the run pauses for
// 5s without holding a request or a resource, then continues — proving the World
// re-drives the workflow from its checkpoint rather than from a live call stack.

export async function pocDurable(label: string) {
  "use workflow";

  const record = await createRecord(label);
  await sleep("5s"); // durable pause — no request/thread is held across it
  const done = await finalizeRecord(record);

  return { id: record.id, label: done.label, status: "completed" };
}

async function createRecord(label: string) {
  "use step";

  if (!label) {
    // FatalError skips retries — a permanently invalid input, not a transient fault.
    throw new FatalError("pocDurable: empty label");
  }

  const id = crypto.randomUUID();
  console.log(`[wf-poc] step createRecord id=${id} label=${label}`);
  return { id, label };
}

async function finalizeRecord(record: { id: string; label: string }) {
  "use step";

  console.log(`[wf-poc] step finalizeRecord id=${record.id}`);
  return { label: `${record.label} (finalized)` };
}
