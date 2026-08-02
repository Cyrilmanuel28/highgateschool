import { useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X, Compass, Maximize2 } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Img from '../components/Img.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { cn } from '../lib/utils.js'

export default function VirtualTour() {
  const { db } = useData()
  const info = db.schoolInfo
  const scenes = (db.tourScenes || []).filter((s) => (s.status === undefined || s.status === 'published') && s.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
  const [activeIndex, setActiveIndex] = useState(scenes.length ? 0 : null)
  const [fullscreen, setFullscreen] = useState(false)

  const openScene = (i) => {
    setActiveIndex(i)
    setFullscreen(true)
  }

  const step = (dir) => {
    setActiveIndex((i) => (i + dir + scenes.length) % scenes.length)
  }

  const scene = activeIndex !== null ? scenes[activeIndex] : null

  return (
    <>
      <SeoHead
        title={info?.virtualTourPageTitle || 'Virtual School Tour'}
        description={info?.virtualTourPageDescription || `Take an interactive virtual tour of the ${info?.name || 'Highgate School'} campus.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Virtual Tour' }]} />
          <p className="eyebrow">{info?.virtualTourEyebrow || 'Explore from Anywhere'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.virtualTourHeading || 'Virtual School Tour'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            Step inside our classrooms, labs, library, and sports facilities — from anywhere in the world.
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm text-slate-500">
              Choose a scene below to open the viewer. Use the arrows to move through the tour.
            </p>

            {scenes.length === 0 ? (
              <div className="mt-6">
                <EmptyState icon={Compass} title="Tour coming soon" text="Virtual tour scenes will appear here." />
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {scenes.map((s, i) => (
                  <Reveal key={s.id} delay={(i % 3) * 60}>
                    <button onClick={() => openScene(i)} className="card-hover group relative block w-full overflow-hidden text-left">
                      <div className="aspect-[16/10] overflow-hidden">
                        <Img src={s.image} alt={s.title} lazy className="transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900">{s.category}</span>
                        <h3 className="mt-2 font-serif text-xl font-semibold text-white">{s.title}</h3>
                        <p className="text-xs text-navy-100">{s.location}</p>
                      </div>
                      <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-card backdrop-blur transition-transform group-hover:scale-110">
                        <Expand size={16} />
                      </span>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {scene && (
        <div className={cn('fixed inset-0 z-[90] flex flex-col bg-navy-950', fullscreen ? '' : 'items-center justify-center p-4')}>
          <div className={cn('flex w-full flex-col overflow-hidden bg-navy-900', fullscreen ? 'h-full' : 'max-h-[90vh] max-w-5xl rounded-2xl')}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <Compass size={18} className="text-gold-400" />
                <div>
                  <p className="font-serif text-base font-semibold text-white">{scene.title}</p>
                  <p className="text-xs text-navy-200">{scene.location} · {scene.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setFullscreen((f) => !f)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-gold-500 hover:text-navy-900" aria-label="Toggle fullscreen">
                  <Maximize2 size={15} />
                </button>
                <button onClick={() => setFullscreen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-gold-500 hover:text-navy-900" aria-label="Close viewer">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden">
              <img src={scene.image} alt={scene.title} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-navy-950/20" />
              <button
                onClick={() => step(-1)}
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-card transition hover:bg-gold-500 hover:text-navy-900"
                aria-label="Previous scene"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => step(1)}
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-card transition hover:bg-gold-500 hover:text-navy-900"
                aria-label="Next scene"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-navy-100">{scene.description}</p>
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  {scenes.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Scene ${i + 1}`}
                      className={cn('h-1.5 rounded-full transition-all', i === activeIndex ? 'w-6 bg-gold-500' : 'w-1.5 bg-white/30')}
                    />
                  ))}
                </div>
                <p className="mt-3 text-center text-xs font-semibold text-gold-300">
                  {activeIndex + 1} / {scenes.length} · {scene.category}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
