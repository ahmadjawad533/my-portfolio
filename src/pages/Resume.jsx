import React from "react";
import { motion } from "framer-motion";

export default function Resume() {
  return (
    <section className="container" style={{ padding: "60px 0" }}>
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "#0b0b0b",
          borderRadius: 16,
          padding: "40px 30px",
          color: "#e5e5e5",
          boxShadow: "0 0 25px rgba(0, 153, 255, 0.1)",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 28, color: "#00b4ff", marginBottom: 12 }}
        >
          📄 Resume
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: "#aaa", marginBottom: 25 }}
        >
          A quick glance at my journey.
        </motion.p>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 20,
            background: "rgba(255,255,255,0.03)",
            padding: "24px 20px",
            borderRadius: 12,
          }}
        >
          <div>
            <h3 style={{ fontSize: 24, color: "#00b4ff", marginBottom: 4 }}>
              👨‍💻 AHMAD JAWAD BANDESHA
            </h3>
            <p style={{ margintop: 10, fontSize: 15, color: "#ccc" }}>
              3rd Year BS Computer Science  | COMSATS University Islamabad, Lahore
            </p>
            <p style={{ margin: "4px 0", fontSize: 14, color: "#aaa" }}>
              📍 Lahore, Punjab, Pakistan
            </p>
            <p style={{ margin: "4px 0", fontSize: 14, color: "#aaa" }}>
              ✉️ iahmadjawad.533@gmail.com | 📞 +92-306-7063209
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              background: "linear-gradient(135deg, #00b4ff44, #0b0b0b)",
              borderRadius: 12,
              padding: "14px 20px",
              border: "1px solid rgba(255,255,255,0.1)",
              maxWidth: 560,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "#00b4ff" }}>Professional Summary:</strong>
            <p style={{ marginTop: 6, color: "#ccc" }}>
            3rd-year BS Computer Science student focused on frontend development
            with React and JavaScript, and a passion for cloud engineering and AWS.
            Community builder and leader of campus and cloud tech communities,
            experienced in automation and open-source contributions, and comfortable
            with Python, Java, MySQL, MongoDB, and APIs. Eager to contribute to
            production-level systems and collaborative engineering teams.
            </p>
          </motion.div>
        </motion.div>

        {/* Education Section with Border Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>
            🎓 Education
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li>
              <strong>BS in Computer Science</strong> — COMSATS University
              Islamabad(Lahore Campus), 2024–2027
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Intermediate — Government College University Lahore</strong> (Lahore
              Board, 2021-23) <br />
              <span style={{ color: "#aaa" }}>Percentage: 83%</span>
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Matriculation — New Afaq Higher Secondary School</strong> (Faisalabad Board, 2019-21)
              <br />
              <span style={{ color: "#aaa" }}>Percentage: 98.5%</span>
            </li>
          </ul>
        </motion.div>

        {/* Experience Section with Border Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>
            🧑‍💻 Experience
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li>
              <strong>Frontend Developer — AI Tech Spine</strong> (Lahore, Pakistan,
              Dec 2025 – Mar 2026)
              <br />
              <span style={{ color: "#aaa" }}>
                Developed responsive and interactive front-end interfaces using React,
                JavaScript, HTML, CSS, and Tailwind CSS, ensuring optimized performance
                and seamless user experience across devices. Contributed to projects like
                FinanceFlow (FinTech platform) and EduLearn (E-learning system),
                integrating REST APIs and building reusable UI components to enhance
                scalability and maintainability.
              </span>
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Web Developer, Intern — COMSATS Software House</strong> (Sahiwal,
              Pakistan, June 2025 – Aug 2025)
              <br />
              <span style={{ color: "#aaa" }}>
                Fitness Trainer: developed a website to give exercise tips/instructions.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: 40 }}
        >
          <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>💼 Projects</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li>1️⃣ Tic Tac Toe (AI Edition)  Python Minimax-based AI game</li>
            <li>2️⃣ Crime Management System  Java + MySQL case management system</li>
            <li>3️⃣ Voting System  Java voting & winner calculator</li>
            <li>4️⃣ Jazz Menu Simulator  Java CLI + Swing GUI USSD-style menu</li>
            <li>5️⃣ Expense Tracker  C++/Python file-based expense tracker</li>
            <li>6️⃣ Library Management System  C++ OOP-based book management system</li>
            <li>7️⃣ StandupDrafter  Serverless standup note generator on S3 + API Gateway + Lambda + DynamoDB, deployed with AWS CDK</li>
            <li>8️⃣ Serverless Multi-Tenant SaaS Backend  Task management API with tenant isolation, single-table DynamoDB & EventBridge</li>
            <li>9️⃣ Campus Help Assistant  Serverless AWS chatbot for student complaints & FAQs using Amazon Lex + Lambda</li>
            <li>🔟 Ismail Welfare Trust (IWT)  Charity management web app with donation tracking, JWT auth & emailed receipts</li>
            <li>1️⃣1️⃣ FinanceFlow  FinTech platform with real-time financial analytics, interactive dashboards & AI-driven insights, built in React</li>
            <li>1️⃣2️⃣ Bandesha Law Associates  Responsive website for a legal services firm in HTML, CSS, JavaScript & React showcasing services and case expertise</li>
          </ul>
        </motion.div>

        {/* Leadership & Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>
            🏅 Leadership & Achievements
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li>
              <strong>Notion Campus Leader</strong> — Organized workshops and promoted
              productivity tools to improve collaboration.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>AWS Student Builder Group Leader</strong> — Led cloud initiatives and
              guided students in hands-on AWS projects.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Postman Student Expert</strong> — Promoted API best practices and
              conducted sessions on REST APIs and testing.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Neo4j Certified Professional</strong> — Certified in graph database
              design and query optimization.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Pakistan’s First Official MLH Organizer</strong> — Organized
              hackathons, driving participation in tech communities.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Google Arcade Champion</strong> — Mentored participants in completing
              cloud challenges and milestones.
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Guinness World Record Official Attempt</strong> — Participated in a
              large-scale global record attempt.
            </li>
          </ul>
        </motion.div>
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{ marginTop: 40 }}
        >
          <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>⚙️ Skills</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              "Python",
              "C++",
              "Java",
              "JavaScript",
              "React",
              "HTML",
              "CSS",
              "Tailwind CSS",
              "FastAPI",
              "REST APIs",
              "AWS",
              "Azure",
              "Docker",
              "Cloud Computing",
              "Networking",
              "Figma",
              "Postman",
              "MySQL",
              "MongoDB",
              "Neo4j",
              "NoSQL",
              "OOP",
              "Data Structures",
              "Git",
              "GitLab",
              "Github",
              "Database Management",
              "Leadership",
              "Problem Solving",
              "Teamwork",
              "Adaptability",
              "Creativity",
            ].map((skill) => (
              <motion.span
                key={skill}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,180,255,0.3)" }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#ccc",
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 30,
            marginTop: 40,
          }}
        >
          {[
            // { name: "🏆 LeetCode", link: "https://leetcode.com/u/ahmadjawad533/" },
            { name: "💻 GitHub", link: "https://github.com/ahmadjawad533" },
            { name: "💼 LinkedIn", link: "https://www.linkedin.com/in/ahmadjawad533/" },
          ].map((site) => (
            <motion.a
              key={site.name}
              href={site.link}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1, color: "#00b4ff" }}
              style={{
                color: "#ccc",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {site.name}
            </motion.a>
          ))}
        </motion.div>

        {/* PDF Viewer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            marginTop: 50,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <iframe
            src="/resume.pdf"
            title="Ahmad Jawad Bandesha Resume"
            style={{
              width: "100%",
              height: "650px",
              border: "none",
              background: "#111",
            }}
          />
        </motion.div>

        {/* Download Button */}
        <motion.a
          href="/resume.pdf"
          download
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "inline-block",
            marginTop: 20,
            background: "#00b4ff",
            color: "#fff",
            padding: "10px 22px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 500,
            letterSpacing: 0.3,
          }}
        >
           Download Resume
        </motion.a>


      </motion.div>
    </section>
  );
}
