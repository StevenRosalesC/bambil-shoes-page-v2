import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Materials from "@/components/Materials";
import CategoriesList from "@/components/CategoriesList";
import FeaturedProducts from "@/components/FeaturedProducts";
import InstagramFeed from "@/components/InstagramFeed";
import { getHomePageAction } from "@/actions/home";
import { getCategoriesAction } from "@/actions/categories";
import { getMaterialsAction } from "@/actions/materials";
import { getSocialPostsAction } from "@/actions/social-posts";
import { getFeaturedProductsAction } from "@/actions/products";

export default async function Home() {
  const [
    homeInfo,
    categoriesRes,
    materials,
    socialPosts,
    featuredProducts,
  ] = await Promise.all([
    getHomePageAction(),
    getCategoriesAction(),
    getMaterialsAction(),
    getSocialPostsAction(),
    getFeaturedProductsAction(6),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] antialiased">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Sections */}
      <main className="grow pt-18">
        {/* Hero Section */}
        <Hero data={homeInfo} />

        {/* Categories Vertical Slices */}
        <CategoriesList data={categoriesRes?.data} />

        {/* Materials Showcase */}
        <Materials data={materials} />

        {/* Featured Products Showcase */}
        <FeaturedProducts products={featuredProducts} />

        {/* Instagram/Social Proof */}
        <InstagramFeed items={socialPosts} />
      </main>
    </div>
  );
}
