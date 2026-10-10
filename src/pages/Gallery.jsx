import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "../CSS/Gallery.css";

/**
 * IMAGES Object - Gallery Images Configuration
 *
 * Structure:
 * {
 *   personal: [...],      // Personal photos and moments
 *   projects: [...],      // Project-related photos (demos, team, events)
 *   achievements: [...]   // Awards, certifications, recognitions
 * }
 *
 * Each entry format:
 * {
 *   id: 'unique-id',           // Unique identifier (used for React keys)
 *   caption: 'Photo caption',  // Human-readable caption
 *   photos: ['path/to/img1', 'path/to/img2']  // Array of image paths for multi-photo posts
 * }
 *
 * HOW TO ADD MANUAL ENTRIES:
 * Add a new object to any category:
 * {
 *   id: 'my-photo-001',
 *   caption: 'My Amazing Photo',
 *   photos: ['/gallery/personal/photo.jpg']  // or multiple photos
 * }
 *
 * AUTO-GENERATED IMAGES:
 * New images are organized automatically when you run:
 *   npm run build:portfolio
 * or during: npm run build
 *
 * The build script:
 * 1. Scans workspace root for image files (.jpg, .jpeg, .png, .gif, .webp)
 * 2. Categorizes images by keyword matching in filename
 * 3. Moves images to public/gallery/{category}/ directories
 * 4. Generates captions from filenames
 * 5. Updates this IMAGES object with new entries
 *
 * Categorization keywords:
 * - achievements: "achievement", "award", "top", "captain", "selection", "finalist",
 *                 "finale", "cloud", "quest", "level", "kiro", "grand"
 * - projects: "project", "temp jam", "jam"
 * - personal: "personal", "photo", "selfie", "moment", "me", "meetup", "recap",
 *             "notification", "announcement", "leader", "advisor", "campus", "notion"
 */
const IMAGES = {
  personal: [
    { id: 'build_your_2026_team_photo', caption: 'Build Your 2026 Team Photo', photos: ["/gallery/personal/Build your 2026 team photo.jpeg"] },
    { id: 'notion_campus_leaders_meetupp', caption: 'Notion Campus Leaders Meetupp', photos: ["/gallery/personal/Notion CAmpus Leaders Meetupp.jpeg"] },
    { id: 'notion_comsast_lahore_team_meetup', caption: 'Notion COMSAST Lahore Team Meetup', photos: ["/gallery/personal/Notion COMSAST Lahore Team Meetup.jpeg"] },
    { id: 'notion_comsats_lahore_meetup_selfie', caption: 'Notion COMSATS Lahore Meetup Selfie', photos: ["/gallery/personal/Notion COMSATS Lahore meetup Selfie.jpeg"] },
    { id: 'notion_campus_lead_x_senior_advisor', caption: 'Notion Campus Lead X Senior Advisor', photos: ["/gallery/personal/Notion Campus Lead x Senior Advisor.jpeg"] },
    { id: 'notion_campuus_leader_announcement', caption: 'Notion Campuus Leader Announcement', photos: ["/gallery/personal/Notion Campuus Leader Announcement.png"] },
    { id: 'one_year_recap_as_notion', caption: 'One Year Recap As Notion', photos: ["/gallery/personal/One Year Recap as Notion.png"] },
    { id: 'df', caption: 'Df', photos: ["/gallery/personal/df.png"] }
  ],
  projects: [
    { id: 'temp_jam_3_0_pic_2', caption: 'Temp Jam 3.0 Pic 2', photos: ["/gallery/projects/Temp Jam 3.0 Pic 2.jpeg"] },
    { id: 'temp_jam_3_0_pic', caption: 'Temp Jam 3.0 Pic', photos: ["/gallery/projects/Temp Jam 3.0 Pic.jpeg"] }
  ],
  achievements: [
    { id: 'aws_cloud_club_captain_selection', caption: 'AWS Cloud Club Captain Selection', photos: ["/gallery/achievements/AWS Cloud Club Captain Selection.png"] },
    { id: 'build_with_kiro_2026_grand_finale_group_photo', caption: 'Build With Kiro 2026 Grand Finale Group Photo', photos: ["/gallery/achievements/Build with Kiro 2026 Grand FInale Group Photo.jpeg"] },
    { id: 'cloud_quest_level_3_team_photo', caption: 'Cloud Quest Level 3 Team Photo', photos: ["/gallery/achievements/Cloud Quest Level 3 Team Photo.jpg"] },
    { id: 'kirothon_the_finale_team_group_photo', caption: 'Kirothon The Finale Team Group Photo', photos: ["/gallery/achievements/Kirothon The Finale Team Group Photo.jpg"] },
    { id: 'start_your_journey_in_cloud_computing', caption: 'Start Your Journey In Cloud Computing', photos: ["/gallery/achievements/Start your journey in Cloud Computing.png"] },
    { id: 'top_5_on_topmate', caption: 'Top 5% On Topmate', photos: ["/gallery/achievements/Top 5% on Topmate.jpg"] }
  ],
};

