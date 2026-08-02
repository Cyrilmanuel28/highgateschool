const img = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`
const IMG = {
  hero: img('photo-1523050854058-8df90110c9f1'),
  campus: img('photo-1541339907198-e08756dedf3f'),
  classroom: img('photo-1580582932707-520aed937b7b'),
  kidsClassroom: img('photo-1503676260728-1c00da094a0b'),
  studentsGroup: img('photo-1523240795612-9a054b0db644'),
  studentsLaptop: img('photo-1522202176988-66273c2fd55f'),
  library: img('photo-1564981797816-1043664bf78d'),
  books: img('photo-1497633762265-9d179a990aa6'),
  graduation: img('photo-1524995997946-a1c2e315a42f'),
  ceremony: img('photo-1530214576952-9a647ed9a0d2'),
  study: img('photo-1509062522246-3755977927d7'),
  desk: img('photo-1609220136736-443140cffec6'),
  lab: img('photo-1562774053-701939374585'),
  kidsHands: img('photo-1588072432836-e10032774350'),
  art: img('photo-1513364776144-60967b0f800f'),
  music: img('photo-1511379938547-c1f69419868d'),
  sportKids: img('photo-1546519638-68e109498ffc'),
  soccer: img('photo-1579952363873-27f3bade9f55'),
  running: img('photo-1461896836934-ffe607ba8211'),
  swim: img('photo-1530549387789-4c1017266635'),
  chess: img('photo-1529699211952-734e80c4d42b'),
  forest: img('photo-1441974231531-c6227db76b6e'),
  lake: img('photo-1506744038136-46273834b3fb'),
  mountains: img('photo-1464822759023-fed622ff2c3b'),
  sky: img('photo-1472214103451-9374bd1c798e'),
  team: img('photo-1529156069898-49953e39b3ac'),
  port1: img('photo-1573496359142-b8d87734a5a2', 800),
  port2: img('photo-1560250097-0b93528c311a', 800),
  port3: img('photo-1573497019940-1c28c88b4f3e', 800),
  port4: img('photo-1580489944761-15a19d654956', 800),
  port5: img('photo-1507003211169-0a1dd7228f2d', 800),
  port6: img('photo-1544005313-94ddf0286df2', 800),
  port7: img('photo-1472099645785-5658abf4ff4e', 800),
  port8: img('photo-1438761681033-6461ffad8d80', 800),
  port9: img('photo-1519085360753-af0119f7cbe7', 800)
}

export const seedSchoolInfo = {
  name: 'Highgate School',
  shortName: 'Highgate',
  tagline: 'Knowledge Without Borders',
  founded: 1998,
  address: '48 Kensington Heights, Meridian Park, London NW1 2AQ, United Kingdom',
  phone: '+44 (0)20 7946 0958',
  email: 'admissions@highgate.sch.uk',
  logo: '/favicon.svg',
  socialLinks: {
    facebook: 'https://facebook.com/highgateschool',
    instagram: 'https://instagram.com/highgateschool',
    twitter: 'https://x.com/highgateschool',
    linkedin: 'https://linkedin.com/company/highgateschool',
    youtube: 'https://youtube.com/@highgateschool'
  },
  footerText: 'An independent international school for ages 3–18, where academic excellence meets a warm, global community.'
}

export const seedSettings = {
  adminUser: 'zs716992@gmail.com',
  adminEmail: 'zs716992@gmail.com',
  siteStatus: 'live',
  maintenance: false,
  contactEmail: 'admissions@highgate.sch.uk',
  contactPhone: '+44 (0)20 7946 0958',
  defaultOgImage: IMG.campus,
  analyticsId: '',
  createdAt: new Date().toISOString()
}

export const seedTheme = {
  primaryColor: '#1B2A4A',
  accentColor: '#C8982A',
  backgroundColor: '#F9F8F6',
  bodyFont: 'Inter',
  headingFont: 'Cormorant Garamond'
}

export function seedMenus() {
  return [
    { id: 'm1', label: 'Home', url: '/', parentId: null, order: 1, isVisible: true, target: '_self' },
    { id: 'm2', label: 'About', url: '/about', parentId: null, order: 2, isVisible: true, target: '_self' },
    { id: 'm21', label: 'About Us', url: '/about', parentId: 'm2', order: 1, isVisible: true, target: '_self' },
    { id: 'm22', label: 'Our History', url: '/history', parentId: 'm2', order: 2, isVisible: true, target: '_self' },
    { id: 'm23', label: 'Vision & Mission', url: '/vision-mission', parentId: 'm2', order: 3, isVisible: true, target: '_self' },
    { id: 'm24', label: 'Administration', url: '/administration', parentId: 'm2', order: 4, isVisible: true, target: '_self' },
    { id: 'm25', label: 'Board of Governors', url: '/board', parentId: 'm2', order: 5, isVisible: true, target: '_self' },
    { id: 'm26', label: 'Staff Directory', url: '/staff', parentId: 'm2', order: 6, isVisible: true, target: '_self' },
    { id: 'm27', label: 'Testimonials', url: '/testimonials', parentId: 'm2', order: 7, isVisible: true, target: '_self' },
    { id: 'm28', label: 'School Statistics', url: '/statistics', parentId: 'm2', order: 8, isVisible: true, target: '_self' },
    { id: 'm3', label: 'Academics', url: '/academics', parentId: null, order: 3, isVisible: true, target: '_self' },
    { id: 'm31', label: 'Academic Programmes', url: '/academics', parentId: 'm3', order: 1, isVisible: true, target: '_self' },
    { id: 'm32', label: 'Departments', url: '/departments', parentId: 'm3', order: 2, isVisible: true, target: '_self' },
    { id: 'm33', label: 'Admissions', url: '/admissions', parentId: 'm3', order: 3, isVisible: true, target: '_self' },
    { id: 'm34', label: 'School Fees', url: '/fees', parentId: 'm3', order: 4, isVisible: true, target: '_self' },
    { id: 'm35', label: 'Apply Online', url: '/apply', parentId: 'm3', order: 5, isVisible: true, target: '_self' },
    { id: 'm4', label: 'Life at Highgate', url: '/student-life', parentId: null, order: 4, isVisible: true, target: '_self' },
    { id: 'm41', label: 'Student Life', url: '/student-life', parentId: 'm4', order: 1, isVisible: true, target: '_self' },
    { id: 'm42', label: 'Clubs & Societies', url: '/clubs', parentId: 'm4', order: 2, isVisible: true, target: '_self' },
    { id: 'm43', label: 'Sports', url: '/sports', parentId: 'm4', order: 3, isVisible: true, target: '_self' },
    { id: 'm44', label: 'Gallery', url: '/gallery', parentId: 'm4', order: 4, isVisible: true, target: '_self' },
    { id: 'm45', label: 'Videos', url: '/videos', parentId: 'm4', order: 5, isVisible: true, target: '_self' },
    { id: 'm46', label: 'Achievements', url: '/achievements', parentId: 'm4', order: 6, isVisible: true, target: '_self' },
    { id: 'm47', label: 'Virtual Tour', url: '/virtual-tour', parentId: 'm4', order: 7, isVisible: true, target: '_self' },
    { id: 'm48', label: 'Campus Map', url: '/campus-map', parentId: 'm4', order: 8, isVisible: true, target: '_self' },
    { id: 'm5', label: 'News & Events', url: '/news', parentId: null, order: 5, isVisible: true, target: '_self' },
    { id: 'm51', label: 'News', url: '/news', parentId: 'm5', order: 1, isVisible: true, target: '_self' },
    { id: 'm52', label: 'Events', url: '/events', parentId: 'm5', order: 2, isVisible: true, target: '_self' },
    { id: 'm53', label: 'Academic Calendar', url: '/calendar', parentId: 'm5', order: 3, isVisible: true, target: '_self' },
    { id: 'm54', label: 'Notices', url: '/notices', parentId: 'm5', order: 4, isVisible: true, target: '_self' },
    { id: 'm55', label: 'Magazine', url: '/magazine', parentId: 'm5', order: 5, isVisible: true, target: '_self' },
    { id: 'm6', label: 'Resources', url: '/downloads', parentId: null, order: 6, isVisible: true, target: '_self' },
    { id: 'm61', label: 'Downloads', url: '/downloads', parentId: 'm6', order: 1, isVisible: true, target: '_self' },
    { id: 'm62', label: 'FAQ', url: '/faq', parentId: 'm6', order: 2, isVisible: true, target: '_self' },
    { id: 'm63', label: 'Library', url: '/library', parentId: 'm6', order: 3, isVisible: true, target: '_self' },
    { id: 'm64', label: 'Careers', url: '/careers', parentId: 'm6', order: 4, isVisible: true, target: '_self' },
    { id: 'm7', label: 'Contact', url: '/contact', parentId: null, order: 7, isVisible: true, target: '_self' },
    { id: 'm71', label: 'Parent Feedback', url: '/feedback', parentId: 'm7', order: 1, isVisible: true, target: '_self' },
    { id: 'm72', label: 'Emergency Info', url: '/emergency', parentId: 'm7', order: 2, isVisible: true, target: '_self' }
  ]
}

export function seedPages() {
  const now = new Date().toISOString()
  const mk = (slug, title, blocks, meta = {}) => ({
    id: `pg_${slug.replace(/-/g, '_')}`,
    slug,
    title,
    status: 'published',
    publishAt: null,
    metaTitle: meta.metaTitle || `${title} | Highgate School`,
    metaDescription: meta.metaDescription || '',
    ogImage: meta.ogImage || IMG.campus,
    contentBlocks: blocks,
    versionHistory: [],
    updatedAt: now
  })

  return [
    mk(
      'about',
      'About Us',
      [
        { id: 'b1', type: 'hero', kicker: 'Welcome to Highgate', title: 'A School That Feels Like Home, With Standards That Reach the World', subtitle: 'For more than two decades we have nurtured curious minds from over forty nations, blending academic rigour with genuine care.', image: IMG.campus, cta1: { label: 'Explore Admissions', to: '/admissions' }, cta2: { label: 'Visit Us', to: '/contact' } },
        { id: 'b2', type: 'stats', items: [
          { value: '1998', label: 'Year Founded' },
          { value: '40+', label: 'Nationalities' },
          { value: '1:8', label: 'Student–Teacher Ratio' },
          { value: '96%', label: 'IB Pass Rate 2025' }
        ] },
        { id: 'b3', type: 'richText', html: '<p><strong>Highgate School</strong> is an independent, co-educational day school for students aged 3 to 18. We offer the International Baccalaureate (IB) and Cambridge IGCSE programmes alongside a rich national curriculum, taught by an outstanding faculty drawn from six continents.</p><p>Our campus in Meridian Park blends modern learning spaces with acres of green playing fields, a performing arts centre, and a state-of-the-art STEAM wing. But what families remember most is the warmth — a school where every child is known by name and every achievement is celebrated.</p>' },
        { id: 'b4', type: 'imageText', title: 'A Campus Built for Curiosity', text: 'From the Discovery Garden for our youngest learners to the university-grade laboratories and design studios of the Upper School, every space is designed to spark inquiry, collaboration, and joy in learning.', image: IMG.lab, reversed: false },
        { id: 'b5', type: 'quote', quote: 'Highgate is where international-mindedness stops being a slogan and becomes the daily experience of every child — in the classroom, on the pitch, and across our forty nationalities.', author: 'Dr. Helena Moreau', role: 'Head of School' },
        { id: 'b6', type: 'features', title: 'Why Families Choose Highgate', subtitle: 'The pillars that shape our community', items: [
          { icon: 'graduation', title: 'Academic Excellence', text: 'Consistently strong IB and IGCSE results, with personalised pathways from Early Years to Diploma.' },
          { icon: 'globe', title: 'True Internationalism', text: 'An IB World School where over forty nationalities learn together in genuine mutual respect.' },
          { icon: 'heart', title: 'Pastoral Care', text: 'A house system, dedicated counsellors, and a family-like culture that supports every child.' },
          { icon: 'spark', title: 'Creativity & Character', text: 'Forty clubs, competitive sport, performing arts, and service learning build confident leaders.' }
        ] },
        { id: 'b7', type: 'cta', title: 'Come and See Us for Yourself', text: 'Book a private tour of campus, meet our teachers, and discover whether Highgate is the right home for your family.', cta1: { label: 'Book a Tour', to: '/contact' }, cta2: { label: 'Download Prospectus', to: '/downloads' } }
      ],
      { metaDescription: 'Highgate School is an independent international school in London for ages 3–18, offering IB and IGCSE within a warm, global community.' }
    ),
    mk(
      'history',
      'Our History',
      [
        { id: 'b1', type: 'hero', kicker: 'Our Story', title: 'Two Decades of Opening Minds', subtitle: 'From a single classroom to an international campus — the story of Highgate, told in moments that matter.', image: IMG.studentsGroup },
        { id: 'b2', type: 'timeline', title: 'Milestones', items: [
          { year: '1998', title: 'A Modest Beginning', text: 'Highgate opens its doors in a Victorian townhouse with 38 students and a bold idea: world-class international education built on care.' },
          { year: '2005', title: 'The Primary Campus', text: 'Our purpose-built Junior School opens, growing the community past 300 students across 20 nationalities.' },
          { year: '2012', title: 'IB World School', text: 'Highgate is authorised as an IB World School and introduces the IB Diploma alongside Cambridge IGCSE.' },
          { year: '2018', title: 'STEAM & Innovation Centre', text: 'The Discovery Centre opens with laboratories, design studios, and a 300-seat theatre, anchoring our innovation programme.' },
          { year: '2021', title: 'New Sports Complex', text: 'A six-lane pool, multi-sport hall, and all-weather pitches double our sporting capacity.' },
          { year: '2025', title: 'Forty Nations, One School', text: 'The community reaches 1,150 students from 42 countries, and 96% of Diploma graduates enter their first-choice university.' }
        ] },
        { id: 'b3', type: 'cta', title: 'History in the Making', text: 'Our archive of milestone moments grows every term — explore the newsroom to see the latest chapter.', cta1: { label: 'Read Our News', to: '/news' } }
      ],
      { metaDescription: 'From its founding in 1998 to a thriving international campus, discover the milestones that shaped Highgate School.' }
    ),
    mk(
      'vision-mission',
      'Vision & Mission',
      [
        { id: 'b1', type: 'hero', kicker: 'Purpose & Values', title: 'Our Vision, Mission, and the Values We Live By', subtitle: 'What we believe about learning, community, and the future our students will shape.', image: IMG.kidsClassroom },
        { id: 'b2', type: 'values', title: 'Our Values', subtitle: 'Four commitments that guide every decision we make', items: [
          { title: 'Excellence', text: 'We pursue rigorous, joyful learning and hold every member of our community to high standards — because we believe every child is capable of more than they know.' },
          { title: 'Curiosity', text: 'We ask questions before we give answers. Inquiry is the engine of the Highgate classroom at every age.' },
          { title: 'Respect', text: 'With forty-two nationalities in one community, respect is not optional. We listen, we include, and we learn from each other.' },
          { title: 'Courage', text: 'We take intellectual and ethical risks. Our students learn to lead with conviction and to stand up for what is right.' }
        ] },
        { id: 'b3', type: 'richText', html: '<h3>Our Vision</h3><p>To be a school where every child discovers their brilliance — an international community of learners who shape a more peaceful, more curious, more generous world.</p><h3>Our Mission</h3><p>We deliver a rigorous international education that balances academic ambition with wellbeing, creativity, and character. We nurture students who think critically, act ethically, and belong confidently to a world beyond any single culture.</p>' },
        { id: 'b4', type: 'quote', quote: 'We measure success not only in exam results but in the kindness of our corridors, the courage of our questions, and the character of our graduates.', author: 'Dr. Helena Moreau', role: 'Head of School' }
      ],
      { metaDescription: 'The vision, mission and values of Highgate School — excellence, curiosity, respect and courage in an international learning community.' }
    ),
    mk(
      'administration',
      'Administration',
      [
        { id: 'b1', type: 'hero', kicker: 'Leadership', title: 'The Team That Leads Our School', subtitle: 'Our administrative leaders work every day to keep the school running smoothly, safely, and with ambition.', image: IMG.team },
        { id: 'b2', type: 'staffGrid', title: 'Senior Leadership', department: 'Administration' },
        { id: 'b3', type: 'features', title: 'Open Door, Open Lines', items: [
          { icon: 'phone', title: 'Front Office', text: 'Our reception team is available Monday to Friday, 7:30–17:30. Drop in, call, or email — we are always happy to help.' },
          { icon: 'mail', title: 'Parent Communications', text: 'Weekly bulletins, the Highgate app, and termly parent forums keep every family informed and involved.' },
          { icon: 'shield', title: 'Safeguarding', text: 'Every member of staff is trained in safeguarding. Our dedicated team leads on student wellbeing and safety.' }
        ] }
      ],
      { metaDescription: 'Meet the senior leadership and administration team of Highgate School.' }
    ),
    mk(
      'board',
      'Board of Governors',
      [
        { id: 'b1', type: 'hero', kicker: 'Governance', title: 'Board of Governors', subtitle: 'The Board provides strategic oversight and ensures Highgate remains true to its founding mission.', image: IMG.ceremony },
        { id: 'b2', type: 'cards', title: 'Members of the Board', items: [
          { title: 'Lady Arabella Whitmore', text: 'Chair of the Board · Former diplomat, champion of international education', to: '/about' },
          { title: 'Dr. Amara Okonkwo', text: 'Vice-Chair · Professor of Economics, LSE', to: '/about' },
          { title: 'Sir Richard Beaumont', text: 'Treasurer · Partner, Beaumont & Hale Chartered Accountants', to: '/about' },
          { title: 'Ms. Yuki Tanaka', text: 'Governor · Co-founder, Meridian Capital Group', to: '/about' },
          { title: 'Mr. David Osei', text: 'Governor · Executive Director, World Children Fund', to: '/about' },
          { title: 'Dr. Elena Petrova', text: 'Governor · Paediatrician and parent of two Highgate students', to: '/about' }
        ] },
        { id: 'b3', type: 'richText', html: '<p>The Board meets six times a year and is responsible for the school\'s strategic direction, financial stewardship, and the appointment of the Head of School. Day-to-day governance of academic life rests with the Head and the Senior Leadership Team.</p>' }
      ],
      { metaDescription: 'Meet the Board of Governors of Highgate School.' }
    ),
    mk(
      'student-life',
      'Student Life',
      [
        { id: 'b1', type: 'hero', kicker: 'Beyond the Classroom', title: 'Life at Highgate Is a Life Well Lived', subtitle: 'Houses, clubs, music, sport, service — a school day that ends at 3:30 but a school life that stays with you.', image: IMG.studentsLaptop },
        { id: 'b2', type: 'stats', items: [
          { value: '40+', label: 'Clubs & Societies' },
          { value: '25', label: 'Sports Teams' },
          { value: '4', label: 'Houses' },
          { value: '120+', label: 'Events Per Year' }
        ] },
        { id: 'b3', type: 'imageText', title: 'The House System', text: 'Every student belongs to one of four houses — Amber, Meridian, Phoenix, and Solent. Houses compete in sports, arts, and academics, and above all they become family: older students mentor younger ones for the entire journey through Highgate.', image: IMG.team, reversed: false },
        { id: 'b4', type: 'imageText', title: 'Music & Performing Arts', text: 'From the award-winning Chamber Orchestra to musical theatre productions in the 300-seat Highgate Theatre, the arts are woven into school life — nearly half of our students learn an instrument.', image: IMG.music, reversed: true },
        { id: 'b5', type: 'features', title: 'Every Day Counts', items: [
          { icon: 'music', title: 'Arts', text: 'Orchestras, choirs, theatre, dance and studio art — with termly showcases and an annual Arts Festival.' },
          { icon: 'trophy', title: 'Sport', text: 'Football, rugby, netball, swimming, athletics and more, from recreational to county-representative level.' },
          { icon: 'globe', title: 'Service Learning', text: 'Every student completes service hours, from local volunteering to international service trips.' },
          { icon: 'users', title: 'Leadership', text: 'Student council, house captains, eco-committee and the Model United Nations team.' }
        ] },
        { id: 'b6', type: 'cta', title: 'See Life at Highgate', text: 'Browse the gallery and videos to see our campus and community in action.', cta1: { label: 'Visit the Gallery', to: '/gallery' }, cta2: { label: 'Watch Videos', to: '/videos' } }
      ],
      { metaDescription: 'Student life at Highgate School — houses, clubs, music, sport, and a community that feels like family.' }
    ),
    mk(
      'admissions',
      'Admissions',
      [
        { id: 'b1', type: 'hero', kicker: 'Join Our Community', title: 'Admissions: A Warm Welcome, A Clear Path', subtitle: 'We welcome applications year-round for students aged 3–18 from every corner of the world.', image: IMG.study, cta1: { label: 'Enquire Now', to: '/contact' }, cta2: { label: 'See Fees', to: '/fees' } },
        { id: 'b2', type: 'timeline', title: 'The Admissions Journey', items: [
          { year: 'Step 1', title: 'Enquire & Visit', text: 'Submit an enquiry or call the admissions office. We invite every family to tour the campus and meet our team.' },
          { year: 'Step 2', title: 'Submit the Application', text: 'Complete the online application with student details, previous school reports, and a family statement.' },
          { year: 'Step 3', title: 'Assessment & Interview', text: 'Age-appropriate assessments in English and Mathematics, plus a friendly conversation with our admissions team.' },
          { year: 'Step 4', title: 'Offer & Enrolment', text: 'Successful applicants receive an offer within two weeks. Enrolment is confirmed with the deposit and required documents.' }
        ] },
        { id: 'b3', type: 'features', title: 'Entry Points & Requirements', items: [
          { icon: 'baby', title: 'Early Years (3–5)', text: 'Play-based learning in our Discovery Garden. No assessment required — a warm welcome visit is all we need.' },
          { icon: 'book', title: 'Primary (6–11)', text: 'Entry at Year 1 or above. Informal assessment of readiness in English and numeracy.' },
          { icon: 'compass', title: 'Secondary (12–16)', text: 'Cambridge IGCSE pathway. Assessment in English, Maths and a science, plus references.' },
          { icon: 'graduation', title: 'IB Diploma (16–18)', text: 'Strong prior attainment and a personal statement required. Interview with the Head of Upper School.' }
        ] },
        { id: 'b4', type: 'richText', html: '<h3>Key Dates</h3><p>Applications for September entry open on <strong>1 October</strong> and close on <strong>31 January</strong>. Mid-year applications are welcome subject to places. Scholarships for academic merit, music, and sport are available at Years 7 and 12.</p><p>All families new to Highgate are warmly invited to attend one of our monthly <strong>Open Mornings</strong>.</p>' },
        { id: 'b5', type: 'cta', title: 'Begin Your Journey', text: 'Questions about admissions? Our team responds within one working day.', cta1: { label: 'Contact Admissions', to: '/contact' }, cta2: { label: 'Download Prospectus', to: '/downloads' } }
      ],
      { metaDescription: 'Admissions at Highgate School — a warm, clear process for students aged 3–18, with tours, assessments, and scholarships available year-round.' }
    ),
    mk(
      'academics',
      'Academics',
      [
        { id: 'b1', type: 'hero', kicker: 'Learning for Life', title: 'Academic Programmes for Every Stage', subtitle: 'A seamless international pathway from Early Years to the IB Diploma — rigorous, joyful, and personal.', image: IMG.library },
        { id: 'b2', type: 'programs', title: 'Our Programmes' },
        { id: 'b3', type: 'richText', html: '<h3>The Highgate Approach</h3><p>Learning at Highgate is inquiry-driven and concept-based. Classes are small, teachers know every student, and assessment focuses on growth as well as attainment. We combine the depth of Cambridge IGCSE with the breadth of the International Baccalaureate, and we support every student with learning enrichment, EAL, and university counselling from Year 10.</p>' },
        { id: 'b4', type: 'quote', quote: 'The moment I saw students teaching students in the STEAM lab, I knew this was a school of genuine learning — not just teaching.', author: 'Dr. Amara Okonkwo', role: 'Vice-Chair, Board of Governors' },
        { id: 'b5', type: 'cta', title: 'Find Your Programme', text: 'Talk to our admissions team about the right path for your child at every stage.', cta1: { label: 'Contact Us', to: '/contact' }, cta2: { label: 'Explore Departments', to: '/departments' } }
      ],
      { metaDescription: 'Academic programmes at Highgate School — Early Years, Primary, Middle School, Cambridge IGCSE and the IB Diploma.' }
    ),
    mk(
      'privacy-policy',
      'Privacy Policy',
      [
        { id: 'b1', type: 'hero', kicker: 'Legal', title: 'Privacy Policy', subtitle: 'How Highgate School collects, uses, and protects your personal information.', image: IMG.books },
        { id: 'b2', type: 'richText', html: '<h3>1. Who We Are</h3><p>Highgate School ("we", "our", "us") is an independent international school. This policy explains how we handle personal data collected through this website and during the admissions and enrolment process.</p><h3>2. Information We Collect</h3><p>We collect information you provide directly — such as your name, contact details, and enquiry messages — as well as limited technical data such as browser type and pages visited.</p><h3>3. How We Use Information</h3><p>We use your information to respond to enquiries, process admissions and enrolment, communicate with families, and improve our website and services. We never sell personal data.</p><h3>4. Data Retention</h3><p>Enquiry data is retained for up to 24 months. Enrolment records are retained in accordance with applicable education regulations.</p><h3>5. Your Rights</h3><p>You may request access to, correction of, or deletion of your personal data at any time by contacting privacy@highgate.sch.uk.</p><h3>6. Cookies</h3><p>This website uses essential cookies for functionality. Analytics cookies are used only where you have consented.</p><h3>7. Contact</h3><p>Questions about this policy may be sent to privacy@highgate.sch.uk or by post to the school office.</p>' }
      ],
      { metaDescription: 'Privacy policy for the Highgate School website.' }
    ),
    mk(
      'terms',
      'Terms of Use',
      [
        { id: 'b1', type: 'hero', kicker: 'Legal', title: 'Terms of Use', subtitle: 'The terms that govern your use of the Highgate School website.', image: IMG.library },
        { id: 'b2', type: 'richText', html: '<h3>1. Acceptance of Terms</h3><p>By accessing this website, you agree to these Terms of Use. If you do not agree, please do not use the site.</p><h3>2. Use of Content</h3><p>All content on this site, including text, images, and branding, is the property of Highgate School unless otherwise stated. Content may not be reproduced without written permission.</p><h3>3. Accuracy of Information</h3><p>We aim to keep information accurate and up to date. Fees, dates, and programme details are subject to change; always confirm with the school office.</p><h3>4. External Links</h3><p>This site may link to external websites. We are not responsible for the content or practices of third-party sites.</p><h3>5. Liability</h3><p>To the extent permitted by law, Highgate School is not liable for any loss arising from use of this website.</p><h3>6. Governing Law</h3><p>These terms are governed by the laws of England and Wales.</p><h3>7. Contact</h3><p>Questions about these terms may be sent to legal@highgate.sch.uk.</p>' }
      ],
      { metaDescription: 'Terms of use for the Highgate School website.' }
    )
  ]
}

export function seedDepartments() {
  return [
    { id: 'dep1', name: 'Languages & Literature', description: 'English, French, Spanish, German, Mandarin and Arabic — with an award-winning multilingual library and mother-tongue support.', headStaff: 'stf4', order: 1, slug: 'languages-literature', featuredImage: IMG.library },
    { id: 'dep2', name: 'Mathematics', description: 'From number sense in the Early Years to Further Mathematics for the IB, our mathematicians compete at regional and national level.', headStaff: 'stf5', order: 2, slug: 'mathematics', featuredImage: IMG.desk },
    { id: 'dep3', name: 'Sciences', description: 'Physics, Chemistry and Biology in university-grade laboratories, with a celebrated STEAM and research programme.', headStaff: 'stf6', order: 3, slug: 'sciences', featuredImage: IMG.lab },
    { id: 'dep4', name: 'Humanities & Social Sciences', description: 'History, Geography, Economics, Global Perspectives and Psychology — where students learn to interrogate the world.', headStaff: 'stf7', order: 4, slug: 'humanities', featuredImage: IMG.studentsGroup },
    { id: 'dep5', name: 'Performing & Creative Arts', description: 'Music, Drama, Visual Arts and Design taught by practising artists, with termly showcases in the Highgate Theatre.', headStaff: 'stf8', order: 5, slug: 'creative-arts', featuredImage: IMG.music },
    { id: 'dep6', name: 'Physical Education & Sport', description: 'Swimming, athletics, team sports and outdoor education delivered by professional coaches and qualified PE staff.', headStaff: 'stf9', order: 6, slug: 'pe-sport', featuredImage: IMG.soccer }
  ]
}

export function seedStaff() {
  return [
    { id: 'stf1', name: 'Dr. Helena Moreau', title: 'Head of School', department: 'Administration', bio: 'Dr. Moreau joined Highgate in 2019 after two decades in international education across Europe and the Middle East. A linguist and former IB examiner, she is a passionate advocate for multilingual learning and student wellbeing.', photo: IMG.port1, order: 1, isVisible: true, slug: 'helena-moreau' },
    { id: 'stf2', name: 'Mr. Thomas Eze', title: 'Deputy Head, Academics', department: 'Administration', bio: 'Thomas oversees curriculum and assessment across the school. Previously Head of Science in a leading IB school in Lagos, he leads our STEAM strategy and teacher professional development.', photo: IMG.port2, order: 2, isVisible: true, slug: 'thomas-eze' },
    { id: 'stf3', name: 'Ms. Priya Raman', title: 'Head of Pastoral Care & Wellbeing', department: 'Administration', bio: 'Priya leads our house system, counselling team and safeguarding practice. She holds an MA in Educational Psychology and has worked in British and IB schools for 15 years.', photo: IMG.port3, order: 3, isVisible: true, slug: 'priya-raman' },
    { id: 'stf4', name: 'Dr. Isabelle Fontaine', title: 'Head of Languages & Literature', department: 'Languages & Literature', bio: 'A native French speaker with a PhD in Comparative Literature, Isabelle leads a team teaching six languages and our mother-tongue programme.', photo: IMG.port4, order: 1, isVisible: true, slug: 'isabelle-fontaine' },
    { id: 'stf5', name: 'Mr. Rajesh Mehta', title: 'Head of Mathematics', department: 'Mathematics', bio: 'A Cambridge-trained mathematician and IB examiner, Rajesh has coached national finalists in the UKMT competitions for over a decade.', photo: IMG.port5, order: 1, isVisible: true, slug: 'rajesh-mehta' },
    { id: 'stf6', name: 'Dr. Sofia Lindqvist', title: 'Head of Sciences', department: 'Sciences', bio: 'Former research biochemist from Stockholm, Sofia brings real-world science into the classroom and leads our student research symposia.', photo: IMG.port6, order: 1, isVisible: true, slug: 'sofia-lindqvist' },
    { id: 'stf7', name: 'Mr. Omar Haddad', title: 'Head of Humanities', department: 'Humanities & Social Sciences', bio: 'Omar is a historian specialising in global trade routes, and leads Model United Nations, Global Perspectives and our biennial history expeditions.', photo: IMG.port7, order: 1, isVisible: true, slug: 'omar-haddad' },
    { id: 'stf8', name: 'Ms. Clara Mendes', title: 'Head of Performing & Creative Arts', department: 'Performing & Creative Arts', bio: 'A concert pianist and theatre director, Clara has staged more than thirty productions and conducts the Highgate Chamber Orchestra.', photo: IMG.port8, order: 1, isVisible: true, slug: 'clara-mendes' },
    { id: 'stf9', name: 'Coach David Adeyemi', title: 'Director of Sport', department: 'Physical Education & Sport', bio: 'Former national-level sprinter and UEFA-licensed coach, David leads a sports programme of 25 teams across twelve disciplines.', photo: IMG.port9, order: 1, isVisible: true, slug: 'david-adeyemi' },
    { id: 'stf10', name: 'Mrs. Katherine Wills', title: 'Head of Admissions', department: 'Administration', bio: 'Katherine has guided more than a thousand families through the admissions journey and leads our Open Morning programme.', photo: IMG.port1, order: 4, isVisible: true, slug: 'katherine-wills' }
  ]
}

export function seedPrograms() {
  return [
    { id: 'prg1', name: 'Early Years', level: 'Ages 3–5', description: 'A play-based, inquiry-driven start in our Discovery Garden and Reggio-inspired classrooms, with early literacy, numeracy, and Mandarin enrichment.', curriculum: 'Highgate Early Years Framework + IPC', order: 1, status: 'published' },
    { id: 'prg2', name: 'Primary Years', level: 'Ages 6–11', description: 'A broad, joyful curriculum taught in small classes with specialist teachers for music, languages, sport, and design from Year 1.', curriculum: 'International Primary Curriculum (IPC) + National Standards', order: 2, status: 'published' },
    { id: 'prg3', name: 'Middle School', level: 'Ages 11–14', description: 'A transition built on inquiry and independence, with a semester of every discipline before students shape their own pathway.', curriculum: 'Highgate Middle Years Programme', order: 3, status: 'published' },
    { id: 'prg4', name: 'Cambridge IGCSE', level: 'Ages 14–16', description: 'A demanding two-year programme with 18 subjects on offer, taught by subject specialists with outstanding exam preparation.', curriculum: 'Cambridge IGCSE', order: 4, status: 'published' },
    { id: 'prg5', name: 'IB Diploma Programme', level: 'Ages 16–18', description: 'The gold standard of international education — six subjects, the Extended Essay, Theory of Knowledge, and Creativity, Activity, Service.', curriculum: 'International Baccalaureate (IBDP)', order: 5, status: 'published' },
    { id: 'prg6', name: 'University Counselling', level: 'Ages 16–18', description: 'A dedicated team supports every Diploma student with applications to universities across 20+ countries, including Oxbridge, Ivy League and Russell Group.', curriculum: 'Highgate Futures Programme', order: 6, status: 'published' }
  ]
}

export function seedNews() {
  const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString()
  return [
    { id: 'nw1', title: 'Highgate Students Shine at the International Model United Nations', slug: 'highgate-shines-at-imun', body: `<p>Ten Highgate students represented the school at the annual International Model United Nations conference in Geneva, coming away with the <strong>Outstanding Delegation Award</strong>.</p><p>The team — drawn from Years 10 to 13 — debated global climate finance, AI governance, and refugee protection across four days of committee sessions. Year 12 student Amara Osei was named Best Delegate for her leadership of the Security Council committee.</p><p>"Our students were among the youngest in the room and among the most prepared," said Mr. Omar Haddad, who coaches the team. "They argued with evidence, listened with respect, and led with confidence — everything we teach them in the classroom."</p><p>The school will host the regional Model UN for the second time next spring.</p>`, featuredImage: IMG.studentsGroup, author: 'Communications Office', publishedAt: daysAgo(2), status: 'published', tags: ['Achievement', 'Leadership', 'Global'] },
    { id: 'nw2', title: 'Highgate Earns Full IB Accreditation Renewal with Highest Praise', slug: 'ib-accreditation-renewal', body: `<p>Highgate School has received full renewal of its IB World School accreditation following a five-day evaluation visit, with evaluators praising the school's "exemplary pastoral care and genuine international-mindedness".</p><p>The evaluation team observed 96 lessons across every year group and interviewed students, parents, and staff. Their report highlighted the strength of the Extended Essay programme and the "remarkable confidence" of our youngest learners.</p><p>Head of School Dr. Helena Moreau said: "This endorsement belongs to our entire community — teachers, students, and families who believe in what we are building together."</p>`, featuredImage: IMG.graduation, author: 'Communications Office', publishedAt: daysAgo(6), status: 'published', tags: ['Accreditation', 'IB', 'Academic'] },
    { id: 'nw3', title: 'Chamber Orchestra Wins Gold at National Youth Music Festival', slug: 'orchestra-gold-festival', body: `<p>Our Chamber Orchestra took home the Gold Award in the senior strings category at the National Youth Music Festival in Manchester, performing Dvořák's Serenade for Strings.</p><p>The 28-member ensemble, conducted by Head of Arts Ms. Clara Mendes, was the only international school in the final round. Violinist Yuki Chen (Year 11) also received the Festival's Outstanding Soloist Award.</p><p>The orchestra will perform a celebratory concert in the Highgate Theatre on the last Friday of term — all families welcome.</p>`, featuredImage: IMG.music, author: 'Arts Department', publishedAt: daysAgo(10), status: 'published', tags: ['Arts', 'Music', 'Achievement'] },
    { id: 'nw4', title: 'New Scholarship Programme Opens for September 2026', slug: 'scholarship-programme-2026', body: `<p>Highgate is delighted to launch its expanded scholarship programme for September 2026, offering up to <strong>twenty full and partial scholarships</strong> for entry at Years 7 and 12.</p><p>Scholarships are available in three strands: <strong>Academic</strong>, <strong>Music</strong>, and <strong>Sport</strong>. Assessments take place in November 2025 for Year 12 entry and February 2026 for Year 7 entry.</p><p>"We believe exceptional talent should never be limited by circumstance," said Mrs. Katherine Wills, Head of Admissions. "Our scholarship community is one of the most vibrant parts of the school."</p><p>Families can register interest through the admissions office or by visiting the <a href="/admissions">Admissions page</a>.</p>`, featuredImage: IMG.ceremony, author: 'Admissions Office', publishedAt: daysAgo(14), status: 'published', tags: ['Admissions', 'Scholarships'] },
    { id: 'nw5', title: 'STEAM Week 2026: Students Build, Code, and Compete', slug: 'steam-week-2026', body: `<p>STEAM Week returned for its eighth year with a festival of making, coding, and friendly competition — and a record 900 participants across the school.</p><p>Highlights included the Year 6 robotics tournament, a Year 9 rocket launch (with one booster found in the sports fields the following morning), and the Upper School hackathon where a team of three Year 12 students built a waste-sorting AI in under 24 hours.</p><p>The week closed with the annual Family Science Fair, where parents joined their children in the labs.</p>`, featuredImage: IMG.lab, author: 'STEAM Faculty', publishedAt: daysAgo(21), status: 'published', tags: ['STEAM', 'Events'] },
    { id: 'nw6', title: 'Sports Round-Up: A Trophy-Filled Term for Highgate Athletics', slug: 'sports-roundup-spring', body: `<p>It has been a golden spring for Highgate sport. The U15 football team won the London International Schools Cup, our swimmers took 14 medals at the regional championships, and the athletics squad qualified for nationals in nine disciplines.</p><p>Year 10 sprinter Aisha Bello broke the school 200m record — a mark that had stood for eleven years — and now ranks in the top ten nationally in her age group.</p><p>"We measure success in participation as much as podiums," said Director of Sport Coach David Adeyemi. "With 85% of students in competitive or recreational sport, the whole school is winning."</p>`, featuredImage: IMG.soccer, author: 'Sports Department', publishedAt: daysAgo(26), status: 'published', tags: ['Sport', 'Achievement'] },
    { id: 'nw7', title: 'World Languages Week: 40 Languages, One School', slug: 'world-languages-week', body: `<p>Students took the stage in forty languages last week for our annual World Languages Week — a celebration of the forty-two nationalities that make up our community.</p><p>Morning assemblies featured poetry in Mandarin, Spanish, Arabic, and Yoruba. The week's highlight was the Languages Market, where students taught each other phrases, songs, and recipes from their home cultures, raising £2,400 for a partner school in Nairobi.</p><p>"Language is how we welcome people into our world," said Head of Languages Dr. Isabelle Fontaine. "This week, our students were the hosts."</p>`, featuredImage: IMG.kidsClassroom, author: 'Languages Department', publishedAt: daysAgo(35), status: 'published', tags: ['Languages', 'Community'] },
    { id: 'nw8', title: 'Highgate Alumna Wins Prestigious Architecture Prize', slug: 'alumna-architecture-prize', body: `<p>Class of 2019 alumna Zainab Al-Rashid has been awarded the Young Architect of the Year prize for her community housing project in Doha — one of architecture's most prestigious emerging-talent awards.</p><p>Zainab credits her Highgate education: "The Extended Essay taught me to question everything, and the art studio taught me to draw the answers. Highgate gave me both halves of my career."</p><p>She returns to campus this summer to open the school's first alumni architecture studio, mentoring current students on sustainable design.</p>`, featuredImage: IMG.campus, author: 'Alumni Office', publishedAt: daysAgo(42), status: 'published', tags: ['Alumni', 'Achievement'] }
  ]
}

