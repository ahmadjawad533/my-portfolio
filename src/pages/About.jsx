import React from "react";
import { motion } from "framer-motion";
import { FaUniversity, FaSchool, FaGraduationCap, FaCode, FaCloud, FaUsers } from "react-icons/fa";

const AboutMe = () => {
  const skills = {
    languages: ["Java", "Python", "C++", "TypeScript", "JavaScript", "Dart"],
    frontend: ["React", "React Native", "Tailwind CSS", "Framer Motion", "HTML/CSS"],
    backend: ["Node.js", "Express", "FastAPI", "AWS Lambda", "API Gateway"],
    databases: ["MongoDB", "MySQL", "DynamoDB", "PostgreSQL", "Firebase"],
    cloud: ["AWS", "AWS Lambda", "DynamoDB", "S3", "CloudFront", "Route 53", "API Gateway", "Cognito"],
    tools: ["Git", "Docker", "Kubernetes", "Terraform", "CI/CD", "Vercel", "GitHub Actions"],
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #0B0F14, #000)",
        color: "#E5E7EB",
        padding: "3rem 1rem",
      }}
    >
      {/* --- About Me + Education Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "1100px",
          textAlign: "left",
          marginTop: "1rem",
          lineHeight: 1.8,
          background: "rgba(255,138,0,0.03)",
          padding: "3rem 3.5rem",
          borderRadius: "18px",
          boxShadow: "0 0 25px rgba(255,138,0,0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,138,0,0.1)",
        }}
      >
        {/* --- Header --- */}
        <h2
          style={{
            fontSize: "1.9rem",
            marginBottom: "1.2rem",
            color: "#FF8A00",
          }}
        >
          About Me
        </h2>

        {/* --- Description --- */}
        <p
          style={{
            fontSize: "1.1rem",
            color: "#E5E7EB",
            marginBottom: "1rem",
          }}
        >
          Hi, I'm <strong>Ahmad Jawad Bandesha</strong> — a passionate{" "}
          <strong>Full-Stack Developer</strong> and{" "}
          <strong>Cloud Engineer</strong> with a keen interest in building scalable, impactful technology solutions. I specialize in turning complex ideas into functional systems using modern programming languages, cloud architecture, and database design.
        </p>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#E5E7EB",
            marginBottom: "1rem",
          }}
        >
          I'm actively pursuing <strong>AWS cloud engineering</strong> — exploring serverless architectures, microservices, and DevOps practices to design and deploy scalable, reliable systems. My experience spans from frontend development with React to backend services with Node.js and Python, combined with AWS infrastructure expertise.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#E5E7EB", marginBottom: "1rem" }}>
          Beyond coding, I'm a <strong>community builder and tech leader</strong> — I lead <strong>AWS Student Builder Group at COMSATS Lahore</strong>, organize workshops and hackathons, mentor peers, and foster learning and innovation in the tech community. I'm committed to creating software that is efficient, user-friendly, and creates real-world impact.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#E5E7EB" }}>
          <strong>BS Computer Science</strong> student (3rd Year at COMSATS University Islamabad) with hands-on experience in full-stack development, cloud technologies, and open-source contributions. Actively seeking opportunities to contribute to impactful projects and collaborate with innovative teams.
        </p>

        {/* --- Skills Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ marginTop: "2.5rem" }}
        >
          <h3
            style={{
              fontSize: "1.6rem",
              marginBottom: "1.5rem",
              color: "#FF8A00",
            }}
          >
            💼 Technical Skills
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            {Object.entries(skills).map(([category, items]) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: "rgba(255,138,0,0.05)",
                  borderRadius: "12px",
                  padding: "1.2rem",
                  border: "1px solid rgba(255,138,0,0.1)",
                  boxShadow: "0 0 15px rgba(255,138,0,0.05)",
                }}
              >
                <h4 style={{ color: "#FF8A00", marginBottom: "0.8rem", textTransform: "capitalize" }}>
                  {category.replace(/([A-Z])/g, " $1")}
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {items.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: "rgba(255,138,0,0.1)",
                        border: "1px solid rgba(255,138,0,0.3)",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        color: "#E5E7EB",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* --- Education Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ marginTop: "3rem" }}
        >
          <h3
            style={{
              fontSize: "1.6rem",
              marginBottom: "1.5rem",
              color: "#FF8A00",
            }}
          >
            🎓 Education
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            {/* --- Education Card 1 --- */}
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(255,138,0,0.15)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255,138,0,0.05)",
                borderRadius: "14px",
                padding: "1.5rem 2rem",
                border: "1px solid rgba(255,138,0,0.1)",
                boxShadow: "0 0 15px rgba(255,138,0,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              <FaUniversity size={40} color="#FF8A00" />
              <div>
                <h4
                  style={{
                    color: "#FF8A00",
                    marginBottom: "0.4rem",
                    fontSize: "1.25rem",
                  }}
                >
                  Bachelor of Science in Computer Science
                </h4>
                <p
                  style={{
                    color: "#E5E7EB",
                    marginBottom: "0.2rem",
                  }}
                >
                  <strong>COMSATS University Islamabad</strong> — Lahore, Punjab
                </p>
                <p style={{ color: "#E5E7EB" }}>
                  3rd Year (Pursuing) | Current GPA: 3.7/4.0
                </p>
                <p style={{ color: "#E5E7EB" }}>2024 – 2027</p>
              </div>
            </motion.div>

            {/* --- Education Card 2 --- */}
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(255,138,0,0.15)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255,138,0,0.05)",
                borderRadius: "14px",
                padding: "1.5rem 2rem",
                border: "1px solid rgba(255,138,0,0.1)",
                boxShadow: "0 0 15px rgba(255,138,0,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              <FaGraduationCap size={38} color="#FF8A00" />
              <div>
                <h4
                  style={{
                    color: "#FF8A00",
                    marginBottom: "0.4rem",
                    fontSize: "1.25rem",
                  }}
                >
                  Higher Secondary Education (12th Grade)
                </h4>
                <p
                  style={{
                    color: "#E5E7EB",
                    marginBottom: "0.2rem",
                  }}
                >
                  <strong>Government College University (GCU)</strong> — Lahore, Punjab
                </p>
                <p style={{ color: "#E5E7EB" }}>
                  Lahore Board | Percentage: 83%
                </p>
                <p style={{ color: "#E5E7EB" }}>2021-23</p>
              </div>
            </motion.div>

            {/* --- Education Card 3 --- */}
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(255,138,0,0.15)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255,138,0,0.05)",
                borderRadius: "14px",
                padding: "1.5rem 2rem",
                border: "1px solid rgba(255,138,0,0.1)",
                boxShadow: "0 0 15px rgba(255,138,0,0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              <FaSchool size={36} color="#FF8A00" />
              <div>
                <h4
                  style={{
                    color: "#FF8A00",
                    marginBottom: "0.4rem",
                    fontSize: "1.25rem",
                  }}
                >
                  Secondary Education (10th Grade)
                </h4>
                <p
                  style={{
                    color: "#E5E7EB",
                    marginBottom: "0.2rem",
                  }}
                >
                  <strong>New Afaq Higher Secondary School</strong> — Samundri, Faisalabad, Punjab
                </p>
                <p style={{ color: "#E5E7EB" }}>
                  Faisalabad Board | Percentage: 98.5%
                </p>
                <p style={{ color: "#E5E7EB" }}>2019-21</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* --- Roles & Leadership --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{ marginTop: "3rem" }}
        >
          <h3
            style={{
              fontSize: "1.6rem",
              marginBottom: "1.5rem",
              color: "#FF8A00",
            }}
          >
            👥 Leadership & Community
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                background: "rgba(255,138,0,0.05)",
                borderRadius: "12px",
                padding: "1.5rem",
                border: "1px solid rgba(255,138,0,0.1)",
              }}
            >
              <h4 style={{ color: "#FF8A00", marginBottom: "0.5rem" }}>AWS Student Builder Group Captain</h4>
              <p style={{ color: "#E5E7EB", fontSize: "0.9rem", margin: 0 }}>
                Leading AWS cloud initiatives and workshops at COMSATS University Lahore
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                background: "rgba(255,138,0,0.05)",
                borderRadius: "12px",
                padding: "1.5rem",
                border: "1px solid rgba(255,138,0,0.1)",
              }}
            >
              <h4 style={{ color: "#FF8A00", marginBottom: "0.5rem" }}>Notion Campus Lead</h4>
              <p style={{ color: "#E5E7EB", fontSize: "0.9rem", margin: 0 }}>
                Organizing community events and fostering collaboration among tech enthusiasts
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                background: "rgba(255,138,0,0.05)",
                borderRadius: "12px",
                padding: "1.5rem",
                border: "1px solid rgba(255,138,0,0.1)",
              }}
            >
              <h4 style={{ color: "#FF8A00", marginBottom: "0.5rem" }}>Open Source Contributor</h4>
              <p style={{ color: "#E5E7EB", fontSize: "0.9rem", margin: 0 }}>
                Active contributor to multiple open-source projects and community initiatives
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutMe;
