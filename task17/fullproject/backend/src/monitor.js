// ─── monitor.js ───────────────────────────────────────────────
// Task 4: CPU + Memory monitoring setup
//
// Хандлага: Node.js process.cpuUsage() + os module ашиглан
// тогтмол хугацааны зайтайгаар системийн мэдээлэл цуглуулна.
// ─────────────────────────────────────────────────────────────

const os = require('os');
const logger = require('./logger');
const { checkAlerts } = require('./alertRules');

// CPU хэрэглээ хувиар тооцоолох
// Node нь нийт CPU time-ийг µs-аар буцаана
let prevCpuUsage = process.cpuUsage();
let prevTime = Date.now();

function getCpuPercent() {
  const now = Date.now();
  const curr = process.cpuUsage(prevCpuUsage);

  const elapsed = (now - prevTime) * 1000; // µs болгоно
  const total = curr.user + curr.system;
  const percent = (total / elapsed) * 100;

  prevCpuUsage = process.cpuUsage();
  prevTime = now;

  return Math.min(100, Math.round(percent * 10) / 10); // 0–100%
}

// Memory мэдээлэл MB-аар
function getMemoryMB() {
  const mem = process.memoryUsage();
  return {
    heapUsedMB:  Math.round(mem.heapUsed  / 1024 / 1024),
    heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
    rssMB:       Math.round(mem.rss       / 1024 / 1024),
    externalMB:  Math.round(mem.external  / 1024 / 1024),
  };
}

// Системийн load average (1, 5, 15 минут)
function getSystemLoad() {
  const load = os.loadavg();
  const cpus = os.cpus().length;
  return {
    load1min:  Math.round((load[0] / cpus) * 100) / 100,
    load5min:  Math.round((load[1] / cpus) * 100) / 100,
    load15min: Math.round((load[2] / cpus) * 100) / 100,
    cpuCount:  cpus,
  };
}

/**
 * Task 4: Monitoring цуглуулах + лог бичих + alert шалгах
 * @param {number} intervalMs — хэр тогтмол цуглуулах (default 30s)
 */
function startMonitoring(intervalMs = 30_000) {
  console.log(`[monitor] Started — collecting every ${intervalMs / 1000}s`);

  const tick = () => {
    const cpuPercent = getCpuPercent();
    const memory     = getMemoryMB();
    const system     = getSystemLoad();

    const snapshot = {
      event:      'system_metrics',
      cpuPercent,
      ...memory,
      ...system,
      uptimeSeconds: Math.round(process.uptime()),
    };

    // Task 2: JSON structured log
    logger.info(snapshot);

    // Task 5: Alert шалгана
    checkAlerts(snapshot);
  };

  // Тэр дор нэг удаа + interval
  tick();
  return setInterval(tick, intervalMs);
}

module.exports = { startMonitoring, getCpuPercent, getMemoryMB };