export function seedEvents() {
  const future = (days) => new Date(Date.now() + days * 86400000).toISOString()
  return [
    { id: 'ev1', title: 'Open Morning — Autumn Term', slug: 'open-morning-autumn', description: 'A guided tour of campus with the Head of School, classroom visits, and a Q&A with our admissions team. Refreshments in the new atrium from 9:30.', startDate: future(10), endDate: future(10), location: 'Main Campus, Meridian Park', featuredImage: IMG.campus, status: 'published' },
    { id: 'ev2', title: 'Year 2 STEAM Family Workshop', slug: 'year2-steam-workshop', description: 'Parents and children build and program together in the Discovery Centre. Each family takes home their robot. Materials provided — no experience needed.', startDate: future(17), endDate: future(17), location: 'Discovery Centre', featuredImage: IMG.lab, status: 'published' },
    { id: 'ev3', title: 'Highgate Arts Festival', slug: 'arts-festival-spring', description: 'Three days of theatre, dance, and music: the Upper School musical, the Chamber Orchestra in concert, and the Visual Arts exhibition opening.', startDate: future(30), endDate: future(32), location: 'Highgate Theatre & Art Galleries', featuredImage: IMG.music, status: 'published' },
    { id: 'ev4', title: 'IB Diploma Information Evening', slug: 'ib-information-evening', description: 'For families of students in Years 9–11: subject choices, the Extended Essay, and university pathways. Presentation followed by subject fair.', startDate: future(38), endDate: future(38), location: 'Main Hall', featuredImage: IMG.graduation, status: 'published' },
    { id: 'ev5', title: 'Inter-House Swimming Gala', slug: 'inter-house-swimming-gala', description: 'Amber, Meridian, Phoenix and Solent battle for the Gala Cup. Spectators welcome — house colours encouraged, inflatables not.', startDate: future(45), endDate: future(45), location: 'Aquatics Centre', featuredImage: IMG.swim, status: 'published' },
    { id: 'ev6', title: 'International Food & Culture Fair', slug: 'international-food-fair', description: 'The culinary highlight of the year: forty-two nations, forty-two tables of food, music and craft. All proceeds to the Meridian Scholarship Fund.', startDate: future(55), endDate: future(55), location: 'North Lawn', featuredImage: IMG.kidsHands, status: 'published' },
    { id: 'ev7', title: 'Scholarship Assessments', slug: 'scholarship-assessments-2026', description: 'Academic, music and sport assessments for Year 7 and Year 12 scholarship entry in September. Candidates should arrive by 8:45 for registration.', startDate: future(62), endDate: future(63), location: 'Main Campus', featuredImage: IMG.study, status: 'published' }
  ]
}

