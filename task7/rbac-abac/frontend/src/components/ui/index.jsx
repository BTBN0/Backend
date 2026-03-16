// src/components/ui/index.jsx
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

// ─── Tag ────────────────────────────────────────────────────────────────────
export function Tag({ variant = 'perm', children }) {
  return <span className={`tag-${variant}`}>{children}</span>
}

// ─── Spinner ────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const sz = { sm: 'w-4 h-4 border', md: 'w-5 h-5 border-2', lg: 'w-8 h-8 border-2' }[size]
  return (
    <div className={`${sz} border-rim border-t-iris rounded-full animate-spin`} />
  )
}

// ─── Loading state ───────────────────────────────────────────────────────────
export function Loading({ text = 'Уншиж байна...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ghost text-sm font-mono">
      <Spinner /> {text}
    </div>
  )
}

// ─── Empty / Error ───────────────────────────────────────────────────────────
export function Empty({ icon = '◌', title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-2 text-ghost">
      <span className="text-4xl opacity-30">{icon}</span>
      {title && <p className="text-snow text-sm font-display">{title}</p>}
      {desc  && <p className="text-xs max-w-xs text-center">{desc}</p>}
    </div>
  )
}

// ─── Error box ───────────────────────────────────────────────────────────────
export function ErrorBox({ message }) {
  if (!message) return null
  return (
    <div className="bg-flame/8 border border-flame/25 rounded-lg px-4 py-3 text-flame text-sm font-mono">
      ⚠ {message}
    </div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', noPad }) {
  return (
    <div className={clsx('bg-plate border border-rim rounded-xl overflow-hidden', !noPad && 'p-5', className)}>
      {children}
    </div>
  )
}

// ─── Section label ───────────────────────────────────────────────────────────
export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] tracking-[.18em] uppercase text-ghost font-mono">{children}</span>
      <div className="flex-1 h-px bg-rim" />
    </div>
  )
}

// ─── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button' }) {
  const base = 'inline-flex items-center gap-2 font-sans font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none'
  const variants = {
    primary: 'bg-iris hover:bg-iris/80 text-white shadow-lg shadow-iris/20',
    danger:  'bg-flame hover:bg-flame/80 text-white',
    ghost:   'bg-transparent border border-rim hover:border-iris/50 hover:text-snow text-ghost',
    volt:    'bg-volt hover:bg-volt/80 text-ink font-semibold',
  }
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-sm px-5 py-2.5',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────
export function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-[10px] tracking-[.14em] uppercase text-ghost font-mono">{label}</label>}
      <input id={id} className={clsx('input-base', error && 'border-flame focus:border-flame focus:ring-flame/15', className)} {...props} />
      {error && <span className="text-[11px] text-flame">{error}</span>}
    </div>
  )
}

// ─── Select ──────────────────────────────────────────────────────────────────
export function Select({ label, id, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-[10px] tracking-[.14em] uppercase text-ghost font-mono">{label}</label>}
      <select
        id={id}
        className={clsx('input-base appearance-none', className)}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

// ─── Stat card ───────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, glowColor = 'iris' }) {
  const glows = { iris: 'bg-iris', volt: 'bg-volt', moss: 'bg-moss', gold: 'bg-gold', flame: 'bg-flame' }
  return (
    <div className="bg-plate border border-rim rounded-xl p-5 relative overflow-hidden group hover:border-iris/40 transition-colors duration-200">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="font-display text-3xl text-snow mb-1">{value ?? '—'}</div>
      <div className="text-[10px] tracking-[.14em] uppercase text-ghost font-mono">{label}</div>
      <div className={clsx('absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity', glows[glowColor])} />
    </div>
  )
}

// ─── Table ───────────────────────────────────────────────────────────────────
export function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-rim">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-3 text-[10px] tracking-[.14em] uppercase text-ghost font-mono whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-rim/30 hover:bg-iris/3 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-smoke whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Toast ───────────────────────────────────────────────────────────────────
let _showToast = null
export function useToast() {
  return { toast: (msg, type = 'success') => _showToast?.(msg, type) }
}

export function ToastProvider() {
  const [toasts, setToasts] = useState([])

  _showToast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={clsx(
            'px-4 py-2.5 rounded-lg font-sans text-sm font-medium shadow-xl animate-fade-up',
            t.type === 'success' ? 'bg-moss text-ink' : 'bg-flame text-white'
          )}
        >
          {t.msg}
        </div>
      ))}
    </div>
  )
}
