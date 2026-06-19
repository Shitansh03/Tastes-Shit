import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Check,
  Clock,
  ListChecks,
  ChefHat,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipe } from "../api/recipeApi";
import { useCategories } from "../hooks/useCategories";
import toast from "react-hot-toast";

const STEPS = ["Details", "Ingredients", "Steps", "Media", "Publish"];

const CreateRecipe = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    cookingTime: "",
    difficulty: "Medium",
    ingredients: [""],
    instructions: [""],
    image: null,
    video: null,
  });

  const imageRef = useRef();
  const videoRef = useRef();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => createRecipe(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Recipe published!");
      navigate("/recipes");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create recipe");
    },
  });

  const handleNext = () => {
    if (step === 0) {
      if (!form.title || !form.description || !form.category || !form.cookingTime)
        return toast.error("Please fill all fields");
    }
    if (step === 1) {
      if (form.ingredients.some((i) => !i.trim()))
        return toast.error("Remove empty ingredients");
    }
    if (step === 2) {
      if (form.instructions.some((i) => !i.trim()))
        return toast.error("Remove empty steps");
    }
    if (step === 3) {
      if (!form.image) return toast.error("Recipe image is required");
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("category", form.category);
    fd.append("cookingTime", form.cookingTime);
    fd.append("difficulty", form.difficulty);
    form.ingredients.filter(Boolean).forEach((i) => fd.append("ingredients", i));
    form.instructions.filter(Boolean).forEach((i) => fd.append("instructions", i));
    if (form.image) fd.append("image", form.image);
    if (form.video) fd.append("video", form.video);
    mutate(fd);
  };

  const addItem = (field) => setForm({ ...form, [field]: [...form[field], ""] });
  const removeItem = (field, i) =>
    setForm({ ...form, [field]: form[field].filter((_, idx) => idx !== i) });
  const updateItem = (field, i, val) => {
    const arr = [...form[field]];
    arr[i] = val;
    setForm({ ...form, [field]: arr });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Create Recipe</h1>

        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${i < step
                    ? "bg-yellow-500 text-black"
                    : i === step
                      ? "border-2 border-yellow-500 text-yellow-500"
                      : "border border-zinc-700 text-zinc-600"
                    }`}
                >
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-[10px] ${i === step ? "text-yellow-500" : "text-zinc-600"}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mb-4 transition ${i < step ? "bg-yellow-500" : "bg-zinc-800"}`} />
              )}
            </div>
          ))}
        </div>
      </div>


      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Recipe Details</h2>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Recipe Title</label>
              <input
                type="text"
                placeholder="Enter recipe title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition placeholder:text-zinc-600 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Short Description</label>
              <textarea
                placeholder="Describe your recipe in a few words..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                maxLength={150}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition placeholder:text-zinc-600 text-sm resize-none"
              />
              <p className="text-xs text-zinc-600 text-right mt-1">{form.description.length}/150</p>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition text-sm"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Cooking Time (min)</label>
                <select
                  value={form.cookingTime}
                  onChange={(e) => setForm({ ...form, cookingTime: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition text-sm"
                >
                  <option value="">Select time</option>
                  {[15, 20, 30, 45, 60, 90, 120].map((t) => (
                    <option key={t} value={t}>{t} min</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Difficulty Level</label>
                <div className="flex gap-2">
                  {["Easy", "Medium", "Hard"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm({ ...form, difficulty: d })}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${form.difficulty === d
                        ? d === "Easy"
                          ? "bg-green-500/20 text-green-400 border border-green-500/50"
                          : d === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                            : "bg-red-500/20 text-red-400 border border-red-500/50"
                        : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Ingredients</h2>
            <div className="space-y-3">
              {form.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Ingredient ${i + 1} (e.g. 2 cups Basmati Rice)`}
                    value={ing}
                    onChange={(e) => updateItem("ingredients", i, e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition placeholder:text-zinc-600 text-sm"
                  />
                  {form.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem("ingredients", i)}
                      className="w-10 h-10 mt-1 flex items-center justify-center rounded-xl border border-zinc-800 text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addItem("ingredients")}
              className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 text-sm font-medium transition"
            >
              <Plus size={16} />
              Add Ingredient
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Cooking Steps</h2>
            <div className="space-y-3">
              {form.instructions.map((ins, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 mt-2 shrink-0 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <textarea
                      placeholder={`Step ${i + 1}...`}
                      value={ins}
                      onChange={(e) => updateItem("instructions", i, e.target.value)}
                      rows={2}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition placeholder:text-zinc-600 text-sm resize-none"
                    />
                    {form.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem("instructions", i)}
                        className="w-10 h-10 mt-1 flex items-center justify-center rounded-xl border border-zinc-800 text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addItem("instructions")}
              className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 text-sm font-medium transition"
            >
              <Plus size={16} />
              Add Step
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Media</h2>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Recipe Image <span className="text-red-400">*</span>
              </label>
              <input ref={imageRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
              <div
                onClick={() => imageRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 hover:border-yellow-500/50 rounded-2xl p-8 text-center cursor-pointer transition group"
              >
                {form.image ? (
                  <div className="flex items-center justify-center gap-3">
                    <img src={URL.createObjectURL(form.image)} alt="" className="w-20 h-20 object-cover rounded-xl" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-green-400">Image selected</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{form.image.name}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={32} className="text-zinc-600 mx-auto mb-3 group-hover:text-yellow-500/60 transition" />
                    <p className="text-sm text-zinc-500">Click to upload recipe image</p>
                    <p className="text-xs text-zinc-700 mt-1">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Recipe Video <span className="text-zinc-600 text-xs">(optional)</span>
              </label>
              <input ref={videoRef} type="file" accept="video/*" className="hidden"
                onChange={(e) => setForm({ ...form, video: e.target.files[0] })} />
              <div
                onClick={() => videoRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 hover:border-yellow-500/50 rounded-2xl p-6 text-center cursor-pointer transition group"
              >
                {form.video ? (
                  <p className="text-sm text-green-400 flex items-center justify-center gap-1.5">
                    <Check size={14} /> {form.video.name}
                  </p>
                ) : (
                  <>
                    <Video size={28} className="text-zinc-600 mx-auto mb-2 group-hover:text-yellow-500/60 transition" />
                    <p className="text-sm text-zinc-500">Click to upload recipe video</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-lg">Ready to Publish?</h2>
            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
              {form.image && (
                <img src={URL.createObjectURL(form.image)} alt="" className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{form.title}</h3>
                <p className="text-zinc-500 text-sm mt-1">{form.description}</p>
                <div className="flex gap-4 mt-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {form.cookingTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <ListChecks size={12} /> {form.ingredients.filter(Boolean).length} ingredients
                  </span>
                  <span className="flex items-center gap-1">
                    <ChefHat size={12} /> {form.instructions.filter(Boolean).length} steps
                  </span>
                </div>
              </div>
            </div>
            <p className="text-zinc-500 text-sm">Your recipe will be visible to all users once published.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="flex items-center gap-2 border border-zinc-700 px-5 py-3 rounded-xl text-sm font-medium hover:border-zinc-500 transition disabled:opacity-30"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Next: {STEPS[step + 1]}
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-60"
          >
            {isPending ? "Publishing..." : "Publish Recipe"}
            <Upload size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateRecipe;