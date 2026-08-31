const { existsSync, readdirSync } = require("node:fs");

const { join } = require("node:path");

const root = join(__dirname, "..");

const services = [
  "auth",
  "patient",
  "doctor",
  "test",
  "booking",
  "billing",
  "sample",
  "result",
  "verification",
  "report",
  "notification",
  "dashboard",
];

const required = [
  "frontend/src/main.tsx",
  "frontend/src/App.tsx",
  "backend/api-gateway/src/main.ts",
  ...services.flatMap((service) => [
    `backend/services/${service}-service/src/main.ts`,
    `backend/services/${service}-service/src/${service}.module.ts`,
  ]),
];

const missing = required.filter((file) => !existsSync(join(root, file)));

const actualServices = readdirSync(join(root, "backend/services"), {
  withFileTypes: true,
}).filter((item) => item.isDirectory()).length;

if (missing.length || actualServices !== 12) {
  console.error(JSON.stringify({ missing, actualServices }, null, 2));
  process.exit(1);
}

console.log("LabFlow structure validation passed (12 microservices).");
