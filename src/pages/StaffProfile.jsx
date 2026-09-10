import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Img from '../components/Img.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { Avatar } from '../components/Cards.jsx'
import { DetailSkeleton } from '../components/Skeletons.jsx'
import NotFound from './NotFound.jsx'

export default function StaffProfile() {
  const { id } = useParams()
  const { getRecord, getBySlug, db, loading } = useData()
  const info = db.schoolInfo
  const staff = useMemo(() => getRecord('staff', id) || getBySlug('staff', id), [getRecord, getBySlug, id, db.staff])

  if (loading) return <DetailSkeleton />
  if (!staff || staff.isVisible === false || (staff.status !== undefined && staff.status !== 'published')) return <NotFound />

  const dept = (db.departments || []).find((d) => d.name === staff.department)
  const colleagues = (db.staff || [])
    .filter((s) => s.department === staff.department && s.id !== staff.id && s.isVisible !== false)
    .slice(0, 4)
  const email = staff.email || `${staff.slug || staff.name.split(' ')[0]}${info?.emailDomain || '@highgate.sch.uk'}`

  return (
    <>
      <SeoHead title={staff.name} description={`${staff.title} at ${info?.name || 'our school'}.`} ogImage={staff.photo} />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Staff', to: '/staff' }, { label: staff.name }]} />
          <Link to="/staff" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400 transition hover:gap-3">
            <ArrowLeft size={16} /> Back to Directory
          </Link>
        </div>
      </div>

      <div className="bg-cream py-8 sm:py-16">
        <div className="container-x">
          <div className="card overflow-hidden">
            <div className="grid lg:grid-cols-3">
              <div className="relative aspect-[4/5] lg:aspect-auto">
                <Img src={staff.photo} alt={staff.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent lg:bg-none" />
              </div>
              <div className="p-6 sm:p-10 lg:col-span-2 lg:p-14">
                <p className="eyebrow">{dept?.name || staff.department}</p>
                <h1 className="mt-3 font-serif text-3xl font-semibold text-navy-900 sm:text-4xl lg:text-5xl">{staff.name}</h1>
                <p className="mt-2 text-lg font-medium text-gold-600">{staff.title}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={`mailto:${email}`} className="btn-navy">
                    <Mail size={16} /> Email
                  </a>
                  {dept && (
                    <Link to={`/departments/${dept.slug}`} className="btn-outline">
                      {dept.name}
                    </Link>
                  )}
                </div>

                <div className="mt-10">
                  <h2 className="font-serif text-2xl font-semibold text-navy-900">About</h2>
                  <div className="mt-3 h-1 w-14 rounded-full bg-gold-500" />
                  <p className="mt-5 text-[1.05rem] leading-relaxed text-slate-700">{staff.bio || 'Biography coming soon.'}</p>
                </div>
              </div>
            </div>
          </div>

          {colleagues.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-3xl font-semibold text-navy-900">Colleagues in {dept?.name || staff.department}</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {colleagues.map((c) => (
                  <Link
                    key={c.id}
                    to={`/staff/${c.id}`}
                    className="card-hover flex items-center gap-4 p-5"
                  >
                    {c.photo ? (
                      <img src={c.photo} alt={c.name} className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      <Avatar name={c.name} className="h-14 w-14 text-lg" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-serif text-lg font-semibold text-navy-900">{c.name}</p>
                      <p className="truncate text-xs text-slate-500">{c.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
