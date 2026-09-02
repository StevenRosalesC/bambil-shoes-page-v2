import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Materials from "@/components/Materials";
import CategoriesList from "@/components/CategoriesList";
import FeaturedProducts from "@/components/FeaturedProducts";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] antialiased">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Sections */}
      <main className="flex-grow pt-[72px]">
        {/* Hero Section */}
        <Hero />
        
        {/* Categories Vertical Slices */}
        <CategoriesList />
        
        {/* Materials Showcase */}
        <Materials />
        
        {/* Featured Products Showcase */}
        <FeaturedProducts />
        
        {/* Instagram/Social Proof */}
        <InstagramFeed />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Layers */}
      <WhatsAppFAB />
      <CartDrawer />
    </div>
  );
}