// ✨ Animation Variants
const pageVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ✨ Tab Switching Animations
const tabContentVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.4 } },
};

export default function Gallery() {
  const [tab, setTab] = useState("personal");
  const [zoom, setZoom] = useState({ img: null, post: null, index: 0 });

  const openZoom = (post, index) =>
    setZoom({ img: post.photos[index], post, index });

  const closeZoom = () => setZoom({ img: null, post: null, index: 0 });

  const nextImage = () => {
    if (!zoom.post) return;
    const nextIndex = (zoom.index + 1) % zoom.post.photos.length;
    setZoom({ ...zoom, img: zoom.post.photos[nextIndex], index: nextIndex });
  };

  const prevImage = () => {
    if (!zoom.post) return;
    const prevIndex =
      (zoom.index - 1 + zoom.post.photos.length) % zoom.post.photos.length;
    setZoom({ ...zoom, img: zoom.post.photos[prevIndex], index: prevIndex });
  };

  return (
    <motion.section
      className="gallery-container"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* 🌟 Title */}
      <motion.h2 className="gallery-title" variants={childVariants}>
        Gallery
      </motion.h2>

      {/* 🧭 Tabs */}
      <motion.div className="tab-buttons" variants={childVariants}>
        {["personal", "projects", "achievements"].map((type) => (
          <motion.button
            key={type}
            className={`tab ${tab === type ? "active" : ""}`}
            onClick={() => setTab(type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* 🖼️ Posts with Animation on Tab Switch */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab} // Important for AnimatePresence to detect tab change
          className="post-feed"
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {IMAGES[tab].length === 0 && (
            <motion.p
              className="muted"
              variants={childVariants}
              style={{ textAlign: "center", color: "#aaa", padding: "40px 0" }}
            >
              Nothing here yet — photos coming soon.
            </motion.p>
          )}
          {IMAGES[tab].map((post) => (
            <motion.div
              key={post.id}
              className="post-card"
              variants={childVariants}
              whileHover={{ y: -4 }}
            >
              <p className="caption">{post.caption}</p>
              <div
                className={`photo-grid ${
                  post.photos.length > 1 ? "multi" : "single"
                }`}
              >
                {post.photos.map((src, i) => (
                  <motion.div
                    key={i}
                    className="photo-item"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 250 }}
                    onClick={() => openZoom(post, i)}
                  >
                    <img src={src} alt="gallery" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 🔍 Zoom Overlay */}
      <AnimatePresence>
        {zoom.img && (
          <motion.div
            className="zoom-overlay"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
          >
            <motion.img
              key={zoom.img}
              src={zoom.img}
              alt="zoom"
              className="zoom-img"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {zoom.post?.photos.length > 1 && (
              <>
                <button className="nav-btn left" onClick={prevImage}>
                  <ChevronLeft size={32} />
                </button>
                <button className="nav-btn right" onClick={nextImage}>
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <button className="close-btn" onClick={closeZoom}>
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
