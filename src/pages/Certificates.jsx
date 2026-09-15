import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Certificates data
// No scans are attached right now — each entry is text only, so the cards render
// without an image or a "View" button. To bring an image back for a single card,
// add `img: "/certs/your-file.png"` to that entry; the card image and its "View"
// preview button will start rendering again automatically.
const CERTS = {
  tech: [
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
  other: [
    {
      title: "Global Youth Ambassador",
      org: "Theirworld",
      date: "2025",
    },
    {
      title: "Best Personality Award",
      org: "Iqbal Hostel GCU Lahore",
      date: "2023",
    },
    {
      title: "Member and Hostel Coordinator",
      org: "Blood Donation Society GCU Lahore",
      date: "2023",
    },
    {
      title: "Senior Coordinator",
      org: "Doctor Sultan Society Biology GCU Lahore",
      date: "2023",
    },
    {
      title: "Ambassador",
      org: "Youth Nourishment Society GCU Lahore",
      date: "2023",
    },
    {
      title: "Blood Bank Campaign Organizer",
      org: "Blood Donation Society GCU Lahore",
      date: "2022",
    },
  ],
};

export default function Certificates() {
  const [tab, setTab] = useState("tech");
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section className="container" style={{ padding: "40px 0" }}>
      <div className="card" style={{ background: "#111", borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: 4 }}>Certificates 🏅</h2>
        <p className="lead" style={{ color: "#aaa" }}>
          Explore my certifications — technical & others.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {["tech", "other"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "tab active" : "tab"}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: tab === t ? "#007bff" : "#333",
                color: "#fff",
                fontWeight: 500,
                transition: "0.3s",
              }}
            >
              {t === "tech" ? "Tech" : "Others"}
            </button>
          ))}
        </div>

        {/* Certificates Grid */}
        <div
          className="certs-grid"
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          <AnimatePresence mode="wait">
            {CERTS[tab].map((c, idx) => (
              <motion.div
                key={c.title}
                className="cert card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 15px rgba(0, 123, 255, 0.4)",
                }}
                style={{
                  background: "#1a1a1a",
                  borderRadius: 12,
                  padding: 16,
                  color: "#fff",
                }}
              >
                {c.img && (
                  <img
                    src={c.img}
                    alt={c.title}
                    style={{
                      width: "100%",
                      height: 160,
                      borderRadius: 10,
                      objectFit: "cover",
                      marginBottom: 12,
                    }}
                  />
                )}
                <strong style={{ fontSize: 16 }}>{c.title}</strong>
                <div className="muted" style={{ fontSize: 13, color: "#bbb" }}>
                  {c.org} • {c.date}
                </div>

                {c.img && (
                  <div style={{ marginTop: 12 }}>
                    <button
                      className="btn"
                      onClick={() => setSelectedCert(c)}
                      style={{
                        background: "#007bff",
                        border: "none",
                        color: "white",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer",
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
        {selectedCert && (
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
            onClick={() => setSelectedCert(null)}
          >
            <motion.img
              src={selectedCert.img}
              alt={selectedCert.title}
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
