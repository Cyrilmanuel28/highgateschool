import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, Info, ArrowRight, CreditCard, Landmark, Repeat } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import { cn } from '../lib/utils.js'

const GBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })

export default function Fees() {
  const { publishedOnly, db, loading } = useData()
  const info = db.schoolInfo
  const [active, setActive] = useState(0)

  const structures = useMemo(() => publishedOnly('fees', 'order'), [publishedOnly])

  if (loading) {
    return (
      <>
        <SeoHead title={info?.feesPageTitle || 'School Fees'} />
        <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="container-x relative">
            <p className="eyebrow">{info?.feesEyebrow || 'Fees & Finance'}</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.feesHeading || 'School Fees'}</h1>
          </div>
        </div>
        <div className="bg-surface py-8 sm:py-16"><div className="container-x"><GridSkeleton count={4} /></div></div>
      </>
    )
  }

  return (
    <>
      <SeoHead
        title={info?.feesPageTitle || 'School Fees'}
        description={info?.feesPageDescription || `Fee structure for ${info?.name || 'Highgate School'} — tuition by year group, deposits, and scholarships.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: info?.feesBreadcrumbLabel || 'School Fees' }]} />
          <p className="eyebrow">{info?.feesEyebrow || 'Fees & Finance'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.feesHeading || 'School Fees'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.feesSubheading || 'Transparent, termly fees for every stage of the Highgate journey — with payment plans and bursaries.'}
          </p>
        </div>
      </div>

      <div className="bg-surface py-8 sm:py-16">
        <div className="container-x">
          {structures.length === 0 ? (
            <EmptyState icon={Wallet} title="No fee structures published" />
          ) : (
            <>
              <div className="mb-10 flex flex-wrap gap-2">
                {structures.map((f, i) => (
                  <button
                    key={f.id}
                    onClick={() => setActive(i)}
                    className={cn(
                      'rounded-lg px-5 py-2.5 text-xs font-semibold transition',
                      active === i ? 'bg-royal text-white shadow-royal' : 'bg-white text-charcoal border border-slate-200/80 shadow-subtle hover:bg-surface hover:text-royal'
                    )}
                  >
                    {f.level}
                  </button>
                ))}
              </div>

              {structures.map((f, i) => {
                if (i !== active) return null
                return (
                  <Reveal key={f.id}>
                    <div className="card overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-navy-900 px-8 py-6">
                        <div>
                          <h2 className="font-serif text-2xl font-semibold text-white">{f.level}</h2>
                          <p className="mt-0.5 text-sm text-navy-200">Academic Year {f.academicYear}</p>
                        </div>
                        <span className="rounded-md bg-gold-500 px-3.5 py-1 text-xs font-bold text-navy-950 shadow-sm">
                          {f.items.length} items
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100 px-8">
                        {f.items.map((item, j) => (
                          <div key={j} className="flex items-center justify-between gap-4 py-5">
                            <p className="font-medium text-navy-900">{item.label}</p>
                            <p className="font-serif text-xl font-semibold text-royal">
                              {item.amount === 0 ? 'Included' : GBP.format(item.amount)}
                            </p>
                          </div>
                        ))}
                      </div>
                      {f.notes && (
                        <div className="flex gap-3 border-t border-gold-200/50 bg-gold-50/70 px-8 py-5">
                          <Info size={18} className="mt-0.5 shrink-0 text-gold-600" />
                          <p className="text-sm leading-relaxed text-navy-950">{f.notes}</p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                )
              })}

              <div className="mt-14 grid gap-6 md:grid-cols-2">
                <div className="card p-8">
                  <h3 className="font-serif text-xl font-semibold text-navy-900">{info?.paymentBursariesTitle || 'Payment & Bursaries'}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                    {info?.paymentBursariesText || 'Fees are payable termly in advance. Annual payment attracts a 2% discount, and a confidential bursary fund supports families facing financial hardship. Full details are available from the finance office.'}
                  </p>
                </div>
                <div className="card p-8">
                  <h3 className="font-serif text-xl font-semibold text-navy-900">Download the Fee Brochure</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                    The complete fee schedule is also available as a PDF in the downloads section.
                  </p>
                  <Link to="/downloads" className="btn-outline mt-5">
                    Go to Downloads <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="mt-14">
                <h3 className="font-serif text-2xl font-semibold text-navy-900">{info?.paymentMethodsTitle || 'Ways to Pay'}</h3>
                <p className="mt-2 max-w-2xl text-sm text-charcoal/70">
                  {info?.paymentMethodsText || 'Fees are payable termly in advance. Pay the full year upfront and receive a 2% discount; a confidential bursary fund also supports families facing financial hardship.'}
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  {[
                    { icon: Landmark, title: 'Bank Transfer', text: 'Direct transfer to our finance account, quoting your child\'s fee reference.' },
                    { icon: CreditCard, title: 'Card Payment', text: 'Pay by credit or debit card online through the parent portal or at the finance office.' },
                    { icon: Repeat, title: 'Standing Order', text: 'Spread termly fees with a monthly standing order arrangement for eligible families.' }
                  ].map((m) => (
                    <div key={m.title} className="card-hover p-6">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-royal/10 border border-royal/20 text-royal">
                        <m.icon size={22} />
                      </span>
                      <h4 className="mt-4 font-serif text-lg font-semibold text-navy-900">{m.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
