import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout.jsx'
import ContentPage from './components/ContentPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { InitialSiteLoader } from './components/PageLoader.jsx'

// Core: eagerly loaded (needed on every page)
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/cms/Login.jsx'

// CMS entity screens: eagerly loaded (2 files export ~30 components)
import {
  EventsCrud, VideosCrud, DownloadsCrud, FaqCrud, AchievementsCrud, ClubsCrud, SportsCrud,
  DepartmentsCrud, ProgramsCrud, FeesCrud, CalendarCrud, StaffCrud
} from './pages/cms/EntityScreens.jsx'
import {
  NoticesCrud, ApplicationsCrud, LibraryCrud, MagazineCrud, VacanciesCrud, JobApplicationsCrud,
  FeedbackCrud, TestimonialsCrud, NewsletterSubscribersCrud, NewsletterCampaignsCrud,
  CampusLocationsCrud, TourScenesCrud, EmergencyAlertsCrud, EventRegistrationsCrud, StatsCrud
} from './pages/cms/FeatureScreens.jsx'

// Public pages: lazy-loaded (code-split)
const NewsIndex = lazy(() => import('./pages/NewsIndex.jsx'))
const NewsArticlePage = lazy(() => import('./pages/NewsArticlePage.jsx'))
const EventsIndex = lazy(() => import('./pages/EventsIndex.jsx'))
const EventDetail = lazy(() => import('./pages/EventDetail.jsx'))
const GalleryIndex = lazy(() => import('./pages/GalleryIndex.jsx'))
const GalleryAlbumPage = lazy(() => import('./pages/GalleryAlbumPage.jsx'))
const VideosPage = lazy(() => import('./pages/Videos.jsx'))
const StaffDirectory = lazy(() => import('./pages/StaffDirectory.jsx'))
const StaffProfile = lazy(() => import('./pages/StaffProfile.jsx'))
const DepartmentsPage = lazy(() => import('./pages/Departments.jsx'))
const DepartmentDetail = lazy(() => import('./pages/DepartmentDetail.jsx'))
const ProgramsIndex = lazy(() => import('./pages/ProgramsIndex.jsx'))
const ProgramDetail = lazy(() => import('./pages/ProgramDetail.jsx'))
const FeesPage = lazy(() => import('./pages/Fees.jsx'))
const CalendarPage = lazy(() => import('./pages/Calendar.jsx'))
const DownloadsPage = lazy(() => import('./pages/Downloads.jsx'))
const DownloadsByCategory = lazy(() => import('./pages/DownloadsByCategory.jsx'))
const FaqPage = lazy(() => import('./pages/Faq.jsx'))
const ContactPage = lazy(() => import('./pages/Contact.jsx'))
const AchievementsPage = lazy(() => import('./pages/Achievements.jsx'))
const ClubsPage = lazy(() => import('./pages/Clubs.jsx'))
const SportsPage = lazy(() => import('./pages/Sports.jsx'))
const NoticesPage = lazy(() => import('./pages/Notices.jsx'))
const ApplyPage = lazy(() => import('./pages/Apply.jsx'))
const LibraryPage = lazy(() => import('./pages/Library.jsx'))
const MagazinePage = lazy(() => import('./pages/Magazine.jsx'))
const MagazineArticle = lazy(() => import('./pages/MagazineArticle.jsx'))
const CareersPage = lazy(() => import('./pages/Careers.jsx'))
const TestimonialsPage = lazy(() => import('./pages/Testimonials.jsx'))
const EmergencyPage = lazy(() => import('./pages/Emergency.jsx'))
const CampusMapPage = lazy(() => import('./pages/CampusMap.jsx'))
const VirtualTourPage = lazy(() => import('./pages/VirtualTour.jsx'))
const StatisticsPage = lazy(() => import('./pages/Statistics.jsx'))
const FeedbackPage = lazy(() => import('./pages/Feedback.jsx'))
const SearchResults = lazy(() => import('./pages/SearchResults.jsx'))

