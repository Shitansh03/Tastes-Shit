import TrendingRecipes from "../components/home/TrendingRecipes";
import Categories from "../components/home/Categories";
import HeroSection from "../components/home/HeroSection";

const Home = () => {
  return (
    <div className="space-y-10">
      <HeroSection />
      <TrendingRecipes />
      <Categories />
    </div>
  );
};

export default Home;
