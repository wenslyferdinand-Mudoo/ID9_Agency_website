import "@/index.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import LenisProvider from "@/components/site/LenisProvider";
import ScrollToTop from "@/components/site/ScrollToTop";
import RouteSeo from "@/components/site/RouteSeo";
import Navigation from "@/components/site/Navigation";
import Footer from "@/components/site/Footer";
import ProtectedRoute from "@/components/site/ProtectedRoute";
import Preloader from "@/components/site/Preloader";
import ScrollProgress from "@/components/site/ScrollProgress";
import TopContactBar from "@/components/site/TopContactBar";
import MobileBottomBar from "@/components/site/MobileBottomBar";
import ErrorBoundary from "@/components/site/ErrorBoundary";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage"));
const PortfolioDetailPage = lazy(() => import("@/pages/PortfolioDetailPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetailPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminPortfolio = lazy(() => import("@/pages/admin/AdminPortfolio"));
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog"));
const AdminContacts = lazy(() => import("@/pages/admin/AdminContacts"));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <I18nProvider>
          <AuthProvider>
            <LenisProvider>
              <Preloader />
              <ScrollProgress />
              <ScrollToTop />
              <RouteSeo />
              <TopContactBar />
              <Navigation />
              <Suspense
                fallback={
                  <main className="min-h-[60vh] grid place-items-center px-6" role="status" aria-live="polite">
                    <span className="font-ui text-sm text-white/60">Loading ID9…</span>
                  </main>
                }
              >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminOverview />} />
                  <Route path="portfolio" element={<AdminPortfolio />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="contacts" element={<AdminContacts />} />
                </Route>
              </Routes>
              </Suspense>
              <Footer />
              <MobileBottomBar />
              <Toaster theme="dark" position="bottom-right" />
            </LenisProvider>
          </AuthProvider>
        </I18nProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
