// ============================================================
// 🧪 LAB 3 — SOLID: Open/Closed Principle
//
// ❌ Буруу дизайн:
//   class NotificationService {
//     sendEmail() { ... }
//     sendSMS()   { ... }   ← шинэ нэмэхэд class өөрчлөнө!
//   }
//
// ✅ Зөв дизайн:
//   NotificationSender (interface/abstract)
//     ↓
//   EmailSender, SmsSender, PushSender
//   Шинэ нэмэхэд NotificationService өөрчлөгдөхгүй ✅
// ============================================================

// "Interface" — abstract base
class NotificationSender {
  getType()                         { throw new Error("Not implemented"); }
  send(recipient, message)          { throw new Error("Not implemented"); }
}

// ---- Implementations ----
class EmailSender extends NotificationSender {
  getType() { return "EMAIL"; }
  send(recipient, message) {
    console.log(`[EMAIL] To: ${recipient} | ${message}`);
  }
}

class SmsSender extends NotificationSender {
  getType() { return "SMS"; }
  send(recipient, message) {
    console.log(`[SMS] To: ${recipient} | ${message}`);
  }
}

class PushSender extends NotificationSender {
  getType() { return "PUSH"; }
  send(recipient, message) {
    console.log(`[PUSH] To: ${recipient} | ${message}`);
  }
}

// ============================================================
// NotificationService — interface-тэй л ажиллана
// Concrete implementation мэдэхгүй ✅
// ============================================================
class NotificationService {
  constructor(senders) {
    // senders = [EmailSender, SmsSender, PushSender, ...]
    this.senders = {};
    senders.forEach((s) => {
      this.senders[s.getType()] = s;
    });
  }

  notify(type, recipient, message) {
    const sender = this.senders[type.toUpperCase()];
    if (!sender) throw new Error(`Unknown notification type: ${type}`);
    sender.send(recipient, message);
  }

  notifyAll(recipient, message) {
    Object.values(this.senders).forEach((s) => s.send(recipient, message));
  }
}

module.exports = { NotificationService, EmailSender, SmsSender, PushSender };