// CMS pages: lazy-loaded (only accessed after login)
const DashboardLayout = lazy(() => import('./pages/cms/Layout.jsx'))
const DashboardHome = lazy(() => import('./pages/cms/DashboardHome.jsx'))
const PagesList = lazy(() => import('./pages/cms/PagesList.jsx'))
const PageEdit = lazy(() => import('./pages/cms/PageEdit.jsx'))
const Menus = lazy(() => import('./pages/cms/Menus.jsx'))
const NewsList = lazy(() => import('./pages/cms/NewsList.jsx'))
const NewsEdit = lazy(() => import('./pages/cms/NewsEdit.jsx'))
const GalleryList = lazy(() => import('./pages/cms/GalleryList.jsx'))
const GalleryEdit = lazy(() => import('./pages/cms/GalleryEdit.jsx'))
const MediaLibrary = lazy(() => import('./pages/cms/MediaLibrary.jsx'))
const Seo = lazy(() => import('./pages/cms/Seo.jsx'))
const Settings = lazy(() => import('./pages/cms/Settings.jsx'))
const ContactMessages = lazy(() => import('./pages/cms/ContactMessages.jsx'))
const AuditLog = lazy(() => import('./pages/cms/AuditLog.jsx'))
const Versions = lazy(() => import('./pages/cms/Versions.jsx'))
const SystemHealth = lazy(() => import('./pages/cms/SystemHealth.jsx'))
const HomeSectionsEdit = lazy(() => import('./pages/cms/HomeSectionsEdit.jsx'))

const CMS = (el) => <ProtectedRoute>{el}</ProtectedRoute>

function Lazy({ component: Component }) {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><span className="h-8 w-8 animate-spin rounded-full border-4 border-royal border-t-transparent" /></div>}>
      <Component />
    </Suspense>
  )
}

