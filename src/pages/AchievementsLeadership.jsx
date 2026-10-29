import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Achievements & Leadership data
// No scans are attached right now — each entry is text only, so the cards render
// without an image or a "View" button. To bring an image back for a single card,
// add `img: "/certs/your-file.png"` to that entry; the card image and its "View"
// preview button will start rendering again automatically.
const ACHIEVEMENTS = {
  achievements: [
    {
      title: "Postman Student Expert",
      org: "Postman",
      date: "2024",
    },
    {
      title: "Super Contributor",
      org: "Hacktoberfest",
      date: "2025",
    },
    {
      title: "CS50x Intro to Computer Science",
      org: "Harvard University",
      date: "2024",
    },
    {
      title: "Google Arcade Champion",
      org: "Google Cloud",
      date: "2024",
    },
    {
      title: "Neo4j Certified Professional",
      org: "Neo4j",
      date: "2025",
    },
    {
      title: "ALP Alumni",
      org: "Harvard University",
      date: "2025",
    },
    {
      title: "GWR Official Attempt",
      org: "Guinness World Records",
      date: "2025",
    },
    {
      title: "Assistant Chief Graphic Designer",
      org: "National Youth Leadership Program",
      date: "2025",
    },
    {
      title: "Nestle E-Learning License",
      org: "Nestle",
      date: "2025",
    },
    {
      title: "Campus Ambassador Three Zero Policy Hackathon",
      org: "Southeast Business Innovation Forum Bangladesh",
      date: "2025",
    },
  ],
  leadership: [
    {
      title: "AWS Student Builder Group Captain",
      org: "COMSATS University Islamabad, Lahore",
      date: "2024-Present",
      desc: "Leading AWS cloud initiatives, workshops, and mentoring students in serverless architecture and cloud engineering."
    },
    {
      title: "Notion Campus Lead",
      org: "COMSATS University Islamabad, Lahore",
      date: "2023-Present",
      desc: "Organizing community events, workshops, and fostering collaboration among tech enthusiasts and students."
    },
    {
      title: "Global Youth Ambassador",
      org: "Theirworld",
      date: "2025",
      desc: "Representing global youth initiatives and promoting education and development programs."
    },
    {
      title: "Best Personality Award",
      org: "Iqbal Hostel GCU Lahore",
      date: "2023",
      desc: "Recognized for outstanding leadership, teamwork, and community engagement."
    },
    {
      title: "Member and Hostel Coordinator",
      org: "Blood Donation Society GCU Lahore",
      date: "2023",
      desc: "Coordinating blood donation drives and managing community health initiatives."
    },
    {
      title: "Senior Coordinator",
      org: "Doctor Sultan Society Biology GCU Lahore",
      date: "2023",
      desc: "Leading biology-focused academic and community projects."
    },
    {
      title: "Ambassador",
      org: "Youth Nourishment Society GCU Lahore",
      date: "2023",
      desc: "Promoting youth wellness and nutrition awareness in the community."
    },
    {
      title: "Blood Bank Campaign Organizer",
      org: "Blood Donation Society GCU Lahore",
      date: "2022",
      desc: "Organizing large-scale blood donation campaigns and awareness programs."
    },
  ],
};

export default function AchievementsLeadership() {
  const [tab, setTab] = useState("achievements");
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section className="container" style={{ padding: "40px 0" }}>
      <div className="card" style={{ background: "#0B0F14", borderRadius: 12, padding: 24, border: "1px solid #1F2937" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#FF8A00", marginBottom: 4 }}>🏆 Achievements & Leadership</h2>
        <p className="lead" style={{ color: "#E5E7EB" }}>
          Explore my achievements, certifications, and leadership roles in the tech community.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {["achievements", "leadership"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "tab active" : "tab"}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: tab === t ? "#FF8A00" : "#1F2937",
                color: tab === t ? "#0B0F14" : "#E5E7EB",
                fontWeight: 500,
                transition: "0.3s",
              }}
            >
              {t === "achievements" ? "🏅 Achievements & Certifications" : "👥 Leadership Roles"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className="items-grid"
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          <AnimatePresence mode="wait">
            {ACHIEVEMENTS[tab].map((item, idx) => (
              <motion.div
                key={item.title}
                className="item card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 15px rgba(255, 138, 0, 0.4)",
                }}
                style={{
                  background: "#1F2937",
                  borderRadius: 12,
                  padding: 16,
                  color: "#E5E7EB",
                  border: "1px solid rgba(255, 138, 0, 0.1)",
                }}
              >
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: 160,
                      borderRadius: 10,
                      objectFit: "cover",
                      marginBottom: 12,
                    }}
                  />
                )}
                <strong style={{ fontSize: 16, color: "#FF8A00" }}>{item.title}</strong>
                <div className="muted" style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>
                  {item.org} • {item.date}
                </div>
                {item.desc && (
                  <p style={{ fontSize: 12, color: "#ccc", marginTop: 8, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                )}

                {item.img && (
                  <div style={{ marginTop: 12 }}>
                    <button
                      className="btn"
                      onClick={() => setSelectedItem(item)}
                      style={{
                        background: "#FF8A00",
                        border: "none",
                        color: "#0B0F14",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      View
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Preview */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.img
              src={selectedItem.img}
              alt={selectedItem.title}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                maxWidth: "90%",
                maxHeight: "85%",
                borderRadius: 10,
                boxShadow: "0 0 25px rgba(255,255,255,0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
