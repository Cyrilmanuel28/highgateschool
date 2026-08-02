import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import Img from '../components/Img.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { Avatar } from '../components/Cards.jsx'
import NotFound from './NotFound.jsx'

export default function DepartmentDetail() {
  const { id } = useParams()
  const { getBySlug, publishedOnly, db } = useData()
  const info = db.schoolInfo
  const dept = useMemo(() => getBySlug('departments', id), [getBySlug, id])

  if (!dept || ((dept.status !== undefined && dept.status !== 'published') && dept.isVisible !== false)) return <NotFound />

  const head = (db.staff || []).find((s) => s.id === dept.headStaff)
  const team = publishedOnly('staff', 'order').filter((s) => s.department === dept.name)
  const otherDepts = publishedOnly('departments', 'order').filter((d) => d.id !== dept.id).slice(0, 3)

  return (
    <>
      <SeoHead title={dept.name} description={dept.description} ogImage={dept.featuredImage} />
      <div className="relative overflow-hidden bg-navy-950 pb-16 pt-36">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ label: 'Departments', to: '/departments' }, { label: dept.name }]} />
          <Link to="/departments" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400 transition hover:gap-3">
            <ArrowLeft size={16} /> All Departments
          </Link>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">{dept.name}</h1>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="container-x">
          <div className="overflow-hidden rounded-2xl shadow-cardHover">
            <Img src={dept.featuredImage} alt={dept.name} className="aspect-[21/8]" />
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-3xl font-semibold text-navy-900">{info?.departmentsAboutHeading || 'About the Department'}</h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
              <p className="mt-6 text-lg leading-relaxed text-slate-700">{dept.description}</p>
              <p className="mt-6 text-lg leading-relaxed text-slate-700">
                Our teachers are specialists and practitioners — writers, researchers, athletes, and artists — who bring the discipline to life. Classes are small, and every student is known by name.
              </p>

              {team.length > 0 && (
                <div className="mt-12">
                  <h3 className="font-serif text-2xl font-semibold text-navy-900">{info?.departmentsTeamHeading || 'Meet the Team'}</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {team.map((s) => (
                      <Link key={s.id} to={`/staff/${s.id}`} className="card-hover flex items-center gap-4 p-4">
                        {s.photo ? (
                          <img src={s.photo} alt={s.name} className="h-14 w-14 rounded-full object-cover" />
                        ) : (
                          <Avatar name={s.name} className="h-14 w-14 text-lg" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-serif text-lg font-semibold text-navy-900">{s.name}</p>
                          <p className="truncate text-xs text-slate-500">{s.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-5">
              {head && (
                <div className="card p-7 text-center">
                  <p className="eyebrow">Head of Department</p>
                  {head.photo ? (
                    <img src={head.photo} alt={head.name} className="mx-auto mt-4 h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <Avatar name={head.name} className="mx-auto mt-4 h-24 w-24 text-2xl" />
                  )}
                  <h3 className="mt-4 font-serif text-xl font-semibold text-navy-900">{head.name}</h3>
                  <p className="mt-1 text-sm text-gold-600">{head.title}</p>
                  <a
                    href={`mailto:${head.slug || head.name.split(' ')[0]}${info?.emailDomain || '@highgate.sch.uk'}`}
                    className="btn-outline mt-5 w-full"
                  >
                    <Mail size={15} /> Email
                  </a>
                </div>
              )}

              <div className="rounded-2xl bg-navy-900 p-7">
                <h3 className="font-serif text-lg font-semibold text-white">{info?.departmentsCtaTitle || 'Want to learn more?'}</h3>
                <p className="mt-2 text-sm text-navy-100">{info?.departmentsCtaText || 'Talk to the department or explore our programmes.'}</p>
                <Link to="/academics" className="btn-gold mt-5 w-full">
                  Explore Programmes
                </Link>
              </div>
            </aside>
          </div>

          {otherDepts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-2xl font-semibold text-navy-900">{info?.departmentsOtherHeading || 'Other Departments'}</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {otherDepts.map((d) => (
                  <Link
                    key={d.id}
                    to={`/departments/${d.slug}`}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 shadow-card transition hover:bg-gold-50"
                  >
                    {d.name}
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
