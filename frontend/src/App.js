import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import LenisProvider from "@/components/site/LenisProvider";
import ScrollToTop from "@/components/site/ScrollToTop";
import Navigation from "@/components/site/Navigation";
import Footer from "@/components/site/Footer";
import ProtectedRoute from "@/components/site/ProtectedRoute";
import Preloader from "@/components/site/Preloader";
import ScrollProgress from "@/components/site/ScrollProgress";
import TopContactBar from "@/components/site/TopContactBar";
import MobileBottomBar from "@/components/site/MobileBottomBar";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import PortfolioPage from "@/pages/PortfolioPage";
import PortfolioDetailPage from "@/pages/PortfolioDetailPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import ContactPage from "@/pages/ContactPage";

import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminPortfolio from "@/pages/admin/AdminPortfolio";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminContacts from "@/pages/admin/AdminContacts";

function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <LenisProvider>
            <Preloader />
            <ScrollProgress />
            <ScrollToTop />
            <TopContactBar />
            <Navigation />
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
            <Footer />
            <MobileBottomBar />
            <Toaster theme="dark" position="bottom-right" />
          </LenisProvider>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}

export default App;
