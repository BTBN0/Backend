// ─── alertRules.js ────────────────────────────────────────────
// Task 5: Alert rule-уудыг тодорхойлно
//
// Зарчим:
//   • Нөхцөл: хэмжигч утга хязгаараас хэтэрвэл
//   • Давтамж: N удаагийн дараа дахин alert гаргахгүй (cooldown)
//   • Гаралт: logger.warn / logger.error + (optional) webhook
// ─────────────────────────────────────────────────────────────

const logger = require('./logger');

// ─── Alert тодорхойлолт ──────────────────────────────────────
// name        — alert-ийн нэр (log-д харагдана)
// level       — 'warn' | 'error'
// check(snap) — true буцаавал alert дэргэдэнэ
// cooldownMs  — дараагийн alert хэдэн ms дараа боломжтой
// message     — хүний унших тайлбар

const ALERT_RULES = [
  {
    name:       'high_cpu',
    level:      'warn',
    cooldownMs: 5 * 60_000,    // 5 минут
    check: (s) => s.cpuPercent > 80,
    message:    (s) => `CPU хэрэглээ өндөр: ${s.cpuPercent}%  (хязгаар: 80%)`,
  },
  {
    name:       'critical_cpu',
    level:      'error',
    cooldownMs: 2 * 60_000,    // 2 минут
    check: (s) => s.cpuPercent > 95,
    message:    (s) => `CPU КРИТИК: ${s.cpuPercent}%  — нэн яаралтай шалгана уу`,
  },
  {
    name:       'high_memory',
    level:      'warn',
    cooldownMs: 5 * 60_000,
    check: (s) => s.heapUsedMB > s.heapTotalMB * 0.85,
    message:    (s) => `Heap ашиглалт өндөр: ${s.heapUsedMB}/${s.heapTotalMB} MB`,
  },
  {
    name:       'critical_memory',
    level:      'error',
    cooldownMs: 2 * 60_000,
    check: (s) => s.heapUsedMB > s.heapTotalMB * 0.95,
    message:    (s) => `Heap КРИТИК: ${s.heapUsedMB}/${s.heapTotalMB} MB — Memory leak?`,
  },
  {
    name:       'high_rss',
    level:      'warn',
    cooldownMs: 5 * 60_000,
    check: (s) => s.rssMB > 512,      // 512 MB-аас хэтэрвэл
    message:    (s) => `RSS (нийт process memory) өндөр: ${s.rssMB} MB`,
  },
  {
    name:       'high_load',
    level:      'warn',
    cooldownMs: 5 * 60_000,
    check: (s) => s.load1min > 2.0,   // 1min load average CPU-ийн 2 дахин
    message:    (s) => `System load өндөр: ${s.load1min} (CPU × 2 давсан)`,
  },
];

// ─── Cooldown state ──────────────────────────────────────────
// { [alertName]: lastFiredAt (timestamp) }
const lastFired = {};

/**
 * Task 5: Snapshot-ийг бүх alert rule-тай шалгана
 * @param {object} snapshot — monitor.js-оос ирсэн metrics
 */
function checkAlerts(snapshot) {
  const now = Date.now();

  for (const rule of ALERT_RULES) {
    if (!rule.check(snapshot)) continue;

    // Cooldown шалгана
    const prev = lastFired[rule.name] || 0;
    if (now - prev < rule.cooldownMs) continue;

    lastFired[rule.name] = now;

    // Task 2: JSON structured alert log
    logger[rule.level]({
      event:    'alert_fired',
      alert:    rule.name,
      message:  rule.message(snapshot),
      metrics:  {
        cpuPercent:  snapshot.cpuPercent,
        heapUsedMB:  snapshot.heapUsedMB,
        heapTotalMB: snapshot.heapTotalMB,
        rssMB:       snapshot.rssMB,
        load1min:    snapshot.load1min,
      },
      cooldownMs: rule.cooldownMs,
    });

    // Optional: Webhook / PagerDuty / Slack notification
    sendAlert(rule, snapshot).catch((err) =>
      logger.error({ event: 'alert_send_failed', alert: rule.name, error: err.message })
    );
  }
}

// ─── Alert илгээх (webhook жишээ) ────────────────────────────
async function sendAlert(rule, snapshot) {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl) return; // Тохиргоогүй бол өнгөрнө

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text:    `[${rule.level.toUpperCase()}] ${rule.message(snapshot)}`,
      service: process.env.SERVICE_NAME || 'api',
      time:    new Date().toISOString(),
    }),
  });
}

module.exports = { checkAlerts, ALERT_RULES };
