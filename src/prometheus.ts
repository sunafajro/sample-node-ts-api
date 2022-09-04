import * as client from "prom-client";

let promRegister: client.Registry | null = null;

// Метрики по дефолту
export const createRegister = () => {
  if (!promRegister) {
    // Create a Registry to register the metrics
    const register = new client.Registry();

    register.setDefaultLabels({
        app: 'api-nodejs-app'
    })

    client.collectDefaultMetrics({
      prefix: "node_",
      gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
      register,
    });

    promRegister = register;
  }

  return promRegister;
};
