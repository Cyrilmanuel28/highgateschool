import { useMemo, useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import RichTextRenderer from '../components/RichTextRenderer.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import { cn } from '../lib/utils.js'

export default function Faq() {
  const { publishedOnly, db, loading } = useData()
  const info = db.schoolInfo
  const [open, setOpen] = useState(null)

  const faqs = useMemo(() => publishedOnly('faqs', 'order'), [publishedOnly])
  const groups = useMemo(() => {
    const map = new Map()
    faqs.forEach((f) => {
      const cat = f.category || 'General'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat).push(f)
    })
    return [...map.entries()]
  }, [faqs])

  return (
    <>
      <SeoHead
        title={info?.faqPageTitle || 'FAQ'}
        description={info?.faqPageDescription || `Frequently asked questions about admissions, fees, academics, and school life at ${info?.name || 'the school'}.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'FAQ' }]} />
          <p className="eyebrow">{info?.faqEyebrow || 'Quick Answers'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.faqHeading || 'Frequently Asked Questions'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.faqSubheading || "The answers families ask for most — and if yours isn't here, just ask us."}
          </p>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x max-w-4xl">
          {faqs.length === 0 ? (
            <EmptyState icon={HelpCircle} title="No FAQs yet" />
          ) : (
            groups.map(([cat, items], gi) => (
              <section key={cat} className={gi > 0 ? 'mt-14' : ''}>
                <h2 className="mb-6 font-serif text-3xl font-semibold text-navy-900">{cat}</h2>
                <div className="space-y-3.5">
                  {items.map((f, i) => {
                    const isOpen = open === f.id
                    return (
                      <Reveal key={f.id} delay={i * 40}>
                        <div className={cn('card overflow-hidden transition', isOpen && 'ring-2 ring-gold-300')}>
                          <button
                            onClick={() => setOpen(isOpen ? null : f.id)}
                            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                          >
                            <span className="font-serif text-lg font-semibold text-navy-900">{f.question}</span>
                            <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300', isOpen ? 'rotate-180 bg-gold-500 text-white' : 'bg-navy-50 text-navy-800')}>
                              <ChevronDown size={16} />
                            </span>
                          </button>
                          <div className={cn('grid transition-all duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                            <div className="overflow-hidden">
                              <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                                <RichTextRenderer html={f.answer} className="text-[15px]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    )
                  })}
                </div>
              </section>
            ))
          )}

          <div className="mt-14 rounded-2xl bg-navy-900 p-8 text-center sm:p-10">
            <h2 className="font-serif text-2xl font-semibold text-white">{info?.faqCtaTitle || 'Still have a question?'}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-navy-100">
              {info?.faqCtaText || 'Our team replies within one working day.'}
            </p>
            <a href="/contact" className="btn-royal mt-6">{info?.faqCtaLabel || 'Ask Us Anything'}</a>
          </div>
        </div>
      </div>
    </>
  )
}
