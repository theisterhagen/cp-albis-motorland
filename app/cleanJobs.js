import fetch from "node-fetch";
import schedule from "node-schedule";

const scheduledJobs = new Map();

export function scheduleCleanUp(albisOrderId) {
  let job = null;

  async function performCheck() {
    console.log(`Checking details for albisOrderId ${albisOrderId}`);
    try {
      const response = await fetch(
        `${process.env.SHOPIFY_APP_URL}/api/cleanUp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ albisOrderId }),
        },
      );
      const data = await response.json();

      if (data.complete) {
        if (job) job.cancel();
        scheduledJobs.delete(albisOrderId);
        console.log(`Job completed ConsorsOrderId ${albisOrderId}`);
      }
    } catch (error) {
      console.error("Failed to call API:", error);
    }
  }

  // Schedule the function to run after 2 hours and 30 minutes
  const delay = 1000 * 60 * 60 * 24 * 3; // 3 days in milliseconds
  // const delay = 3 * 60 * 1000; // 3 minutos

  const startJob = () => {
    job = schedule.scheduleJob(new Date(Date.now() + delay), performCheck);
    scheduledJobs.set(albisOrderId, job);
  };

  startJob();

  return {
    cancel: () => {
      if (job) {
        job.cancel();
        scheduledJobs.delete(albisOrderId);
        console.log(
          `Scheduled task for consorsOrderId ${albisOrderId} has been canceled.`,
        );
      }
    },
  };
}

export function getScheduledJob(albisOrderId) {
  return scheduledJobs.get(albisOrderId);
}
