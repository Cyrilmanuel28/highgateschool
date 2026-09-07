import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout.jsx'
import ContentPage from './components/ContentPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import NewsIndex from './pages/NewsIndex.jsx'
import NewsArticlePage from './pages/NewsArticlePage.jsx'
import EventsIndex from './pages/EventsIndex.jsx'
import EventDetail from './pages/EventDetail.jsx'
import GalleryIndex from './pages/GalleryIndex.jsx'
import GalleryAlbumPage from './pages/GalleryAlbumPage.jsx'
import Videos from './pages/Videos.jsx'
import StaffDirectory from './pages/StaffDirectory.jsx'
import StaffProfile from './pages/StaffProfile.jsx'
import Departments from './pages/Departments.jsx'
import DepartmentDetail from './pages/DepartmentDetail.jsx'
import Fees from './pages/Fees.jsx'
import Calendar from './pages/Calendar.jsx'
import Downloads from './pages/Downloads.jsx'
import DownloadsByCategory from './pages/DownloadsByCategory.jsx'
import Faq from './pages/Faq.jsx'
import Contact from './pages/Contact.jsx'
import Achievements from './pages/Achievements.jsx'
import Clubs from './pages/Clubs.jsx'
import Sports from './pages/Sports.jsx'
import Notices from './pages/Notices.jsx'
import Apply from './pages/Apply.jsx'
import Library from './pages/Library.jsx'
import Magazine from './pages/Magazine.jsx'
import MagazineArticle from './pages/MagazineArticle.jsx'
import Careers from './pages/Careers.jsx'
import Testimonials from './pages/Testimonials.jsx'
import Emergency from './pages/Emergency.jsx'
import CampusMap from './pages/CampusMap.jsx'
import VirtualTour from './pages/VirtualTour.jsx'
import Statistics from './pages/Statistics.jsx'
import Feedback from './pages/Feedback.jsx'
import SearchResults from './pages/SearchResults.jsx'

import Login from './pages/cms/Login.jsx'
import DashboardLayout from './pages/cms/Layout.jsx'
import DashboardHome from './pages/cms/DashboardHome.jsx'
import PagesList from './pages/cms/PagesList.jsx'
import PageEdit from './pages/cms/PageEdit.jsx'
import Menus from './pages/cms/Menus.jsx'
import NewsList from './pages/cms/NewsList.jsx'
import NewsEdit from './pages/cms/NewsEdit.jsx'
import GalleryList from './pages/cms/GalleryList.jsx'
import GalleryEdit from './pages/cms/GalleryEdit.jsx'
import MediaLibrary from './pages/cms/MediaLibrary.jsx'
import Seo from './pages/cms/Seo.jsx'
import Settings from './pages/cms/Settings.jsx'
import ContactMessages from './pages/cms/ContactMessages.jsx'
import AuditLog from './pages/cms/AuditLog.jsx'
import Versions from './pages/cms/Versions.jsx'
import SystemHealth from './pages/cms/SystemHealth.jsx'
import {
  EventsCrud, VideosCrud, DownloadsCrud, FaqCrud, AchievementsCrud, ClubsCrud, SportsCrud,
  DepartmentsCrud, ProgramsCrud, FeesCrud, CalendarCrud, StaffCrud
} from './pages/cms/EntityScreens.jsx'
import {
  NoticesCrud, ApplicationsCrud, LibraryCrud, MagazineCrud, VacanciesCrud, JobApplicationsCrud,
  FeedbackCrud, TestimonialsCrud, NewsletterSubscribersCrud, NewsletterCampaignsCrud,
  CampusLocationsCrud, TourScenesCrud, EmergencyAlertsCrud, EventRegistrationsCrud, StatsCrud
} from './pages/cms/FeatureScreens.jsx'
import HomeSectionsEdit from './pages/cms/HomeSectionsEdit.jsx'

const CMS = (el) => <ProtectedRoute>{el}</ProtectedRoute>

export default function App() {
  return (
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
        <Route path="staff" element={<StaffDirectory />} />
        <Route path="staff/:id" element={<StaffProfile />} />
        <Route path="departments" element={<Departments />} />
        <Route path="departments/:id" element={<DepartmentDetail />} />
        <Route path="fees" element={<Fees />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="news" element={<NewsIndex />} />
        <Route path="news/:slug" element={<NewsArticlePage />} />
        <Route path="events" element={<EventsIndex />} />
        <Route path="events/:slug" element={<EventDetail />} />
        <Route path="gallery" element={<GalleryIndex />} />
        <Route path="gallery/:album" element={<GalleryAlbumPage />} />
        <Route path="videos" element={<Videos />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="sports" element={<Sports />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="downloads/:category" element={<DownloadsByCategory />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
        <Route path="notices" element={<Notices />} />
        <Route path="apply" element={<Apply />} />
        <Route path="library" element={<Library />} />
        <Route path="magazine" element={<Magazine />} />
        <Route path="magazine/:slug" element={<MagazineArticle />} />
        <Route path="careers" element={<Careers />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="campus-map" element={<CampusMap />} />
        <Route path="virtual-tour" element={<VirtualTour />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="search" element={<SearchResults />} />
        <Route path=":slug" element={<ContentPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={CMS(<DashboardLayout />)}>
        <Route index element={CMS(<DashboardHome />)} />
        <Route path="home-sections" element={CMS(<HomeSectionsEdit />)} />
        <Route path="pages" element={CMS(<PagesList key="list" />)} />
        <Route path="pages/new" element={CMS(<PageEdit key="new" />)} />
        <Route path="pages/:id" element={CMS(<PageEdit key="edit" />)} />
        <Route path="menus" element={CMS(<Menus />)} />
        <Route path="news" element={CMS(<NewsList key="list" />)} />
        <Route path="news/new" element={CMS(<NewsEdit key="new" />)} />
        <Route path="news/:id" element={CMS(<NewsEdit key="edit" />)} />
        <Route path="events" element={CMS(<EventsCrud key="list" />)} />
        <Route path="events/new" element={CMS(<EventsCrud key="new" />)} />
        <Route path="events/:id" element={CMS(<EventsCrud key="edit" />)} />
        <Route path="gallery" element={CMS(<GalleryList key="list" />)} />
        <Route path="gallery/new" element={CMS(<GalleryEdit key="new" />)} />
        <Route path="gallery/:id" element={CMS(<GalleryEdit key="edit" />)} />
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
        <Route path="media" element={CMS(<MediaLibrary />)} />
        <Route path="seo" element={CMS(<Seo />)} />
        <Route path="contact-messages" element={CMS(<ContactMessages />)} />
        <Route path="settings" element={CMS(<Settings />)} />
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
        <Route path="audit" element={CMS(<AuditLog />)} />
        <Route path="versions" element={CMS(<Versions />)} />
        <Route path="health" element={CMS(<SystemHealth />)} />
        <Route path="consistency" element={CMS(<SystemHealth />)} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
