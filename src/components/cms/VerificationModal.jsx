import { useState } from 'react'
import {
  CheckCircle2, XCircle, AlertTriangle, Loader2, ArrowRight, RotateCcw,
  ExternalLink, ShieldCheck, Database, Server, HardDrive, RefreshCw, Globe, Check
} from 'lucide-react'
import { STAGE_LABELS, VERIFICATION_STAGES } from '../../lib/verifier.js'
import { Btn, Modal } from './UI.jsx'

const STAGE_ICONS = {
  validation: ShieldCheck,
  database: Database,
  readback: Server,
  storage: HardDrive,
  api: RefreshCw,
  cache: RefreshCw,
  liveWebsite: Globe,
  regression: CheckCircle2
}

export default function VerificationModal({
  isOpen,
  onClose,
  verificationResult,
  isVerifying = false,
  onRollback,
  canRollback = false,
  recordTitle = '',
  publicRoute = null
}) {
  const [rollingBack, setRollingBack] = useState(false)
  const [rollbackSuccess, setRollbackSuccess] = useState(false)

  if (!isOpen && !isVerifying) return null

  const stages = verificationResult?.stages || {}
  const overall = verificationResult?.overall || (isVerifying ? 'VERIFYING' : 'PENDING')
  const failedStage = verificationResult?.failedStage
  const stageKeys = Object.values(VERIFICATION_STAGES)

  const handleRollback = async () => {
    if (!onRollback) return
    setRollingBack(true)
    try {
      const res = await onRollback()
      if (res && res.ok) {
        setRollbackSuccess(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setRollingBack(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen || isVerifying}
      onClose={onClose}
      title="Publish & System Verification"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header status banner */}
        <div
          className={`rounded-2xl p-4 border transition-all ${
            isVerifying
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : overall === 'VERIFIED'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {isVerifying ? (
              <Loader2 className="h-6 w-6 animate-spin text-amber-600 shrink-0" />
            ) : overall === 'VERIFIED' ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 shrink-0" />
            )}
            <div>
              <h3 className="font-semibold text-base">
                {isVerifying
                  ? 'Verifying Publication Chain…'
                  : overall === 'VERIFIED'
                  ? 'Change Verified & Live on Website'
                  : `Publication Failed at Stage: ${STAGE_LABELS[failedStage] || failedStage || 'System'}`}
              </h3>
              <p className="text-xs mt-0.5 opacity-90">
                {isVerifying
                  ? 'Testing Database, Storage, API, Cache, and Live Website rendering…'
                  : overall === 'VERIFIED'
                  ? `"${recordTitle || 'Content'}" has passed all 8 automated checks and is successfully published.`
                  : stages[failedStage]?.message || 'One or more verification checks failed. The public site has not been updated with invalid content.'}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Stage Checklist */}
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
          {stageKeys.map((stageKey, idx) => {
            const stage = stages[stageKey] || { status: isVerifying ? 'PENDING' : 'WAITING' }
            const Icon = STAGE_ICONS[stageKey] || ShieldCheck
            const isPass = stage.status === 'PASS'
            const isFail = stage.status === 'FAIL'
            const isRunning = isVerifying && !isPass && !isFail

            return (
              <div key={stageKey} className="flex items-start gap-3.5 p-3.5 transition hover:bg-slate-50">
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-semibold ${
                    isPass
                      ? 'bg-emerald-100 text-emerald-700'
                      : isFail
                      ? 'bg-red-100 text-red-700'
                      : isRunning
                      ? 'bg-amber-100 text-amber-700 animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isPass ? (
                    <Check size={14} className="stroke-[3]" />
                  ) : isFail ? (
                    <XCircle size={14} />
                  ) : isRunning ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    idx + 1
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                      <Icon size={13} className="text-slate-500" />
                      {STAGE_LABELS[stageKey]}
                    </p>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isPass
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isFail
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : isRunning
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      {isPass ? 'PASS' : isFail ? 'FAIL' : isRunning ? 'CHECKING' : 'PENDING'}
                    </span>
                  </div>
                  {stage.message && (
                    <p className={`text-[11px] mt-0.5 ${isFail ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                      {stage.message}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Rollback confirmation alert */}
        {rollbackSuccess && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 flex items-center gap-2">
            <RotateCcw size={14} className="text-blue-600" />
            <span>Rollback complete: The previous working version has been safely restored.</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div>
            {overall === 'FAILED' && canRollback && !rollbackSuccess && (
              <Btn
                variant="outline"
                onClick={handleRollback}
                disabled={rollingBack}
                className="text-red-700 border-red-200 hover:bg-red-50"
              >
                {rollingBack ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Rolling back…
                  </>
                ) : (
                  <>
                    <RotateCcw size={14} /> Auto-Rollback to Previous Version
                  </>
                )}
              </Btn>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {overall === 'VERIFIED' && publicRoute && (
              <a
                href={publicRoute}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-900 transition hover:bg-navy-50"
              >
                <ExternalLink size={13} /> View Live Page
              </a>
            )}
            <Btn variant="primary" onClick={onClose} disabled={isVerifying}>
              {overall === 'VERIFIED' ? 'Done' : 'Dismiss'}
            </Btn>
          </div>
        </div>
      </div>
    </Modal>
  )
}
