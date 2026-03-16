import styles from './ArchPage.module.css'

const services = [
  { name: 'Auth Service', port: 3001, emoji: '🔐', db: 'AuthDB',
    routes: ['POST /auth/register', 'POST /auth/login', 'GET /auth/me', 'POST /auth/verify', 'GET /auth/users (admin)'] },
  { name: 'Product Service', port: 3002, emoji: '📦', db: 'ProductDB',
    routes: ['GET /products?page&limit&name&category', 'GET /products/:id', 'POST /products (admin)', 'PUT /products/:id (admin)', 'DELETE /products/:id (admin)'] },
  { name: 'Order Service', port: 3003, emoji: '🛒', db: 'OrderDB',
    routes: ['POST /orders', 'GET /orders/user/:userId', 'GET /orders/:id', 'PATCH /orders/:id/status'] },
  { name: 'Payment Service', port: 3004, emoji: '💳', db: 'PaymentDB',
    routes: ['POST /payments', 'POST /payments/webhook', 'GET /payments/order/:orderId', 'GET /payments (admin)'] },
]

export default function ArchPage() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>System Architecture</h1>
        <p className={styles.sub}>Microservices topology & data flow</p>
      </div>

      {/* Diagram */}
      <div className={styles.diagram}>
        <div className={styles.node + ' ' + styles.frontend}>
          ⚛️ React Frontend
          <span className={styles.nodePort}>Vite :5173</span>
        </div>
        <div className={styles.arrow}>↕ HTTP</div>
        <div className={styles.node + ' ' + styles.gateway}>
          🔀 API Gateway
          <span className={styles.nodePort}>:3000 — JWT validation + rate limiting + routing</span>
        </div>
        <div className={styles.arrow}>↕ REST</div>
        <div className={styles.servicesRow}>
          {services.map(s => (
            <div key={s.name} className={styles.serviceCol}>
              <div className={styles.node + ' ' + styles.service}>
                {s.emoji} {s.name}
                <span className={styles.nodePort}>:{s.port}</span>
              </div>
              <div className={styles.node + ' ' + styles.db}>
                🗄 MySQL / {s.db}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route tables */}
      <div className={styles.routeGrid}>
        {services.map(s => (
          <div key={s.name} className={styles.routeCard}>
            <div className={styles.routeTitle}>{s.emoji} {s.name} <span className={styles.routePort}>:{s.port}</span></div>
            <div className={styles.routes}>
              {s.routes.map(r => (
                <div key={r} className={styles.route}>{r}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Flow */}
      <div className={styles.flowCard}>
        <div className={styles.flowTitle}>Request Flow</div>
        <div className={styles.flow}>
          {['Frontend', 'API Gateway', 'JWT Validation', 'Route to Service', 'Service Response', 'Client'].map((step, i, arr) => (
            <div key={step} className={styles.flowStep}>
              <div className={styles.flowNode}>{step}</div>
              {i < arr.length - 1 && <div className={styles.flowArrow}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
