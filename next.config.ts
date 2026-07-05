import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
};

// 183.B — withWorkflow wires the Workflow DevKit build transform (the "use
// workflow"/"use step" directives) and injects the internal /.well-known/workflow
// endpoints. Proven by Vercel's own Next 16.2.4 examples on the default Turbopack
// build, so no --webpack fallback is expected. Keep it as the outermost wrapper.
export default withWorkflow(nextConfig);