export function seedAlbums() {
  return [
    { id: 'alb1', title: 'STEAM Week 2026', slug: 'steam-week-2026', description: 'Robots, rockets, and a 24-hour hackathon — highlights from the most ambitious STEAM Week yet.', coverImage: IMG.lab, photos: [IMG.lab, IMG.desk, IMG.studentsLaptop, IMG.kidsHands, IMG.classroom, IMG.campus], status: 'published' },
    { id: 'alb2', title: 'Arts Festival Gala', slug: 'arts-festival-gala', description: 'The Chamber Orchestra, the musical, and the exhibition opening — three nights to remember.', coverImage: IMG.music, photos: [IMG.music, IMG.art, IMG.ceremony, IMG.studentsGroup, IMG.team], status: 'published' },
    { id: 'alb3', title: 'Sports Day 2026', slug: 'sports-day-2026', description: 'House colours, record times, and the closest finish in Highgate history.', coverImage: IMG.running, photos: [IMG.running, IMG.soccer, IMG.sportKids, IMG.swim, IMG.mountains], status: 'published' },
    { id: 'alb4', title: 'Campus & Nature Walk', slug: 'campus-nature-walk', description: 'The green spaces of Highgate in every season — from the Discovery Garden to the North Lawn.', coverImage: IMG.forest, photos: [IMG.forest, IMG.lake, IMG.mountains, IMG.sky, IMG.campus, IMG.library], status: 'published' }
  ]
}

