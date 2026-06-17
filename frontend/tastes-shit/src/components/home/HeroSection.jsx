import { useNavigate } from "react-router-dom";
import { ArrowRight, Shuffle } from "lucide-react";
import heroSectionImage from "../../assets/images/hero section/hero section image.png";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-black min-h-[720px]">
      {/* Hero Image - positioned right side, NO overlays/blur, show as-is */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroSectionImage}
          alt=""
          className="absolute right-0 bottom-0 h-full w-auto object-contain"
        />
      </div>

      {/* Only a LEFT-side gradient so text is readable, right side stays fully clear */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/75 to-transparent" />

      {/* Content */}
      <div className="relative z-20 flex min-h-[720px] items-center px-14">
        <div className="max-w-[620px]">
          {/* Heading */}
          <h1
            className="text-[96px] leading-[0.9] tracking-tight font-bold"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Discover
            <br />
            Recipes that
            <br />
            <span className="text-yellow-500">Inspire</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-zinc-400 text-base md:text-lg max-w-sm leading-relaxed">
            Explore 100+ handpicked recipes from around the world.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/recipes")}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
            >
              Explore Recipes
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate("/recipes")}
              className="border border-zinc-700 hover:border-zinc-500 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-200 text-sm flex items-center gap-2"
            >
              Surprise Me
              <Shuffle size={15} />
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-black object-cover"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100+</p>
              <p className="text-xs text-zinc-500">Premium Recipes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
