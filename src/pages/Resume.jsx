import React from "react";
import { motion } from "framer-motion";

export default function Resume() {
  const projects = [
    { title: "CloudOps GitOps Engine", tech: "Go, Kubernetes, ArgoCD", desc: "Enterprise-grade CI/CD with Kustomize and Trivy" },
    { title: "CloudiCraft Studio", tech: "JavaScript, Docker, AWS EKS", desc: "AI-powered Cloudinary media transformation workbench" },
    { title: "90 Days of Cloud Engineering", tech: "React, TypeScript, Terraform", desc: "Interactive learning portal with hands-on labs" },
    { title: "Site Quoter", tech: "TypeScript, React, AI/ML", desc: "AI-powered HVAC quote generator for contractors" },
    { title: "Quiz Platform - Real-time", tech: "TypeScript, WebSockets", desc: "Multiplayer quiz game with 4 adaptive themes" },
    { title: "AWS SBG COMSATS Lahore", tech: "React, TypeScript, Tailwind", desc: "Official website for AWS Student Builder Group" },
    { title: "Sorry, Not Sorry", tech: "React, AWS Lambda, Framer", desc: "Film-noir themed excuse forensics agent" },
    { title: "Rubber Duck Debugger", tech: "Python, AWS Lambda, Gemini", desc: "Socratic AI debugging coach on serverless" },
    { title: "Open Source Compass", tech: "React, FastAPI, Python", desc: "Platform to discover and contribute to open-source" },
    { title: "SLM Medical", tech: "Flutter, Dart, On-device LLM", desc: "Offline emergency first-aid assistant for Android/RPi" },
    { title: "EventOps", tech: "React, Express, Prisma, Redis", desc: "Event collaboration platform with QR tickets & RBAC" },
    { title: "StandupDrafter", tech: "AWS CDK, Lambda, DynamoDB", desc: "Serverless standup note generator with AI categorization" },
  ];

  return (
    <section className="container" style={{ padding: "60px 0" }}>
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "#0B0F14",
          borderRadius: 16,
          padding: "40px 30px",
          color: "#E5E7EB",
          boxShadow: "0 0 25px rgba(255, 138, 0, 0.1)",
          border: "1px solid #1F2937",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 28, color: "#FF8A00", marginBottom: 12 }}
        >
          📄 Resume
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: "#aaa", marginBottom: 25 }}
        >
          A comprehensive overview of my professional journey, skills, and achievements.
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
            background: "rgba(255,138,0,0.03)",
            padding: "24px 20px",
            borderRadius: 12,
            border: "1px solid rgba(255, 138, 0, 0.1)",
          }}
        >
          <div>
            <h3 style={{ fontSize: 24, color: "#FF8A00", marginBottom: 4 }}>
              👨‍💻 AHMAD JAWAD BANDESHA
            </h3>
            <p style={{ marginTop: 10, fontSize: 15, color: "#ccc" }}>
              3rd Year BS Computer Science | COMSATS University Islamabad, Lahore
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
              background: "rgba(255,138,0,0.05)",
              borderRadius: 12,
              padding: "14px 20px",
              border: "1px solid rgba(255, 138, 0, 0.1)",
              maxWidth: 560,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "#FF8A00" }}>Professional Summary:</strong>
            <p style={{ marginTop: 6, color: "#ccc" }}>
              Full-Stack Developer & Cloud Engineer with expertise in React, Node.js, Python, and AWS. Passionate about building scalable systems and leading tech communities. 3rd-year CS student with hands-on experience in serverless architecture, microservices, and open-source contributions. AWS Student Builder Group Captain driving cloud innovation and mentoring peers.
            </p>
          </motion.div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255, 138, 0, 0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,138,0,0.02)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#FF8A00", marginBottom: 12 }}>
            🎓 Education
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li>
              <strong>BS in Computer Science</strong> — COMSATS University Islamabad (Lahore Campus), 2024–2027 | <span style={{color: "#FF8A00"}}>GPA: 3.7/4.0</span>
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Intermediate — Government College University Lahore</strong> (Lahore Board, 2021-23) <br />
              <span style={{ color: "#aaa" }}>Percentage: 83%</span>
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Matriculation — New Afaq Higher Secondary School</strong> (Faisalabad Board, 2019-21)
              <br />
              <span style={{ color: "#aaa" }}>Percentage: 98.5%</span>
            </li>
          </ul>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255, 138, 0, 0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,138,0,0.02)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#FF8A00", marginBottom: 12 }}>
            🧑‍💻 Professional Experience
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li>
              <strong>Frontend Developer — AI Tech Spine</strong> (Lahore, Pakistan, Dec 2025 – Mar 2026)
              <br />
              <span style={{ color: "#ccc", fontSize: 13 }}>
                Developed responsive interfaces using React, JavaScript, HTML, CSS, and Tailwind CSS. Built FinanceFlow (FinTech) and EduLearn (E-learning) platforms with REST API integration and reusable UI components.
              </span>
            </li>
            <li style={{ marginTop: 8 }}>
              <strong>Web Developer, Intern — COMSATS Software House</strong> (Sahiwal, Pakistan, June 2025 – Aug 2025)
              <br />
              <span style={{ color: "#ccc", fontSize: 13 }}>
                Built Fitness Trainer website providing exercise tips and instructions.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Projects Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255, 138, 0, 0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,138,0,0.02)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#FF8A00", marginBottom: 12 }}>💼 Featured Projects</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: "rgba(255,138,0,0.05)",
                  border: "1px solid rgba(255, 138, 0, 0.1)",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <h5 style={{ color: "#FF8A00", margin: "0 0 4px 0", fontSize: 14 }}>{proj.title}</h5>
                <p style={{ color: "#aaa", margin: "0 0 6px 0", fontSize: 12 }}>{proj.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {proj.tech.split(", ").map((t) => (
                    <span key={t} style={{ background: "rgba(255,138,0,0.1)", color: "#FFB84D", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leadership & Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255, 138, 0, 0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,138,0,0.02)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#FF8A00", marginBottom: 12 }}>
            🏅 Leadership & Achievements
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li>
              <strong style={{color: "#FF8A00"}}>AWS Student Builder Group Captain</strong> — Leading cloud initiatives and mentoring students in serverless architecture
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>Notion Campus Leader</strong> — Organized workshops promoting productivity and collaboration
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>Postman Student Expert</strong> — Promoted API best practices and REST API testing
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>Neo4j Certified Professional</strong> — Graph database design and query optimization
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>Google Arcade Champion</strong> — Mentored participants in cloud challenges
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>Hacktoberfest Super Contributor</strong> — Active open-source contributor
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>Harvard ALP Alumni</strong> — Completed advanced leadership program
            </li>
          </ul>
        </motion.div>

        {/* GitHub & Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255, 138, 0, 0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,138,0,0.02)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#FF8A00", marginBottom: 12 }}>
            💻 GitHub & Campus Expertise
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            <li>
              <strong style={{color: "#FF8A00"}}>25+ Open Source Projects</strong> — Full-stack applications, serverless architectures, and community tools on GitHub
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>Cloud Engineering Specialist</strong> — AWS expertise with Lambda, DynamoDB, S3, CloudFront, API Gateway, and Cognito
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>Full-Stack Development</strong> — React, Node.js, Python, FastAPI, Express with MongoDB and PostgreSQL
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>DevOps & Infrastructure</strong> — Docker, Kubernetes, Terraform, CI/CD, GitHub Actions, ArgoCD
            </li>
            <li style={{ marginTop: 8 }}>
              <strong style={{color: "#FF8A00"}}>Community Builder</strong> — Organizing hackathons, workshops, and tech meetups at COMSATS Lahore
            </li>
          </ul>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{ marginTop: 40 }}
        >
          <h4 style={{ fontSize: 20, color: "#FF8A00", marginBottom: 12 }}>⚙️ Technical Skills</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              "JavaScript", "TypeScript", "Python", "Java", "C++", "Dart",
              "React", "React Native", "Node.js", "Express", "FastAPI",
              "HTML", "CSS", "Tailwind CSS", "Framer Motion",
              "AWS", "Lambda", "DynamoDB", "S3", "CloudFront", "API Gateway",
              "Docker", "Kubernetes", "Terraform", "Git", "GitHub",
              "MongoDB", "PostgreSQL", "MySQL", "Neo4j",
              "REST APIs", "GraphQL", "WebSockets",
              "OOP", "Data Structures", "Algorithms", "Problem Solving",
              "Leadership", "Teamwork", "Communication"
            ].map((skill) => (
              <motion.span
                key={skill}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,138,0,0.3)" }}
                style={{
                  background: "rgba(255,138,0,0.1)",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#FFB84D",
                  border: "1px solid rgba(255,138,0,0.2)",
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 30,
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            { name: "🚀 GitHub", link: "https://github.com/ahmadjawad533" },
            { name: "💼 LinkedIn", link: "https://www.linkedin.com/in/ahmadjawad533/" },
            { name: "🔗 Portfolio", link: "https://ahmadjawad.vercel.app" },
          ].map((site) => (
            <motion.a
              key={site.name}
              href={site.link}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.1, color: "#FF8A00" }}
              style={{
                color: "#E5E7EB",
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
          transition={{ delay: 1.3 }}
          style={{
            marginTop: 50,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(255, 138, 0, 0.1)",
          }}
        >
          <iframe
            src="/Resume.pdf"
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
          href="/Resume.pdf"
          download
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "inline-block",
            marginTop: 20,
            background: "#FF8A00",
            color: "#0B0F14",
            padding: "10px 22px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: 0.3,
          }}
        >
          📥 Download Resume
        </motion.a>

      </motion.div>
    </section>
  );
}
