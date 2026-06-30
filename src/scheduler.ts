// Volume Weighted Average Price (VWAP) execution scheduler.
// Note: This codebase strictly avoids the terms "trader" and "market".

interface IntervalVolumeProfile {
  timeIndex: number;
  volumeFraction: number; // Percentage of daily volume typically transacted in this interval
}

class VwapScheduler {
  // Generates execution schedule based on historical volume profiling
  public generateSchedule(
    totalQuantity: number,
    profiles: IntervalVolumeProfile[]
  ): { timeIndex: number; sliceQuantity: number }[] {
    const totalFraction = profiles.reduce((sum, p) => sum + p.volumeFraction, 0);
    
    return profiles.map((p) => {
      // Normalize fraction and compute target slice quantity
      const normalizedFraction = p.volumeFraction / totalFraction;
      const sliceQuantity = Math.round(totalQuantity * normalizedFraction);
      return {
        timeIndex: p.timeIndex,
        sliceQuantity,
      };
    });
  }
}

// Demo: 8-interval day profile (U-shaped volume curve)
const historicalVolumeProfiles: IntervalVolumeProfile[] = [
  { timeIndex: 1, volumeFraction: 0.20 }, // Open
  { timeIndex: 2, volumeFraction: 0.12 },
  { timeIndex: 3, volumeFraction: 0.08 },
  { timeIndex: 4, volumeFraction: 0.05 },
  { timeIndex: 5, volumeFraction: 0.05 },
  { timeIndex: 6, volumeFraction: 0.10 },
  { timeIndex: 7, volumeFraction: 0.15 },
  { timeIndex: 8, volumeFraction: 0.25 }, // Close
];

const scheduler = new VwapScheduler();
const schedule = scheduler.generateSchedule(50000, historicalVolumeProfiles);

console.log("[VWAP Scheduler] Slice execution schedules for 50,000 unit order:");
schedule.forEach((slice) => {
  console.log(` Interval: ${slice.timeIndex} | Slice Size: ${slice.sliceQuantity} Units`);
});
