import "@/index.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
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
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminPortfolio = lazy(() => import("@/pages/admin/AdminPortfolio"));
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog"));
const AdminContacts = lazy(() => import("@/pages/admin/AdminContacts"));

function RouteFallback() {
  return (
    <main className="min-h-[55vh] grid place-items-center bg-ink-900" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3 text-white/55 font-ui text-sm">
        <span className="w-2 h-2 rounded-full bg-orange_impact animate-pulse" aria-hidden="true" />
        <span>Loading page…</span>
      </div>
    </main>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
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
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogDetailPage />} />
                    <Route path="/journal" element={<Navigate to="/blog" replace />} />
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
                    <Route path="*" element={<NotFoundPage />} />
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
    </MotionConfig>
  );
}

export default App;
