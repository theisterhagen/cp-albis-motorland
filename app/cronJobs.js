import fetch from "node-fetch";
import schedule from "node-schedule";

export function scheduleAntragCheck(antragnr, shop) {
  let job = null;
  console.log("antragnr, shop", antragnr, shop);

  async function performCheck() {
    console.log(`Checking details for Antrag ${antragnr}`);
    try {
      const response = await fetch(
        `${process.env.SHOPIFY_APP_URL}/api/checkAntragDetails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ antragnr, shop }),
        },
      );
      const data = await response.json();

      if (data.complete) {
        job.cancel();
        console.log(`Task completed for Antrag ${antragnr}`);
      }
    } catch (error) {
      console.error("Failed to call API:", error);
    }
  }

  // Stage 1: Run every 5 minutes for 30 minutes
  job = schedule.scheduleJob("*/5 * * * *", performCheck);

  // Transition to Stage 2 after 30 minutes
  setTimeout(
    () => {
      if (job) job.cancel();
      // Stage 2: Run every hour for the next 4 hours
      job = schedule.scheduleJob("0 * * * *", performCheck);

      // Transition to Stage 3 after 4 hours
      setTimeout(
        () => {
          if (job) job.cancel();
          // Stage 3: Run once every day at 2 AM for 3 days
          job = schedule.scheduleJob("0 2 * * *", performCheck);

          // End task after 3 days
          setTimeout(
            () => {
              if (job) {
                job.cancel();
                console.log(
                  `Task ended automatically for Antrag ${antragnr} after 3 days.`,
                );
              }
            },
            3 * 24 * 60 * 60 * 1000,
          ); // 3 days in milliseconds
        },
        4 * 60 * 60 * 1000,
      ); // 4 hours in milliseconds
    },
    30 * 60 * 1000,
  ); // 30 minutes in milliseconds
}
