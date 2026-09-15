import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./Skills.css";

const SKILLS = [
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  // No devicon exists for networking — generic network icon to match Packet Tracer / Wireshark.
  { name: "Networking", logo: "https://img.icons8.com/color/96/network.png" },
  { name: "FastAPI", logo: "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/fastapi/fastapi-original.svg" },
  { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Postman", logo: "https://icon.icepanel.io/Technology/svg/Postman.svg" },
  { name: "Azure", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Neo4j", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg" },
  { name: "Github", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "DBMS", logo: "https://e7.pngegg.com/pngimages/883/7/png-clipart-database-computer-icons-data-management-toolkit-icon-business-process-data-thumbnail.png" },
  { name: "GitLab", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
  { name: "Linux", logo: "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/linux/linux-original.svg" },
  { name: "Scratch3", logo: "https://images.seeklogo.com/logo-png/48/1/scratch-logo-png_seeklogo-489198.png" },
  { name: "Packet Tracer", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKrQU23dSbfFfAjiB9fJnWx0VkVmH1i9WejQ&s" },
  { name: "Wireshark", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Wireshark_icon_new.png" },
  // { name: "Proteus", logo: "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/linux/linux-original.svg" },
  { name: "Canva", logo: "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/canva/canva-original.svg" },
  { name: "VS Code", logo: "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/visualstudio/visualstudio-original.svg" },
  { name: "Intellij IDEA", logo: "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/intellij/intellij-original.svg" },
  { name: "PyCharm", logo: "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/pycharm/pycharm-original.svg" },
  { name: "CLion", logo: "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/clion/clion-original.svg" },
];

const ROWS = [
  [
    { title: "Programming Languages", items: ["Python", "C++", "Java"] },
    { title: "Web Technologies", items: ["HTML", "CSS(Basics)", "JavaScript", "React", "Tailwind CSS", "FastAPI", "REST APIs"] },
    { title: "Databases & Tools", items: ["MySQL", "MongoDB", "MongoDB Compass", "Neo4j", "NoSQL", "Git", "Github", "Postman"] },
    { title: "Frameworks & Libraries", items: ["FastAPI", "Java Swing", "Django (learning)"] },
  ],
  [
    {
      title: "Cloud & Networking",
      items: ["AWS (learning)", "Azure", "Docker", "Cloud Computing", "Networking", "Linux", "Packet Tracer", "Wireshark"],
    },
    { title: "Design & Tools", items: ["Figma", "Canva"] },
    {
      title: "Core Concepts",
      items: [
        "Data Structures & Algorithms",
        "Object-Oriented Programming",
        "Database Management",
        "File Handling",
      ],
    },
    {
      title: "Soft Skills",
      items: ["Leadership", "Teamwork", "Problem Solving", "Creativity", "Adaptability", "Communication"],
    },
  ],
];

export default function Skills() {
  const stageRef = useRef();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const circles = Array.from(stage.querySelectorAll(".skill-circle"));
    const rect = stage.getBoundingClientRect();
    const placed = [];

    const isOverlapping = (x, y, size) =>
      placed.some((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < p.size / 2 + size / 2 + 40;
      });

    circles.forEach((circle) => {
      const size = circle.offsetWidth;
      let x, y, tries = 0;
      do {
        x = Math.random() * (rect.width - size - 20);
        y = Math.random() * (rect.height - size - 20);
        tries++;
      } while (isOverlapping(x, y, size) && tries < 150);

      placed.push({ x, y, size });
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      const dx = (Math.random() - 0.5) * 100;
      const dy = (Math.random() - 0.5) * 100;
      circle.animate(
        [{ transform: "translate(0, 0)" }, { transform: `translate(${dx}px, ${dy}px)` }],
        {
          duration: 5000 + Math.random() * 2000,
          direction: "alternate",
          iterations: Infinity,
          easing: "ease-in-out",
        }
      );
    });
  }, []);

  return (
    <section className="skills-container" id="skills">
      {/* Header */}
      <motion.div
        className="skills-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-5xl text-cyan-400 font-semibold mb-3">My Skills</h2>
        <div className="w-28 h-[2px] bg-cyan-400 mx-auto mb-6"></div>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          ✨ Technical expertise blended with creativity — explore my core competencies below.
        </p>
      </motion.div>

      {/* Floating Orbs with page-load + hover highlight animation */}
      <motion.div
        className="skills-stage relative mx-auto mb-20"
        ref={stageRef}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          width: "100%",
          height: "550px",
          borderRadius: "25px",
          background: "radial-gradient(circle at 50% 50%, #0a0a0a, #101010)",
          overflow: "hidden",
          boxShadow: "inset 0 0 60px rgba(0,255,255,0.07)",
          position: "relative",
        }}
      >
        {SKILLS.map((s, i) => (
          <motion.div
            key={s.name}
            className="skill-circle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.3,
              boxShadow: "0 0 35px 10px rgba(0,255,255,0.6)",
              background: "rgba(0,255,255,0.12)",
            }}
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0,255,255,0.06)",
              border: "1px solid rgba(0,255,255,0.25)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
              transition: "box-shadow 0.4s ease, background 0.4s ease",
            }}
          >
            <motion.img
              src={s.logo}
              alt={s.name}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",
                filter: "drop-shadow(0 0 8px rgba(0,255,255,0.4)) brightness(1.2)",
                marginBottom: "5px",
              }}
              whileHover={{
                filter: "drop-shadow(0 0 12px rgba(0,255,255,0.9)) brightness(1.6)",
                rotate: [0, 6, -6, 0],
                transition: { duration: 0.5 },
              }}
            />
            <span
              style={{
                color: "rgba(180,255,255,0.9)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.3px",
              }}
            >
              {s.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Skills Table (Text Section) */}
      <div className="skills-table">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="skills-row">
            {row.map((col, colIndex) => (
              <motion.div
                key={col.title}
                className="skill-box"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{
                  duration: 0.6,
                  delay: (rowIndex + colIndex) * 0.1,
                }}
              >
                <h3>{col.title}</h3>
                <ul>
                  {col.items.map((item, i) => (
                    <motion.li key={i} whileHover={{ x: 6, color: "#00ffc8" }}>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
