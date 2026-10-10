import cron from "node-cron";
import { Store } from "../../features/store/models/Store";
import { FleetAuditRepository } from "../../features/fleet-audit/repositories/FleetAuditRepository";
import { sendEmail } from "../../utils/sendEmail"; // Utilizes your existing email engine utility!

// ⏱️ Schedule to run every single night at 22:00 (10 PM) when mall operations wind down
cron.schedule("0 22 * * *", async () => {
  console.log("🌙 Running Nightly Retail Fleet Allocation Audit Sweep...");
  const auditRepo = new FleetAuditRepository();
  const today = new Date();

  try {
    // 1. Fetch all active retail stores from the database
    const stores = await Store.find({ isActive: true });

    for (const store of stores) {
      // 2. Grab today's latest audit log for this specific store
      const todayAudits = await auditRepo.findByDate(today, String(store._id));
      const latestAudit = todayAudits[0]; // Get the most recent shift record

      if (!latestAudit) continue; // Skip if no data was logged for this store today

      const activeFleet =
        latestAudit.metrics.total - latestAudit.metrics.damaged;

      // 3. Evaluate the threshold logic gate
      if (activeFleet < store.minTrolleyThreshold) {
        console.log(
          `🚨 Shortage detected at ${store.name}. Dispatching operational email...`,
        );

        const emailPayload = {
          to: store.managerEmail,
          subject: `⚠️ Fleet Status Update & Remediation Plan: ${store.name}`,
          text:
            `Dear Store Manager,\n\n` +
            `During our closing fleet audit for today, our team noted that your active trolley deployment dropped to ${activeFleet} units, which is below your baseline threshold of ${store.minTrolleyThreshold}.\n\n` +
            `Operational Status Breakdown:\n` +
            `- Total Logged Fleet: ${latestAudit.metrics.total}\n` +
            `- Undergoing Wheel/Frame Repairs: ${latestAudit.metrics.damaged}\n` +
            `- Out for Deep Pressure Washing: ${latestAudit.metrics.dirty}\n\n` +
            `Remediation Action Taken:\n` +
            `To ensure zero disruption to your early morning shopping floor lanes, our night sweepers crew has deployed 2 extra heavy-duty experience transport trolleys to your main entrance bay for tomorrow's opening shift.\n\n` +
            `Our maintenance team will prioritize the damaged units first thing in the morning.\n\n` +
            `Best Regards,\n` +
            `United Trolley Operations Management Terminal`,
        };

        // 4. Fire the email without blocking the application threads
        await sendEmail(emailPayload);
      }
    }
  } catch (error) {
    console.error("Error executing nightly operational sweep:", error);
  }
});
