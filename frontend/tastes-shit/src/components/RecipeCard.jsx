import { Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ image, title, time, rating, id, category, chef }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => id && navigate(`/recipes/${id}`)}
      className="group overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111] cursor-pointer hover:border-yellow-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5 h-fit"
    >
      <div className="h-64 overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        {rating > 0 && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-yellow-500 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={11} fill="currentColor" />
            {typeof rating === "number" ? rating.toFixed(1) : rating}
          </div>
        )}
      </div>

      <div className="px-4 pt-3 pb-3">
        {category && (
          <p className="text-xs text-zinc-500 mb-1">{category}</p>
        )}
        <h3 className="font-semibold text-base leading-snug">{title}</h3>

        <div className="mt-3 flex justify-between text-sm text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {time} min
          </span>

          {rating > 0 && (
            <span className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
              <Star size={12} fill="currentColor" />
              {typeof rating === "number" ? rating.toFixed(1) : rating}
            </span>
          )}

          {chef && (
            <span className="text-xs text-zinc-600">by {chef}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
