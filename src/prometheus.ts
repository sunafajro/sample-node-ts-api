import * as client from "prom-client";

let promRegister: client.Registry | null = null;

export const createRegister = () => {
  if (!promRegister) {
    // Create a Registry to register the metrics
    const register = new client.Registry();

    client.collectDefaultMetrics({
      // app: "node-application-monitoring-app",
      prefix: "node_",
      //timeout: 10000,
      gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
      register,
    });

    promRegister = register;
  }

  return promRegister;
};
