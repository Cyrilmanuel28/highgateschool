import { useMemo } from 'react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import { DepartmentCard } from '../components/Cards.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Reveal from '../components/Reveal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { GridSkeleton } from '../components/Skeletons.jsx'
import { Library } from 'lucide-react'

export default function Departments() {
  const { publishedOnly, db, loading } = useData()
  const info = db.schoolInfo
  const departments = useMemo(() => publishedOnly('departments', 'order'), [publishedOnly])
  const headName = (headId) => {
    const s = (db.staff || []).find((x) => x.id === headId)
    return s ? s.name : ''
  }

  if (loading) {
    return (
      <>
        <SeoHead title={info?.departmentsPageTitle || 'Departments'} />
        <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="container-x relative">
            <p className="eyebrow">{info?.departmentsEyebrow || 'Faculty'}</p>
            <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.departmentsHeading || 'Academic Departments'}</h1>
          </div>
        </div>
        <div className="bg-cream py-16"><div className="container-x"><GridSkeleton count={6} /></div></div>
      </>
    )
  }

  return (
    <>
      <SeoHead
        title={info?.departmentsPageTitle || 'Departments'}
        description={info?.departmentsPageDescription || `Academic departments at ${info?.name || 'the school'} — languages, mathematics, sciences, humanities, arts, and sport.`}
      />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Departments' }]} />
          <p className="eyebrow">{info?.departmentsEyebrow || 'Faculty'}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white sm:text-6xl">{info?.departmentsHeading || 'Academic Departments'}</h1>
          <p className="mt-4 max-w-xl text-navy-100">
            {info?.departmentsSubheading || 'Six departments, one shared mission — outstanding teaching in every discipline.'}
          </p>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          {departments.length === 0 ? (
            <EmptyState icon={Library} title="No departments yet" />
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((d, i) => (
                <Reveal key={d.id} delay={i * 70} className="h-full">
                  <DepartmentCard dept={d} headName={headName(d.headStaff)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
