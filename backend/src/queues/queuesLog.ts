import { cloneRepositoryQueue } from "./queues";

cloneRepositoryQueue.on("waiting", (job) => {
  console.log("job added to cloneRepositoryQueue, job Id: ", job);
});
