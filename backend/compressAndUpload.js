/**
 * compressAndUpload.js
 *
 * Local images → uploadToCloudinary() [Sharp compression inside] → MongoDB update
 *
 * Run: node compressAndUpload.js
 * Dry run: node compressAndUpload.js --dry-run
 * Single category: node compressAndUpload.js --category Italian
 */

require("dotenv").config();

const fs         = require("fs");
const path       = require("path");
const mongoose   = require("mongoose");
const uploadToCloudinary = require("./utils/uploadToCloudinary"); // already has Sharp inside

// ─── Config ───────────────────────────────────────────────────────────────────
const IMAGES_BASE_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE,
  "Pictures",
  "Tastes-Shit"
);
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// ─── CLI Args ─────────────────────────────────────────────────────────────────
const args          = process.argv.slice(2);
const DRY_RUN       = args.includes("--dry-run");
const ONLY_CATEGORY = (() => {
  const i = args.indexOf("--category");
  return i !== -1 ? args[i + 1] : null;
})();

// ─── Models ───────────────────────────────────────────────────────────────────
const Category = mongoose.models.Category ||
  mongoose.model("Category", new mongoose.Schema({ name: String }));

const Recipe = mongoose.models.Recipe ||
  mongoose.model("Recipe", new mongoose.Schema({
    title:          String,
    image:          String,
    isSystemRecipe: Boolean,
    category:       { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  }), "recipes");

// ─── Helper ───────────────────────────────────────────────────────────────────
function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function findRecipe(title, categoryId) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    await Recipe.findOne({ title: { $regex: `^${escaped}$`, $options: "i" }, isSystemRecipe: true, category: categoryId }) ||
    await Recipe.findOne({ title: { $regex: `^${escaped}$`, $options: "i" }, isSystemRecipe: true })
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🍳 Chef's Vault — Upload Script");
  console.log("=".repeat(50));
  console.log(`📁 Source : ${IMAGES_BASE_DIR}`);
  console.log(`🔍 Mode   : ${DRY_RUN ? "DRY RUN" : "LIVE UPLOAD"}`);
  if (ONLY_CATEGORY) console.log(`📂 Category: ${ONLY_CATEGORY} only`);
  console.log("=".repeat(50) + "\n");

  if (!fs.existsSync(IMAGES_BASE_DIR)) {
    console.error(`❌ Folder not found: ${IMAGES_BASE_DIR}`);
    process.exit(1);
  }

  process.stdout.write("🔌 Connecting to MongoDB... ");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅\n");

  const folders = fs.readdirSync(IMAGES_BASE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((f) => ONLY_CATEGORY ? f.toLowerCase() === ONLY_CATEGORY.toLowerCase() : true);

  let uploaded = 0, dbUpdated = 0, noMatch = 0, failed = 0;
  let totalOriginal = 0, totalUploaded = 0;

  for (const folderName of folders) {
    console.log(`\n📂 ${folderName}`);
    console.log("─".repeat(45));

    const categoryDoc = await Category.findOne({ name: { $regex: `^${folderName}$`, $options: "i" } });
    if (!categoryDoc) {
      console.log(`  ⚠️  "${folderName}" not found in DB — skipping`);
      continue;
    }

    const folderPath = path.join(IMAGES_BASE_DIR, folderName);
    const files = fs.readdirSync(folderPath)
      .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));

    for (const file of files) {
      const title       = path.parse(file).name;
      const filePath    = path.join(folderPath, file);
      const originalBuf = fs.readFileSync(filePath);
      totalOriginal    += originalBuf.length;

      console.log(`  🖼️  "${title}" — ${formatSize(originalBuf.length)}`);

      if (DRY_RUN) {
        console.log(`       [DRY RUN] Would upload → recipes/system/${folderName.toLowerCase()}/\n`);
        continue;
      }

      try {
        // uploadToCloudinary already has Sharp compression inside — just call it
        const result = await uploadToCloudinary(
          originalBuf,
          `recipes/system/${folderName.toLowerCase()}`
          // type defaults to "image" — Sharp runs automatically
        );
        uploaded++;
        totalUploaded += result.bytes || 0;
        console.log(`       ✅ Uploaded → ${result.secure_url.split("/").slice(-2).join("/")}`);

        const recipe = await findRecipe(title, categoryDoc._id);
        if (recipe) {
          await Recipe.findByIdAndUpdate(recipe._id, { image: result.secure_url });
          dbUpdated++;
          console.log(`       📝 DB updated: "${recipe.title}"\n`);
        } else {
          noMatch++;
          console.log(`       ⚠️  No DB match for "${title}"`);
          console.log(`          URL: ${result.secure_url}\n`);
        }

      } catch (err) {
        failed++;
        console.log(`       ❌ Failed: ${err.message}\n`);
      }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 SUMMARY");
  console.log("=".repeat(50));
  console.log(`☁️  Uploaded    : ${uploaded}`);
  console.log(`📝 DB updated  : ${dbUpdated}`);
  console.log(`⚠️  No match    : ${noMatch}`);
  console.log(`❌ Failed      : ${failed}`);
  console.log(`📦 Original    : ${formatSize(totalOriginal)}`);
  if (totalUploaded > 0) {
    const saved = Math.round((1 - totalUploaded / totalOriginal) * 100);
    console.log(`🗜️  Uploaded    : ${formatSize(totalUploaded)} (${saved}% smaller)`);
  }
  console.log("=".repeat(50) + "\n");

  if (noMatch > 0) {
    console.log(`⚠️  ${noMatch} images uploaded but no DB recipe matched.`);
    console.log("   Filename must match recipe title exactly (case-insensitive).\n");
  }

  await mongoose.disconnect();
  console.log("✅ Done!\n");
}

main().catch((err) => {
  console.error("❌ FATAL:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
