import AuthorBio from "./components/AuthorBio";
import CTABanner from "./components/CTABanner";
import FeaturedPosts from "./components/FeaturedPost";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturedPosts />
      <Testimonials />
      <AuthorBio />
      <CTABanner />
      <Footer />
    </div>
  );
}