export function seedVideos() {
  return [
    { id: 'vid1', title: 'Welcome to Highgate — The Film', embedUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ', description: 'Three minutes on our campus, community, and the daily life of our students.', thumbnail: IMG.campus, publishedAt: new Date(Date.now() - 30 * 86400000).toISOString(), status: 'published' },
    { id: 'vid2', title: 'A Day in the Early Years', embedUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ', description: 'Follow our youngest learners through the Discovery Garden and into the classroom.', thumbnail: IMG.kidsClassroom, publishedAt: new Date(Date.now() - 20 * 86400000).toISOString(), status: 'published' },
    { id: 'vid3', title: 'Chamber Orchestra — Serenade for Strings', embedUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ', description: 'Gold Award performance from the National Youth Music Festival.', thumbnail: IMG.music, publishedAt: new Date(Date.now() - 12 * 86400000).toISOString(), status: 'published' },
    { id: 'vid4', title: 'STEAM Week Highlights', embedUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ', description: 'Robots, rockets and the 24-hour hackathon.', thumbnail: IMG.lab, publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'published' }
  ]
}

export function seedDownloads() {
  return [
    { id: 'dl1', title: 'School Prospectus 2026/27', fileUrl: '/downloads/prospectus-2026.pdf', category: 'Prospectus', description: 'Everything families need to know: curriculum, campus, community, and the Highgate approach.', publishedAt: new Date(Date.now() - 40 * 86400000).toISOString() },
    { id: 'dl2', title: 'Fee Structure Brochure', fileUrl: '/downloads/fee-brochure.pdf', category: 'Fees & Finance', description: 'Termly fees by year group, payment plans, and scholarship information.', publishedAt: new Date(Date.now() - 40 * 86400000).toISOString() },
    { id: 'dl3', title: 'Academic Calendar 2026/27', fileUrl: '/downloads/prospectus-2026.pdf', category: 'Calendar & Term Dates', description: 'Term dates, half-terms, and key assessment windows for the full academic year.', publishedAt: new Date(Date.now() - 33 * 86400000).toISOString() },
    { id: 'dl4', title: 'Admissions Application Checklist', fileUrl: '/downloads/fee-brochure.pdf', category: 'Admissions', description: 'The documents and steps needed to complete an application, year by year.', publishedAt: new Date(Date.now() - 33 * 86400000).toISOString() },
    { id: 'dl5', title: 'Uniform & Dress Code Guide', fileUrl: '/downloads/prospectus-2026.pdf', category: 'Student Resources', description: 'The full uniform list for every year group, with suppliers and sizing guidance.', publishedAt: new Date(Date.now() - 25 * 86400000).toISOString() },
    { id: 'dl6', title: 'Parent Handbook', fileUrl: '/downloads/fee-brochure.pdf', category: 'Student Resources', description: 'Daily routines, school policies, and everything families need for the year ahead.', publishedAt: new Date(Date.now() - 18 * 86400000).toISOString() },
    { id: 'dl7', title: 'Safeguarding Policy Summary', fileUrl: '/downloads/prospectus-2026.pdf', category: 'Policies', description: 'Our commitment to keeping every student safe, and how concerns are handled.', publishedAt: new Date(Date.now() - 12 * 86400000).toISOString() },
    { id: 'dl8', title: 'Term Dates 2026/27 (One-Page)', fileUrl: '/downloads/fee-brochure.pdf', category: 'Calendar & Term Dates', description: 'A printable one-page list of term and holiday dates.', publishedAt: new Date(Date.now() - 9 * 86400000).toISOString() }
  ]
}

export function seedFaqs() {
  return [
    { id: 'faq1', question: 'How do I apply for a place at Highgate?', answer: 'Begin with an enquiry via the contact form or call our admissions office. We invite every family to tour campus, then guide you through application, assessment, and offer. The full journey is outlined on our <a href="/admissions">Admissions page</a>.', category: 'Admissions', order: 1 },
    { id: 'faq2', question: 'Is there a deadline for applications?', answer: 'Applications for September entry open on 1 October and close on 31 January. Mid-year applications are welcome subject to available places.', category: 'Admissions', order: 2 },
    { id: 'faq3', question: 'Do you offer scholarships?', answer: 'Yes — academic, music, and sport scholarships are available for entry at Years 7 and 12, covering between 25% and 100% of fees.', category: 'Fees & Finance', order: 3 },
    { id: 'faq4', question: 'What fees are not included in the published fee schedule?', answer: 'The published fees cover tuition, core materials, and most activities. School meals, transport, optional trips, and individual music tuition are charged separately. See the <a href="/fees">Fees page</a> for details.', category: 'Fees & Finance', order: 4 },
    { id: 'faq5', question: 'Do you support students who are new to English?', answer: 'Absolutely. Our EAL programme supports students from beginner to fluent, with dedicated lessons and in-class support. Around a third of new joiners each year are beginner or developing EAL speakers.', category: 'Academics', order: 5 },
    { id: 'faq6', question: 'What curriculum do you follow?', answer: 'We follow the International Primary Curriculum, Cambridge IGCSE, and the International Baccalaureate Diploma. Details are on the <a href="/academics">Academics page</a>.', category: 'Academics', order: 6 },
    { id: 'faq7', question: 'What are the school hours?', answer: 'The school day runs from 8:30 to 15:30 for most year groups, with early drop-off from 7:45 and after-school clubs until 17:30.', category: 'School Life', order: 7 },
    { id: 'faq8', question: 'How do parents stay informed?', answer: 'Weekly email bulletins, the Highgate parent app, termly forums, and three parent–teacher conferences each year.', category: 'School Life', order: 8 },
    { id: 'faq9', question: 'Is there a bus service?', answer: 'Yes — door-to-door and hub-based services cover most of Greater London, with trained escorts on every route.', category: 'School Life', order: 9 },
    { id: 'faq10', question: 'Can I book a visit before applying?', answer: 'Of course — visits are the best way to meet us. Book via the <a href="/contact">Contact page</a> or at our monthly Open Mornings.', category: 'Admissions', order: 10 }
  ]
}

export function seedAchievements() {
  return [
    { id: 'ach1', title: 'International Model UN — Outstanding Delegation', description: 'Best delegation award at IMUN Geneva 2026, with one student named Best Delegate.', date: new Date(Date.now() - 15 * 86400000).toISOString(), image: IMG.studentsGroup, category: 'Academic' },
    { id: 'ach2', title: 'National Youth Music Festival — Gold', description: 'Chamber Orchestra wins gold in senior strings; Outstanding Soloist award for Yuki Chen.', date: new Date(Date.now() - 25 * 86400000).toISOString(), image: IMG.music, category: 'Arts' },
    { id: 'ach3', title: 'London International Schools Cup — U15 Football', description: 'Our U15 side lifts the cup with a 3–2 final win over last year\'s champions.', date: new Date(Date.now() - 20 * 86400000).toISOString(), image: IMG.soccer, category: 'Sport' },
    { id: 'ach4', title: '96% IB Diploma Pass Rate', description: 'Class of 2025 records our best results, with an average score of 36 points.', date: new Date(Date.now() - 80 * 86400000).toISOString(), image: IMG.graduation, category: 'Academic' },
    { id: 'ach5', title: 'Regional Swimming — 14 Medals', description: 'Swimming squad brings home 5 gold, 6 silver and 3 bronze from the regional championships.', date: new Date(Date.now() - 30 * 86400000).toISOString(), image: IMG.swim, category: 'Sport' },
    { id: 'ach6', title: 'National STEM Fair — Finalists', description: 'Three Highgate projects reach the national finals; Year 12 team wins the AI in Sustainability award.', date: new Date(Date.now() - 50 * 86400000).toISOString(), image: IMG.lab, category: 'Academic' },
    { id: 'ach7', title: 'Silver Award — World Schools Debating', description: 'The senior debate team reaches the semifinals of the World Schools Debating Championship regional qualifiers.', date: new Date(Date.now() - 45 * 86400000).toISOString(), image: IMG.kidsHands, category: 'Academic' },
    { id: 'ach8', title: 'Eco-Schools Green Flag (7th year)', description: 'Highgate retains its Green Flag with distinction for sustainability across campus operations.', date: new Date(Date.now() - 60 * 86400000).toISOString(), image: IMG.forest, category: 'Community' }
  ]
}

export function seedClubs() {
  return [
    { id: 'club1', name: 'Robotics Society', description: 'Design, build, and program robots for regional and national competitions. Open to Years 5–13; beginners welcome.', photo: IMG.lab, advisor: 'Mr. Rajesh Mehta', meetingSchedule: 'Wednesdays 15:45–17:15' },
    { id: 'club2', name: 'Chamber Orchestra', description: 'The school\'s flagship ensemble — gold medallists at the National Youth Music Festival. By audition, Years 7–13.', photo: IMG.music, advisor: 'Ms. Clara Mendes', meetingSchedule: 'Tuesdays 16:00–17:30' },
    { id: 'club3', name: 'Model United Nations', description: 'Debate global affairs, draft resolutions, and represent Highgate at conferences across Europe. Years 9–13.', photo: IMG.studentsGroup, advisor: 'Mr. Omar Haddad', meetingSchedule: 'Thursdays 15:45–17:00' },
    { id: 'club4', name: 'Chess Club', description: 'From beginners to county-level players — tactics, rapid tournaments, and the annual House Chess Championship.', photo: IMG.chess, advisor: 'Mr. David Adeyemi', meetingSchedule: 'Mondays 15:45–16:45' },
    { id: 'club5', name: 'Art Studio', description: 'Studio time with a practising artist: drawing, painting, printmaking, and preparation for the annual exhibition.', photo: IMG.art, advisor: 'Ms. Clara Mendes', meetingSchedule: 'Wednesdays 15:45–17:00' },
    { id: 'club6', name: 'Green Team (Eco Committee)', description: 'Leads our Eco-Schools programme: campus biodiversity, sustainability campaigns, and the annual Green Week.', photo: IMG.forest, advisor: 'Dr. Sofia Lindqvist', meetingSchedule: 'Fridays 15:45–16:30' }
  ]
}

export function seedSports() {
  return [
    { id: 'sp1', name: 'Football', description: 'Boys\' and girls\' squads from U9 to U18, training twice weekly with UEFA-licensed coaches and a full fixture calendar.', photo: IMG.soccer, coach: 'Coach David Adeyemi', achievements: ['London International Schools Cup champions (U15)', 'Regional U13 finalists 2025'] },
    { id: 'sp2', name: 'Swimming', description: 'Six-lane pool, squads from learn-to-swim to performance, and a record 14 medals at the 2026 regional championships.', photo: IMG.swim, coach: 'Ms. Aisha Bello', achievements: ['14 regional medals in 2026', '5 swimmers qualified for nationals'] },
    { id: 'sp3', name: 'Athletics', description: 'Track and field for all ages with professional coaching in sprint, middle distance, jumps and throws.', photo: IMG.running, coach: 'Coach David Adeyemi', achievements: ['200m school record broken in 2026', '9 national qualifiers'] },
    { id: 'sp4', name: 'Netball', description: 'A thriving netball programme with friendly and competitive fixtures across the London leagues.', photo: IMG.sportKids, coach: 'Mrs. Katherine Wills', achievements: ['London Schools League runners-up 2025'] },
    { id: 'sp5', name: 'Rugby', description: 'Contact and touch rugby from Year 3 up, with an emphasis on character, courage, and teamwork.', photo: IMG.team, coach: 'Mr. Thomas Eze', achievements: ['Regional 7s plate winners 2025'] },
    { id: 'sp6', name: 'Outdoor Education & Expedition', description: 'Residential trips, Duke of Edinburgh expeditions, and mountain skills from Year 6 upward.', photo: IMG.mountains, coach: 'Dr. Sofia Lindqvist', achievements: ['75% of Year 10 complete Bronze DofE'] }
  ]
}

export function seedHomeSections() {
  const b = (id, type, content, order) => ({ id, sectionKey: id, content: { type, ...content }, order, isVisible: true })
  return [
    b('hhero', 'hero', { kicker: 'International Private School · Ages 3–18', title: 'Knowledge Without Borders', subtitle: 'A community of forty-two nationalities, a tradition of academic excellence, and a culture of genuine care — welcome to Highgate School.', image: IMG.hero, cta1: { label: 'Explore Admissions', to: '/admissions' }, cta2: { label: 'Learn About Us', to: '/about' } }, 1),
    b('hwelcome', 'welcome', { title: 'A School Where Children Are Known by Name', body: '<p>Highgate is an international day school in London for students aged 3 to 18. We pair the rigour of Cambridge IGCSE and the International Baccalaureate with a warmth families feel from their very first visit.</p>', image: IMG.kidsClassroom }, 2),
    b('hstats', 'stats', { items: [{ value: '1,150+', label: 'Students' }, { value: '42', label: 'Nationalities' }, { value: '96%', label: 'IB Pass Rate' }, { value: '40+', label: 'Clubs & Teams' }] }, 3),
    b('hprograms', 'programs', { title: 'One Journey, Every Stage' }, 4),
    b('hnews', 'latestNews', { title: 'From the Newsroom' }, 5),
    b('hevents', 'upcomingEvents', { title: 'Mark Your Calendar' }, 6),
    b('hquote', 'quote', { quote: 'We measure success not only in exam results but in the kindness of our corridors, the courage of our questions, and the character of our graduates.', author: 'Dr. Helena Moreau', role: 'Head of School' }, 7),
    b('hgallery', 'galleryPreview', { title: 'Life in Pictures' }, 8),
    b('hcta', 'cta', { title: 'Begin Your Highgate Story', text: 'Book a campus tour, attend an Open Morning, or simply start a conversation with our admissions team.', cta1: { label: 'Book a Tour', to: '/contact' }, cta2: { label: 'Explore Admissions', to: '/admissions' } }, 9)
  ]
}

export function seedFees() {
  return [
    {
      id: 'fee1', level: 'Early Years', academicYear: '2026/27',
      items: [
        { label: 'Tuition (per term)', amount: 8400 },
        { label: 'Registration (one-off)', amount: 250 },
        { label: 'Deposit (refundable)', amount: 1500 },
        { label: 'Lunch (per term)', amount: 420 }
      ],
      notes: 'Fees include core materials, library access, and all class-based activities. Sibling discount of 10% applies from the second child.'
    },
    {
      id: 'fee2', level: 'Primary', academicYear: '2026/27',
      items: [
        { label: 'Tuition (per term)', amount: 9600 },
        { label: 'Registration (one-off)', amount: 250 },
        { label: 'Deposit (refundable)', amount: 1500 },
        { label: 'Lunch (per term)', amount: 470 },
        { label: 'Instrument tuition (optional)', amount: 520 }
      ],
      notes: 'Fees are payable termly in advance. Annual payment attracts a 2% discount. Scholarships and bursaries available at Years 7 and 12.'
    },
    {
      id: 'fee3', level: 'Secondary', academicYear: '2026/27',
      items: [
        { label: 'Tuition (per term)', amount: 11200 },
        { label: 'Registration (one-off)', amount: 250 },
        { label: 'Deposit (refundable)', amount: 1500 },
        { label: 'Lunch (per term)', amount: 470 },
        { label: 'Examination fees (per session)', amount: 620 },
        { label: 'Study trips (optional)', amount: 480 }
      ],
      notes: 'IGCSE and IB examination fees are billed per examination session. A confidential bursary fund supports families facing financial hardship.'
    },
    {
      id: 'fee4', level: 'IB Diploma', academicYear: '2026/27',
      items: [
        { label: 'Tuition (per term)', amount: 12400 },
        { label: 'Registration (one-off)', amount: 250 },
        { label: 'Deposit (refundable)', amount: 1500 },
        { label: 'Lunch (per term)', amount: 470 },
        { label: 'IB examination fees', amount: 940 },
        { label: 'Extended Essay supervision', amount: 0 }
      ],
      notes: 'Fees include university counselling from Year 10. Extended Essay supervision is included in tuition.'
    }
  ]
}

export function seedCalendarEvents() {
  const day = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString() }
  return [
    { id: 'cal1', title: 'Term 1 Begins', date: day(-120), endDate: day(-120), type: 'Term', description: 'First day of the autumn term for all year groups.' },
    { id: 'cal2', title: 'Half-Term Holiday', date: day(-95), endDate: day(-91), type: 'Holiday', description: 'One-week break for all students.' },
    { id: 'cal3', title: 'Parent–Teacher Conferences', date: day(20), endDate: day(21), type: 'Assessment', description: 'Autumn conferences for all year groups — appointments via the Highgate app.' },
    { id: 'cal4', title: 'Year 11 Mock Examinations', date: day(24), endDate: day(28), type: 'Assessment', description: 'IGCSE mock examinations for Year 11.' },
    { id: 'cal5', title: 'Open Morning', date: day(10), endDate: day(10), type: 'Admissions', description: 'Campus tour and Q&A for prospective families.' },
    { id: 'cal6', title: 'Highgate Arts Festival', date: day(30), endDate: day(32), type: 'Event', description: 'Three days of theatre, music, and art.' },
    { id: 'cal7', title: 'Term 1 Ends', date: day(48), endDate: day(48), type: 'Term', description: 'Last day of the autumn term.' },
    { id: 'cal8', title: 'Spring Term Begins', date: day(60), endDate: day(60), type: 'Term', description: 'First day of the spring term.' },
    { id: 'cal9', title: 'Inter-House Swimming Gala', date: day(45), endDate: day(45), type: 'Event', description: 'The battle for the Gala Cup.' },
    { id: 'cal10', title: 'Scholarship Assessments', date: day(62), endDate: day(63), type: 'Admissions', description: 'Assessments for Year 7 and Year 12 scholarship entry.' },
    { id: 'cal11', title: 'IB Diploma Final Examinations', date: day(100), endDate: day(115), type: 'Assessment', description: 'Written examinations for the May session.' },
    { id: 'cal12', title: 'International Food & Culture Fair', date: day(55), endDate: day(55), type: 'Event', description: 'Forty-two nations on the North Lawn.' }
  ]
}

export function seedMessages() {
  return [
    { id: 'msg1', name: 'Amelia Hart', email: 'amelia.hart@example.com', subject: 'Open Morning booking', message: 'We would love to attend the Open Morning in two weeks. Could you confirm availability for a family of four, and whether there is a children\'s programme?', submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(), isRead: true },
    { id: 'msg2', name: 'Jonas Weber', email: 'j.weber@example.de', subject: 'Year 7 place enquiry', message: 'We are relocating from Munich in January and would like to enquire about a Year 7 place. What is the mid-year admissions process and timeline?', submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(), isRead: false }
  ]
}

export function seedMedia() {
  return []
}

const iso = (d) => new Date(d).toISOString()
const days = (n) => Date.now() + n * 86400000

export function seedNotices() {
  return [
    { id: 'not1', title: 'Spring Term Begins Monday 5 January', body: 'All year groups return on Monday 5 January. Gates open at 7:45, lessons begin at 8:30. Please ensure students arrive in full winter uniform.', category: 'General', pinned: true, priority: 'normal', publishDate: iso(days(-2)), expireDate: iso(days(6)), isVisible: true, status: 'published' },
    { id: 'not2', title: 'Scholarship Application Deadline Extended', body: 'The deadline for Year 7 and Year 12 scholarship applications has been extended to 28 February. Register your interest through the admissions office.', category: 'Admissions', pinned: true, priority: 'high', publishDate: iso(days(-1)), expireDate: iso(days(40)), isVisible: true, status: 'published' },
    { id: 'not3', title: 'Year 11 Mock Examinations — Timetable Released', body: 'The Year 11 IGCSE mock examination timetable has been published to the student portal. See the downloads section for a printable copy.', category: 'Examinations', pinned: false, priority: 'normal', publishDate: iso(days(-3)), expireDate: iso(days(25)), isVisible: true, status: 'published' },
    { id: 'not4', title: 'International Food & Culture Fair — Volunteers Needed', body: 'Parent volunteers are needed for the International Food & Culture Fair on the North Lawn. Sign up via the parent portal or the front office.', category: 'PTA', pinned: false, priority: 'normal', publishDate: iso(days(-4)), expireDate: iso(days(55)), isVisible: true, status: 'published' },
    { id: 'not5', title: 'Inter-House Swimming Gala Postponed', body: 'Due to maintenance works at the Aquatics Centre, the Inter-House Swimming Gala moves to the following week. Revised date will be announced shortly.', category: 'General', pinned: false, priority: 'high', publishDate: iso(days(-1)), expireDate: iso(days(5)), isVisible: true, status: 'published' }
  ]
}

export function seedApplications() {
  const now = iso(days(-1))
  return [
    { id: 'app1', ref: 'APP-2026-001', studentFirstName: 'Elena', studentLastName: 'Kovač', dob: '2013-04-12', gender: 'Female', applyingForYear: 'Year 7', currentSchool: 'Meridian Park Primary', parentName: 'Dr. Marko Kovač', parentEmail: 'm.kovac@example.com', parentPhone: '+44 7700 900001', address: '12 Riverside Walk, London E14 3AL', country: 'United Kingdom', documents: [{ name: 'School Report.pdf', url: '' }], statement: 'We believe the international, inquiry-led environment at Highgate would be the ideal next step for Elena.', status: 'under_review', submittedAt: now, decisionNotes: '' }
  ]
}

export function seedLibrary() {
  return [
    { id: 'lib1', title: 'The IB Learner Profile — A Practical Guide', type: 'eBook', category: 'Academic', author: 'Highgate Publications', description: 'A short guide to the ten IB learner profile attributes, written for parents and students.', coverImage: IMG.books, fileUrl: 'https://example.com/highgate/ib-learner-profile.pdf', featured: true, downloadCount: 0, publishedAt: iso(days(-20)), status: 'published' },
    { id: 'lib2', title: 'IGCSE Mathematics — Past Papers (2023–2025)', type: 'Past Paper', category: 'Exam Preparation', author: 'Cambridge', description: 'A curated collection of recent IGCSE Mathematics papers with mark schemes.', coverImage: IMG.desk, fileUrl: 'https://example.com/highgate/igcse-maths-papers.pdf', featured: true, downloadCount: 0, publishedAt: iso(days(-15)), status: 'published' },
    { id: 'lib3', title: 'Junior Reading List — Autumn Term', type: 'Notes', category: 'Reading Lists', author: 'Dr. Isabelle Fontaine', description: 'Our librarians\' picks for ages 6–11, from picture books to early chapter books.', coverImage: IMG.library, fileUrl: 'https://example.com/highgate/junior-reading-list.pdf', featured: false, downloadCount: 0, publishedAt: iso(days(-12)), status: 'published' },
    { id: 'lib4', title: 'STEAM Magazine — Winter Edition', type: 'Magazine', category: 'Magazines', author: 'STEAM Faculty', description: 'Student projects, interviews with engineers, and a home-lab experiment pull-out.', coverImage: IMG.lab, fileUrl: 'https://example.com/highgate/steam-winter.pdf', featured: true, downloadCount: 0, publishedAt: iso(days(-8)), status: 'published' },
    { id: 'lib5', title: 'Highgate History Podcast — Ep.1: The Founding', type: 'Audio', category: 'Audio & Video Lessons', author: 'Communications Office', description: 'The story of Highgate\'s first year, told by founders and early families.', coverImage: IMG.campus, fileUrl: 'https://example.com/highgate/founding-episode.mp3', featured: false, downloadCount: 0, publishedAt: iso(days(-6)), status: 'published' },
    { id: 'lib6', title: 'Revision Techniques That Work', type: 'Notes', category: 'Study Skills', author: 'Mr. Rajesh Mehta', description: 'Evidence-based revision strategies for IGCSE and IB students.', coverImage: IMG.study, fileUrl: 'https://example.com/highgate/revision-techniques.pdf', featured: false, downloadCount: 0, publishedAt: iso(days(-4)), status: 'published' }
  ]
}

export function seedMagazineArticles() {
  return [
    { id: 'mag1', title: 'The Quiet Revolution in Our Science Labs', slug: 'quiet-revolution-science-labs', edition: 'Winter 2026', category: 'Features', author: 'Dr. Sofia Lindqvist', contributorType: 'teacher', excerpt: 'Our Head of Sciences on why the best experiments in the school are the ones that quietly fail first.', body: '<p>If you walk into our laboratories on a Thursday afternoon, you will hear something unexpected: laughter. Not the polite laughter of a school assembly, but the delighted surprise of students whose experiment has just done something they did not predict.</p><p>This is the sound of science done properly. It is messy, it is iterative, and it belongs to the students.</p>', coverImage: IMG.lab, featured: true, publishedAt: iso(days(-10)), status: 'published' },
    { id: 'mag2', title: 'Forty-Two Tables, One Family', slug: 'forty-two-tables-one-family', edition: 'Winter 2026', category: 'Community', author: 'Yuki Chen', contributorType: 'student', excerpt: 'Year 11 student Yuki Chen reports from the International Food & Culture Fair.', body: '<p>By 9am the North Lawn smelled of cardamom. By noon, of everything else too — yassa, pelmeni, kimchi, jollof. Forty-two tables, forty-two flags, and the whole school weaving between them.</p><p>The proceeds fund scholarships. But the real yield is the way a Year 3 student can now say "thank you" in four languages.</p>', coverImage: IMG.kidsHands, featured: true, publishedAt: iso(days(-7)), status: 'published' },
    { id: 'mag3', title: 'A Conversation with the Head of School', slug: 'conversation-head-of-school', edition: 'Winter 2026', category: 'Interviews', author: 'Communications Office', contributorType: 'guest', excerpt: 'Dr. Helena Moreau on twenty years of Highgate, the hardest year, and what she hopes for the next decade.', body: '<p>Q: What is the most surprising thing about leading this school?<br/>A: How little the building matters and how much the people do. We have added wings and pitches and labs, but every parent I meet asks about the same thing: is my child known here? The answer must always be yes.</p>', coverImage: IMG.port1, featured: false, publishedAt: iso(days(-5)), status: 'published' },
    { id: 'mag4', title: 'Poetry in the Playground', slug: 'poetry-in-the-playground', edition: 'Winter 2026', category: 'Creative Writing', author: 'Priya Nair (Year 8)', contributorType: 'student', excerpt: 'Two poems from our Year 8 creative writing anthology.', body: '<p><strong>First Day</strong></p><p>The map in my pocket is creased with doubt —<br/>but every door here is a handshake.<br/>I lose the corridor; I find a friend.</p>', coverImage: IMG.kidsClassroom, featured: false, publishedAt: iso(days(-3)), status: 'published' },
    { id: 'mag5', title: 'The Maths of Sport: How Our Athletes Use Statistics', slug: 'maths-of-sport', edition: 'Winter 2026', category: 'Science & Sport', author: 'Mr. Rajesh Mehta', contributorType: 'teacher', excerpt: 'From xG in football to pace-buoyancy curves in swimming, the maths behind the medals.', body: '<p>When our U15 football side set up for a corner, they are not just playing instinct — they are playing probability. Expected goals. Pressing triggers. Zone occupancy.</p><p>This term, the Mathematics department and the sports programme ran a joint elective. Students who could barely sit through a worksheet were suddenly arguing about data visualisation.</p>', coverImage: IMG.soccer, featured: false, publishedAt: iso(days(-2)), status: 'published' }
  ]
}

export function seedVacancies() {
  return [
    { id: 'vac1', title: 'Teacher of Mathematics (IGCSE & IB)', type: 'Teaching', department: 'Mathematics', location: 'Main Campus, Meridian Park', contract: 'Full-time, permanent', salary: '£45,000–£58,000', summary: 'Join a thriving Mathematics department as we prepare for our strongest-ever Year 11 cohort.', responsibilities: ['Teach IGCSE and IB Mathematics', 'Contribute to the UKMT and olympiad coaching programme', 'Tutor within the house system'], qualifications: ['Qualified teacher status (or equivalent)', 'Degree in Mathematics or related field', 'IB or IGCSE teaching experience desirable'], closingDate: iso(days(21)), isOpen: true, publishedAt: iso(days(-3)), status: 'published' },
    { id: 'vac2', title: 'Head of Admissions Support Officer', type: 'Administrative', department: 'Admissions', location: 'Main Campus, Meridian Park', contract: 'Full-time', salary: '£32,000–£38,000', summary: 'Support the Head of Admissions across the full enquiry-to-enrolment journey.', responsibilities: ['Manage the admissions inbox and tour bookings', 'Prepare offer letters and enrolment packs', 'Maintain applicant records'], qualifications: ['Excellent written communication', 'Experience in a school or customer-facing setting', 'Fluent English; a second language desirable'], closingDate: iso(days(14)), isOpen: true, publishedAt: iso(days(-1)), status: 'published' },
    { id: 'vac3', title: 'Learning Support Assistant (Early Years)', type: 'Support', department: 'Early Years', location: 'Junior Campus', contract: 'Part-time', salary: '£24,000–£28,000 pro rata', summary: 'Support our youngest learners in a warm, play-based environment.', responsibilities: ['Work 1:1 and in small groups', 'Support outdoor learning in the Discovery Garden', 'Liaise with parents and class teachers'], qualifications: ['Level 3 childcare qualification (or working towards)', 'First aid certification desirable'], closingDate: iso(days(28)), isOpen: true, publishedAt: iso(days(-5)), status: 'published' },
    { id: 'vac4', title: 'Sports Coach — Swimming', type: 'Teaching', department: 'Physical Education & Sport', location: 'Aquatics Centre', contract: 'Fixed-term (1 year)', salary: '£30,000–£36,000', summary: 'Coach our learn-to-swim to performance squads in the six-lane Aquatics Centre.', responsibilities: ['Plan and deliver squad sessions', 'Prepare swimmers for regional competitions', 'Support the school gala programme'], qualifications: ['Swim England / STA teaching qualification', 'Safeguarding training'], closingDate: iso(days(-1)), isOpen: false, publishedAt: iso(days(-15)), status: 'published' }
  ]
}

export function seedJobApplications() {
  const now = iso(days(-2))
  return [
    { id: 'job1', vacancyId: 'vac1', name: 'Grace Adeyemi', email: 'grace.adeyemi@example.com', phone: '+44 7700 900002', coverLetter: 'I am a Mathematics teacher with six years of IGCSE experience and a passion for problem-solving clubs.', cvUrl: '', status: 'review', appliedAt: now }
  ]
}

export function seedFeedback() {
  return [
    { id: 'fb1', ref: 'FBK-482910', name: 'Sarah Mitchell', email: 's.mitchell@example.com', category: 'Suggestion', priority: 'Low', subject: 'Vegetarian options', message: 'Could we see more vegetarian options on the lunch rotation, especially for the Early Years?', status: 'under_review', createdAt: iso(days(-2)) },
    { id: 'fb2', ref: 'FBK-482911', name: 'Ahmed Hassan', email: 'a.hassan@example.com', category: 'Concern', priority: 'High', subject: 'Afternoon bus delay', message: 'The Meridian Park bus has been 20 minutes late for three consecutive days. Could we get an update?', status: 'acknowledged', createdAt: iso(days(-1)) },
    { id: 'fb3', ref: 'FBK-482908', name: 'Louise Turner', email: 'l.turner@example.com', category: 'Compliment', priority: 'Low', subject: 'Thank you, Year 4 team', message: 'The support my daughter received during the Year 4 residential was outstanding. Thank you.', status: 'resolved', createdAt: iso(days(-4)) }
  ]
}

export function seedTestimonials() {
  return [
    { id: 'tes1', name: 'Claire Dubois', role: 'Parent', relationship: 'Parent of Year 8 student', quote: 'We moved to London from Paris with a nervous daughter. Within a term, Highgate felt like home to all three of us — the teachers know her name, her strengths, and her fears.', photo: IMG.port4, rating: 5, featured: true, approved: true, createdAt: iso(days(-30)) },
    { id: 'tes2', name: 'Oluwaseun Adebayo', role: 'Parent', relationship: 'Parent of Year 12 student', quote: 'The university counselling alone is worth it. Our son\'s IB journey was guided, honest, and relentlessly supportive — he is now at Imperial.', photo: IMG.port9, rating: 5, featured: true, approved: true, createdAt: iso(days(-24)) },
    { id: 'tes3', name: 'Marta Kowalski', role: 'Student', relationship: 'Year 10, MUN team', quote: 'The first time I debated at Model UN, my hands were shaking. Last month I chaired the Security Council. Highgate gave me the stage and then taught me to use it.', photo: IMG.port5, rating: 5, featured: false, approved: true, createdAt: iso(days(-18)) },
    { id: 'tes4', name: 'James Whitfield', role: 'Teacher', relationship: 'Science faculty, 6 years', quote: 'I have taught on three continents. There is something genuinely different about the culture here — curiosity is the loudest sound in the building.', photo: IMG.port6, rating: 5, featured: false, approved: true, createdAt: iso(days(-12)) },
    { id: 'tes5', name: 'Priya Anand', role: 'Visitor', relationship: 'Open Morning guest', quote: 'We visited six schools before Highgate. This was the only one where a student walked up to us unprompted and asked if we would like a tour. We applied that week.', photo: IMG.port3, rating: 5, featured: false, approved: true, createdAt: iso(days(-8)) }
  ]
}

export function seedNewsletterSubscribers() {
  return [
    { id: 'sub1', email: 'parent1@example.com', name: 'Test Family', status: 'subscribed', createdAt: iso(days(-20)) },
    { id: 'sub2', email: 'parent2@example.com', name: '', status: 'subscribed', createdAt: iso(days(-6)) }
  ]
}

export function seedNewsletterCampaigns() {
  return [
    { id: 'camp1', subject: 'Spring Term Welcome — Key Dates Inside', headline: 'Welcome back to the Spring Term', body: '<p>Key dates for the term ahead, the scholarship deadline reminder, and a note from the Head of School.</p>', status: 'sent', scheduleAt: iso(days(1)), sentAt: iso(days(1)), opens: 0, clicks: 0 },
    { id: 'camp2', subject: 'Open Morning — Book Your Place', headline: 'Our next Open Morning is nearly full', body: '<p>Monthly Open Mornings for prospective families. Tour the campus, meet teachers, and ask us anything.</p>', status: 'draft', scheduleAt: null, sentAt: null, opens: 0, clicks: 0 }
  ]
}

export function seedCampusLocations() {
  return [
    { id: 'cl1', name: 'Main Entrance & Reception', category: 'Administration', x: 8, y: 6, icon: 'door', description: 'Welcome desk, visitor registration, and the front office.', featuredImage: IMG.campus },
    { id: 'cl2', name: 'Highgate Theatre', category: 'Arts & Community', x: 26, y: 12, icon: 'music', description: '300-seat theatre for productions, assemblies, and concerts.', featuredImage: IMG.music },
    { id: 'cl3', name: 'Discovery Centre (STEAM Wing)', category: 'Academic', x: 14, y: 42, icon: 'flask', description: 'University-grade science labs, design studios, and the robotics lab.', featuredImage: IMG.lab },
    { id: 'cl4', name: 'Central Library', category: 'Academic', x: 40, y: 34, icon: 'book', description: '40,000 volumes across 20 languages, plus the silent study hall.', featuredImage: IMG.library },
    { id: 'cl5', name: 'Junior School Classrooms', category: 'Academic', x: 22, y: 68, icon: 'pencil', description: 'Years 1–6 classrooms around the Discovery Garden.', featuredImage: IMG.kidsClassroom },
    { id: 'cl6', name: 'Discovery Garden (Early Years)', category: 'Academic', x: 8, y: 84, icon: 'leaf', description: 'Outdoor learning for ages 3–5: kitchen garden, mud kitchen, and forest area.', featuredImage: IMG.forest },
    { id: 'cl7', name: 'Upper School & IB Centre', category: 'Academic', x: 58, y: 18, icon: 'graduation', description: 'Years 10–13 classrooms, the IB Centre, and university counselling office.', featuredImage: IMG.study },
    { id: 'cl8', name: 'Sports Complex', category: 'Sports', x: 78, y: 30, icon: 'trophy', description: 'Multi-sport hall, fitness suite, and changing rooms.', featuredImage: IMG.sportKids },
    { id: 'cl9', name: 'Aquatics Centre', category: 'Sports', x: 88, y: 52, icon: 'waves', description: 'Six-lane competition pool and learn-to-swim pool.', featuredImage: IMG.swim },
    { id: 'cl10', name: 'North Lawn & Food Fair Field', category: 'Community', x: 60, y: 62, icon: 'tree', description: 'Main events lawn — food fair, summer concerts, and whole-school photos.', featuredImage: IMG.sky },
    { id: 'cl11', name: 'Cafeteria & Dining Hall', category: 'Services', x: 42, y: 72, icon: 'coffee', description: 'Fresh-cooked meals daily, with vegetarian and allergy-friendly lines.', featuredImage: IMG.desk },
    { id: 'cl12', name: 'Administration Block', category: 'Administration', x: 64, y: 6, icon: 'briefcase', description: 'Head of School office, HR, finance, and the admissions office.', featuredImage: IMG.team }
  ]
}

export function seedTourScenes() {
  return [
    { id: 'ts1', title: 'Welcome to Highgate', location: 'Main Entrance', category: 'Campus', description: 'Where every visitor begins their journey — the atrium and reception.', image: IMG.campus, order: 1, isVisible: true },
    { id: 'ts2', title: 'The Central Library', location: 'Central Library', category: 'Learning Spaces', description: 'Forty thousand books, twenty languages, one very quiet study hall.', image: IMG.library, order: 2, isVisible: true },
    { id: 'ts3', title: 'Inside the STEAM Wing', location: 'Discovery Centre', category: 'Learning Spaces', description: 'Chemistry, physics, and biology labs — plus the robotics arena.', image: IMG.lab, order: 3, isVisible: true },
    { id: 'ts4', title: 'A Junior Classroom', location: 'Junior School', category: 'Learning Spaces', description: 'Small classes, big windows, and inquiry on the walls.', image: IMG.classroom, order: 4, isVisible: true },
    { id: 'ts5', title: 'The Discovery Garden', location: 'Early Years', category: 'Learning Spaces', description: 'Outdoor learning for our youngest students, in every season.', image: IMG.forest, order: 5, isVisible: true },
    { id: 'ts6', title: 'The Sports Complex', location: 'Sports Complex', category: 'Sport & Community', description: 'Where the house cups are won — hall, pool, and pitches.', image: IMG.sportKids, order: 6, isVisible: true }
  ]
}

export function seedEmergencyAlerts() {
  return [
    { id: 'em1', title: 'Weather Advisory — Heavy Snow Forecast', type: 'Weather', message: 'A heavy snow warning is in place for Thursday. If transport services are suspended, families will be notified by 6:30am via email, text, and this page.', severity: 'warning', publishDate: iso(days(0)), expireDate: iso(days(3)), isVisible: true, status: 'published' }
  ]
}

export function seedEventRegistrations() {
  return []
}

export function seedStats() {
  return [
    { id: 'st1', label: 'Students', value: 1150, suffix: '+', icon: 'users', description: 'Across Early Years to IB Diploma', order: 1 },
    { id: 'st2', label: 'Nationalities', value: 42, suffix: '', icon: 'globe', description: 'One community, forty-two countries', order: 2 },
    { id: 'st3', label: 'IB Pass Rate', value: 96, suffix: '%', icon: 'graduation', description: 'Class of 2025 results', order: 3 },
    { id: 'st4', label: 'Teaching Staff', value: 128, suffix: '', icon: 'teacher', description: 'Drawn from six continents', order: 4 },
    { id: 'st5', label: 'Student–Teacher Ratio', value: 8, suffix: ':1', icon: 'heart', description: 'Small classes, known by name', order: 5 },
    { id: 'st6', label: 'Years of Excellence', value: 28, suffix: '', icon: 'trophy', description: 'Founded 1998, growing every year', order: 6 },
    { id: 'st7', label: 'University Placements', value: 95, suffix: '%', icon: 'target', description: 'Graduates to first-choice university', order: 7 },
    { id: 'st8', label: 'Clubs & Teams', value: 65, suffix: '+', icon: 'puzzle', description: 'From robotics to rowing', order: 8 },
    { id: 'st9', label: 'Events Per Year', value: 120, suffix: '+', icon: 'calendar', description: 'Assemblies, fairs, and fixtures', order: 9 },
    { id: 'st10', label: 'Award-Winning Faculty', value: 20, suffix: '+', icon: 'award', description: 'National teaching and research prizes', order: 10 }
  ]
}

export function seedSocialFeeds() {
  return {
    platforms: [
      { platform: 'facebook', handle: '@highgateschool', url: 'https://facebook.com/highgateschool', enabled: true, order: 1 },
      { platform: 'instagram', handle: '@highgate.sch.uk', url: 'https://instagram.com/highgateschool', enabled: true, order: 2 },
      { platform: 'youtube', handle: 'Highgate Academy', url: 'https://youtube.com/@highgateschool', enabled: true, order: 3 },
      { platform: 'linkedin', handle: 'Highgate School', url: 'https://linkedin.com/company/highgateschool', enabled: true, order: 4 }
    ],
    headline: 'Follow the school day as it happens',
    showOnHome: true
  }
}