export default function App() {
  return (
    <>
      <InitialSiteLoader />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<ContentPage slug="about" />} />
          <Route path="history" element={<ContentPage slug="history" />} />
          <Route path="vision-mission" element={<ContentPage slug="vision-mission" />} />
          <Route path="administration" element={<ContentPage slug="administration" />} />
          <Route path="board" element={<ContentPage slug="board" />} />
          <Route path="student-life" element={<ContentPage slug="student-life" />} />
          <Route path="admissions" element={<ContentPage slug="admissions" />} />
          <Route path="academics" element={<ContentPage slug="academics" />} />
          <Route path="privacy-policy" element={<ContentPage slug="privacy-policy" />} />
          <Route path="terms" element={<ContentPage slug="terms" />} />
          <Route path="staff" element={<Lazy component={StaffDirectory} />} />
          <Route path="staff/:id" element={<Lazy component={StaffProfile} />} />
          <Route path="departments" element={<Lazy component={DepartmentsPage} />} />
          <Route path="departments/:id" element={<Lazy component={DepartmentDetail} />} />
          <Route path="programs" element={<Lazy component={ProgramsIndex} />} />
          <Route path="programs/:id" element={<Lazy component={ProgramDetail} />} />
          <Route path="fees" element={<Lazy component={FeesPage} />} />
          <Route path="calendar" element={<Lazy component={CalendarPage} />} />
          <Route path="news" element={<Lazy component={NewsIndex} />} />
          <Route path="news/:slug" element={<Lazy component={NewsArticlePage} />} />
          <Route path="events" element={<Lazy component={EventsIndex} />} />
          <Route path="events/:slug" element={<Lazy component={EventDetail} />} />
          <Route path="gallery" element={<Lazy component={GalleryIndex} />} />
          <Route path="gallery/:album" element={<Lazy component={GalleryAlbumPage} />} />
          <Route path="albums" element={<Lazy component={GalleryIndex} />} />
          <Route path="albums/:album" element={<Lazy component={GalleryAlbumPage} />} />
          <Route path="videos" element={<Lazy component={VideosPage} />} />
          <Route path="achievements" element={<Lazy component={AchievementsPage} />} />
          <Route path="clubs" element={<Lazy component={ClubsPage} />} />
          <Route path="sports" element={<Lazy component={SportsPage} />} />
          <Route path="downloads" element={<Lazy component={DownloadsPage} />} />
          <Route path="downloads/:category" element={<Lazy component={DownloadsByCategory} />} />
          <Route path="faq" element={<Lazy component={FaqPage} />} />
          <Route path="contact" element={<Lazy component={ContactPage} />} />
          <Route path="notices" element={<Lazy component={NoticesPage} />} />
          <Route path="apply" element={<Lazy component={ApplyPage} />} />
          <Route path="library" element={<Lazy component={LibraryPage} />} />
          <Route path="magazine" element={<Lazy component={MagazinePage} />} />
          <Route path="magazine/:slug" element={<Lazy component={MagazineArticle} />} />
          <Route path="careers" element={<Lazy component={CareersPage} />} />
          <Route path="testimonials" element={<Lazy component={TestimonialsPage} />} />
          <Route path="emergency" element={<Lazy component={EmergencyPage} />} />
          <Route path="campus-map" element={<Lazy component={CampusMapPage} />} />
          <Route path="virtual-tour" element={<Lazy component={VirtualTourPage} />} />
          <Route path="statistics" element={<Lazy component={StatisticsPage} />} />
          <Route path="feedback" element={<Lazy component={FeedbackPage} />} />
          <Route path="search" element={<Lazy component={SearchResults} />} />
          <Route path=":slug" element={<ContentPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={CMS(<Lazy component={DashboardLayout} />)}>
          <Route index element={CMS(<Lazy component={DashboardHome} />)} />
          <Route path="home-sections" element={CMS(<Lazy component={HomeSectionsEdit} />)} />
          <Route path="pages" element={CMS(<Lazy component={PagesList} />)} />
          <Route path="pages/new" element={CMS(<Lazy component={PageEdit} />)} />
          <Route path="pages/:id" element={CMS(<Lazy component={PageEdit} />)} />
          <Route path="menus" element={CMS(<Lazy component={Menus} />)} />
          <Route path="news" element={CMS(<Lazy component={NewsList} />)} />
          <Route path="news/new" element={CMS(<Lazy component={NewsEdit} />)} />
          <Route path="news/:id" element={CMS(<Lazy component={NewsEdit} />)} />
          <Route path="events" element={CMS(<EventsCrud key="list" />)} />
          <Route path="events/new" element={CMS(<EventsCrud key="new" />)} />
          <Route path="events/:id" element={CMS(<EventsCrud key="edit" />)} />
          <Route path="gallery" element={CMS(<Lazy component={GalleryList} />)} />
          <Route path="gallery/new" element={CMS(<Lazy component={GalleryEdit} />)} />
          <Route path="gallery/:id" element={CMS(<Lazy component={GalleryEdit} />)} />
          <Route path="videos" element={CMS(<VideosCrud key="list" />)} />
          <Route path="videos/new" element={CMS(<VideosCrud key="new" />)} />
          <Route path="videos/:id" element={CMS(<VideosCrud key="edit" />)} />
          <Route path="downloads" element={CMS(<DownloadsCrud key="list" />)} />
          <Route path="downloads/new" element={CMS(<DownloadsCrud key="new" />)} />
          <Route path="downloads/:id" element={CMS(<DownloadsCrud key="edit" />)} />
          <Route path="faq" element={CMS(<FaqCrud key="list" />)} />
          <Route path="faq/new" element={CMS(<FaqCrud key="new" />)} />
          <Route path="faq/:id" element={CMS(<FaqCrud key="edit" />)} />
          <Route path="achievements" element={CMS(<AchievementsCrud key="list" />)} />
          <Route path="achievements/new" element={CMS(<AchievementsCrud key="new" />)} />
          <Route path="achievements/:id" element={CMS(<AchievementsCrud key="edit" />)} />
          <Route path="clubs" element={CMS(<ClubsCrud key="list" />)} />
          <Route path="clubs/new" element={CMS(<ClubsCrud key="new" />)} />
          <Route path="clubs/:id" element={CMS(<ClubsCrud key="edit" />)} />
          <Route path="sports" element={CMS(<SportsCrud key="list" />)} />
          <Route path="sports/new" element={CMS(<SportsCrud key="new" />)} />
          <Route path="sports/:id" element={CMS(<SportsCrud key="edit" />)} />
          <Route path="staff" element={CMS(<StaffCrud key="list" />)} />
          <Route path="staff/new" element={CMS(<StaffCrud key="new" />)} />
          <Route path="staff/:id" element={CMS(<StaffCrud key="edit" />)} />
          <Route path="departments" element={CMS(<DepartmentsCrud key="list" />)} />
          <Route path="departments/new" element={CMS(<DepartmentsCrud key="new" />)} />
          <Route path="departments/:id" element={CMS(<DepartmentsCrud key="edit" />)} />
          <Route path="academics" element={CMS(<ProgramsCrud key="list" />)} />
          <Route path="academics/new" element={CMS(<ProgramsCrud key="new" />)} />
          <Route path="academics/:id" element={CMS(<ProgramsCrud key="edit" />)} />
          <Route path="fees" element={CMS(<FeesCrud key="list" />)} />
          <Route path="fees/new" element={CMS(<FeesCrud key="new" />)} />
          <Route path="fees/:id" element={CMS(<FeesCrud key="edit" />)} />
          <Route path="calendar" element={CMS(<CalendarCrud key="list" />)} />
          <Route path="calendar/new" element={CMS(<CalendarCrud key="new" />)} />
          <Route path="calendar/:id" element={CMS(<CalendarCrud key="edit" />)} />
          <Route path="media" element={CMS(<Lazy component={MediaLibrary} />)} />
          <Route path="seo" element={CMS(<Lazy component={Seo} />)} />
          <Route path="contact-messages" element={CMS(<Lazy component={ContactMessages} />)} />
          <Route path="settings" element={CMS(<Lazy component={Settings} />)} />
          <Route path="notices" element={CMS(<NoticesCrud key="list" />)} />
          <Route path="notices/new" element={CMS(<NoticesCrud key="new" />)} />
          <Route path="notices/:id" element={CMS(<NoticesCrud key="edit" />)} />
          <Route path="applications" element={CMS(<ApplicationsCrud key="list" />)} />
          <Route path="applications/new" element={CMS(<ApplicationsCrud key="new" />)} />
          <Route path="applications/:id" element={CMS(<ApplicationsCrud key="edit" />)} />
          <Route path="library" element={CMS(<LibraryCrud key="list" />)} />
          <Route path="library/new" element={CMS(<LibraryCrud key="new" />)} />
          <Route path="library/:id" element={CMS(<LibraryCrud key="edit" />)} />
          <Route path="magazine" element={CMS(<MagazineCrud key="list" />)} />
          <Route path="magazine/new" element={CMS(<MagazineCrud key="new" />)} />
          <Route path="magazine/:id" element={CMS(<MagazineCrud key="edit" />)} />
          <Route path="vacancies" element={CMS(<VacanciesCrud key="list" />)} />
          <Route path="vacancies/new" element={CMS(<VacanciesCrud key="new" />)} />
          <Route path="vacancies/:id" element={CMS(<VacanciesCrud key="edit" />)} />
          <Route path="job-applications" element={CMS(<JobApplicationsCrud key="list" />)} />
          <Route path="job-applications/new" element={CMS(<JobApplicationsCrud key="new" />)} />
          <Route path="job-applications/:id" element={CMS(<JobApplicationsCrud key="edit" />)} />
          <Route path="feedback" element={CMS(<FeedbackCrud key="list" />)} />
          <Route path="feedback/new" element={CMS(<FeedbackCrud key="new" />)} />
          <Route path="feedback/:id" element={CMS(<FeedbackCrud key="edit" />)} />
          <Route path="testimonials" element={CMS(<TestimonialsCrud key="list" />)} />
          <Route path="testimonials/new" element={CMS(<TestimonialsCrud key="new" />)} />
          <Route path="testimonials/:id" element={CMS(<TestimonialsCrud key="edit" />)} />
          <Route path="newsletter-subscribers" element={CMS(<NewsletterSubscribersCrud key="list" />)} />
          <Route path="newsletter-subscribers/new" element={CMS(<NewsletterSubscribersCrud key="new" />)} />
          <Route path="newsletter-subscribers/:id" element={CMS(<NewsletterSubscribersCrud key="edit" />)} />
          <Route path="newsletter-campaigns" element={CMS(<NewsletterCampaignsCrud key="list" />)} />
          <Route path="newsletter-campaigns/new" element={CMS(<NewsletterCampaignsCrud key="new" />)} />
          <Route path="newsletter-campaigns/:id" element={CMS(<NewsletterCampaignsCrud key="edit" />)} />
          <Route path="campus" element={CMS(<CampusLocationsCrud key="list" />)} />
          <Route path="campus/new" element={CMS(<CampusLocationsCrud key="new" />)} />
          <Route path="campus/:id" element={CMS(<CampusLocationsCrud key="edit" />)} />
          <Route path="tour" element={CMS(<TourScenesCrud key="list" />)} />
          <Route path="tour/new" element={CMS(<TourScenesCrud key="new" />)} />
          <Route path="tour/:id" element={CMS(<TourScenesCrud key="edit" />)} />
          <Route path="emergency" element={CMS(<EmergencyAlertsCrud key="list" />)} />
          <Route path="emergency/new" element={CMS(<EmergencyAlertsCrud key="new" />)} />
          <Route path="emergency/:id" element={CMS(<EmergencyAlertsCrud key="edit" />)} />
          <Route path="event-registrations" element={CMS(<EventRegistrationsCrud key="list" />)} />
          <Route path="event-registrations/new" element={CMS(<EventRegistrationsCrud key="new" />)} />
          <Route path="event-registrations/:id" element={CMS(<EventRegistrationsCrud key="edit" />)} />
          <Route path="stats" element={CMS(<StatsCrud key="list" />)} />
          <Route path="stats/new" element={CMS(<StatsCrud key="new" />)} />
          <Route path="stats/:id" element={CMS(<StatsCrud key="edit" />)} />
          <Route path="audit" element={CMS(<Lazy component={AuditLog} />)} />
          <Route path="versions" element={CMS(<Lazy component={Versions} />)} />
          <Route path="health" element={CMS(<Lazy component={SystemHealth} />)} />
          <Route path="consistency" element={CMS(<Lazy component={SystemHealth} />)} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
