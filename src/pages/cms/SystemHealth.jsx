import { useState, useEffect } from 'react'
import {
  Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Database,
  ShieldCheck, HardDrive, Globe, Search, Layers, Server, Clock, ExternalLink,
  ChevronRight, Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Card, Btn, StatusBadge } from '../../components/cms/UI.jsx'

export default function SystemHealth() {
  const { checkSystemHealth, checkContentConsistency, db } = useData()
  const [running, setRunning] = useState(false)
  const [healthData, setHealthData] = useState(null)
  const [consistencyData, setConsistencyData] = useState(null)
  const [activeTab, setActiveTab] = useState('health') // 'health' | 'consistency'

  const runDiagnostics = async () => {
    setRunning(true)
    try {
      const hRes = await checkSystemHealth()
      setHealthData(hRes)
      const cRes = checkContentConsistency()
      setConsistencyData(cRes)
    } finally {
      setRunning(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const isHealthy = healthData?.overall === 'HEALTHY'
  const checks = healthData?.checks || []
  const issues = consistencyData?.issues || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Health & Verification Diagnostics"
        subtitle="Live automated auditing of Database, Authentication, Storage, API, Routes, and Content Integrity"
        action={
          <Btn variant="primary" onClick={runDiagnostics} disabled={running}>
            <RefreshCw size={14} className={running ? 'animate-spin' : ''} />
            {running ? 'Running Audit…' : 'Run Full Diagnostics'}
          </Btn>
        }
      />

      {/* Main Overall Health Banner */}
      <div
        className={`rounded-3xl p-6 border shadow-sm transition-all duration-300 ${
          running
            ? 'bg-amber-50 border-amber-200 text-amber-950'
            : isHealthy
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
            : 'bg-red-500/10 border-red-500/30 text-red-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                running
                  ? 'bg-amber-500 text-white animate-pulse'
                  : isHealthy
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {running ? (
                <RefreshCw size={26} className="animate-spin" />
              ) : isHealthy ? (
                <CheckCircle2 size={30} />
              ) : (
                <AlertTriangle size={30} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Reliability Status
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">
                  {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleTimeString() : 'Checking…'}
                </span>
              </div>
              <h2 className="text-2xl font-bold font-serif tracking-tight mt-0.5">
                {running
                  ? 'DIAGNOSTICS IN PROGRESS…'
                  : isHealthy
                  ? 'SYSTEM HEALTH: HEALTHY'
                  : 'SYSTEM HEALTH: ISSUES DETECTED'}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {isHealthy
                  ? 'All core systems are operational. The Developer Dashboard and Live Website are fully synchronized.'
                  : 'One or more subsystem checks reported warnings or failures. Review the breakdown below.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('health')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'health'
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white/80 text-navy-900 hover:bg-white'
              }`}
            >
              System Checks ({checks.length})
            </button>
            <button
              onClick={() => setActiveTab('consistency')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'consistency'
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white/80 text-navy-900 hover:bg-white'
              }`}
            >
              Content Consistency ({issues.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: System Checks */}
      {activeTab === 'health' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {checks.map((chk, i) => {
            const isPass = chk.status === 'PASS'
            const isWarn = chk.status === 'WARN'
            return (
              <div
                key={i}
                className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-navy-300 transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      isPass
                        ? 'bg-emerald-50 text-emerald-700'
                        : isWarn
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {isPass ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-navy-900">{chk.name}</h4>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full ${
                          isPass
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isWarn
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {chk.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{chk.message}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tab 2: Content Consistency */}
      {activeTab === 'consistency' && (
        <Card
          title="Content Consistency Audit"
          subtitle="Verifies that Database entities adhere to schema rules, have unique slugs, valid relation pointers, and media integrity"
        >
          {issues.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-navy-900 font-serif">100% Consistent</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No duplicate slugs, missing required fields, or orphan relationships were detected across any of your website collections.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {issues.map((iss, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        iss.severity === 'error'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {iss.severity}
                    </span>
                    <span className="text-xs font-semibold text-navy-800">{iss.entity}</span>
                    <span className="text-xs text-slate-600">{iss.message}</span>
                  </div>
                  {iss.id && (
                    <Link
                      to={`/dashboard/${iss.entity}/${iss.id}`}
                      className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center gap-1 shrink-0"
                    >
                      Inspect <ChevronRight size={13} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
