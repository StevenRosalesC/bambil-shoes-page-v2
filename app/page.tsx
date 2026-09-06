import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Materials from "@/components/Materials";
import CategoriesList from "@/components/CategoriesList";
import FeaturedProducts from "@/components/FeaturedProducts";
import InstagramFeed from "@/components/InstagramFeed";


export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] antialiased">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Sections */}
      <main className="grow pt-18">
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

    </div>
  );
}
