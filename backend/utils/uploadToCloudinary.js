/**
 * uploadToCloudinary.js
 *
 * Real SaaS pipeline — same as Instagram/Zomato/Airbnb:
 *
 * IMAGE: Buffer → Sharp (WebP, 1600px, q85) → Cloudinary
 * VIDEO: Buffer → ffmpeg (H.264, 720p, CRF28) → Cloudinary
 *
 * Usage:
 *   const result = await uploadToCloudinary(buffer, "recipes/images");           // image
 *   const result = await uploadToCloudinary(buffer, "recipes/videos", "video");  // video
 */

const cloudinary  = require("../config/cloudinary");
const streamifier = require("streamifier");
const sharp       = require("sharp");
const ffmpeg      = require("fluent-ffmpeg");
const ffmpegPath  = require("@ffmpeg-installer/ffmpeg").path;
const os          = require("os");
const fs          = require("fs");
const path        = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

// ─── Image Compression (Sharp) ────────────────────────────────────────────────
async function compressImage(inputBuffer) {
  return await sharp(inputBuffer)
    .resize({
      width: 1600,
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();
}

// ─── Video Compression (ffmpeg) ───────────────────────────────────────────────
function compressVideo(inputBuffer) {
  return new Promise((resolve, reject) => {
    const tempIn  = path.join(os.tmpdir(), `cv_in_${Date.now()}.mp4`);
    const tempOut = path.join(os.tmpdir(), `cv_out_${Date.now()}.mp4`);

    fs.writeFileSync(tempIn, inputBuffer);

    ffmpeg(tempIn)
      .outputOptions([
        "-c:v libx264",
        "-crf 28",
        "-preset fast",
        "-vf scale='min(1280,iw)':-2",
        "-c:a aac",
        "-b:a 128k",
        "-movflags +faststart",
        "-y",
      ])
      .output(tempOut)
      .on("end", () => {
        const outputBuffer = fs.readFileSync(tempOut);
        try { fs.unlinkSync(tempIn); } catch {}
        try { fs.unlinkSync(tempOut); } catch {}
        resolve(outputBuffer);
      })
      .on("error", (err) => {
        try { fs.unlinkSync(tempIn); } catch {}
        try { fs.unlinkSync(tempOut); } catch {}
        reject(err);
      })
      .run();
  });
}

// ─── Upload Buffer to Cloudinary ─────────────────────────────────────────────
function streamUpload(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// ─── Main Export ──────────────────────────────────────────────────────────────
const uploadToCloudinary = async (fileBuffer, folder, type = "image") => {
  if (type === "video") {
    console.log("🎬 Compressing video with ffmpeg...");
    const compressedVideo = await compressVideo(fileBuffer);
    const saved = Math.round((1 - compressedVideo.length / fileBuffer.length) * 100);
    console.log(`✅ Video: ${(fileBuffer.length/1024/1024).toFixed(1)}MB → ${(compressedVideo.length/1024/1024).toFixed(1)}MB (${saved}% smaller)`);

    return await streamUpload(compressedVideo, {
      folder,
      resource_type: "video",
      format: "mp4",
    });
  } else {
    const compressedImage = await compressImage(fileBuffer);
    const saved = Math.round((1 - compressedImage.length / fileBuffer.length) * 100);
    console.log(`🖼️  Image: ${Math.round(fileBuffer.length/1024)}KB → ${Math.round(compressedImage.length/1024)}KB (${saved}% smaller)`);

    return await streamUpload(compressedImage, {
      folder,
      resource_type: "image",
      format: "webp",
    });
  }
};

module.exports = uploadToCloudinary;
