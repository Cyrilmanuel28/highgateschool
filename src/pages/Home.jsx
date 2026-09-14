import { useMemo } from 'react'
import { useData } from '../context/DataContext.jsx'
import SeoHead from '../components/SeoHead.jsx'
import renderBlock from '../components/Blocks.jsx'

const EXPLORE_SECTION = {
  id: 'hexplore', sectionKey: 'hexplore', order: 3, isVisible: true,
  content: { type: 'exploreOurSchool', title: 'More Than a School. A Place to Belong.', subtitle: 'At Highgate School, learning goes beyond textbooks. We create an environment where students are encouraged to discover their strengths, build meaningful relationships, develop confidence, and prepare for the future.', cards: [
    { id: 'exp1', title: 'Learning', description: 'Discover an engaging learning environment designed to help every student develop knowledge, curiosity, critical thinking, and confidence.', items: ['Academics', 'ICT & Technology', 'Science', 'Library'], to: '/academics', buttonLabel: 'Explore Learning', image: '' },
    { id: 'exp2', title: 'Growing', description: 'We nurture more than academic achievement. Students develop character, leadership, responsibility, confidence, and essential life skills.', items: ['Character Development', 'Leadership', 'Life Skills', 'Student Support'], to: '/student-development', buttonLabel: 'Discover Growth', image: '' },
    { id: 'exp3', title: 'Discovering', description: 'Students are encouraged to explore their interests, develop their talents, participate in activities, and discover new possibilities beyond the classroom.', items: ['Sports', 'Clubs', 'Arts & Creativity', 'Competitions'], to: '/clubs', buttonLabel: 'Explore Activities', image: '' },
    { id: 'exp4', title: 'Belonging', description: 'Experience the friendships, traditions, celebrations, events, and community connections that make Highgate School feel like home.', items: ['School Community', 'Events', 'School Gallery', 'Parent Engagement'], to: '/student-life', buttonLabel: 'Experience School Life', image: '' }
  ], cta1: { label: 'Explore Our School', to: '/about' }, cta2: { label: 'Discover Student Life', to: '/student-life' } }
}

export default function Home() {
  const { db } = useData()
  const sections = useMemo(() => {
    const raw = db.homeSections || []
    const filtered = raw.filter((s) => (s.status === undefined || s.status === 'published') && s.isVisible).sort((a, b) => a.order - b.order)
    if (filtered.length > 0 && !filtered.some(s => s.id === 'hexplore')) {
      const afterWelcome = filtered.findIndex(s => s.id === 'hwelcome')
      const insertAt = afterWelcome >= 0 ? afterWelcome + 1 : 2
      filtered.splice(insertAt, 0, EXPLORE_SECTION)
    }
    return filtered
  }, [db.homeSections])
  const schoolInfo = db.schoolInfo

  return (
    <>
      <SeoHead
        title={`${schoolInfo?.name} — ${schoolInfo?.tagline}`}
        description={schoolInfo?.seoDescription || `${schoolInfo?.name || 'Highgate School'} is an international private school for ages 3–18, offering Cambridge IGCSE and the IB Diploma in a warm, global community.`}
        ogImage={schoolInfo?.logo || '/favicon.svg'}
      />
      {sections.map((s, i) => renderBlock({ ...s.content, id: s.id }, i))}
    </>
  )
}
