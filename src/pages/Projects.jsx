import React from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'

// Screenshots are empty for now. Point `ss` at a real file you drop in public/
// (e.g. ss: '/tictactoe.png') and that card's screenshot block renders again.
// Same idea for `live`: set it to a real URL to bring back the "Live" button.
const PROJECTS = [
{
  title: 'Tic Tac Toe (AI Edition)',
  desc: 'Python-based Tic Tac Toe game using Minimax algorithm with GUI, sound effects, and cross-platform support.',
  ss: '',
  tech: ['Python', 'Minimax', 'GUI'],
  live: '#',
  code: 'https://github.com/ahmadjawad533/Tick_Tack_Toe'
},
  {
  title: 'Crime Management System',
  desc: 'Java console-based crime management system using MySQL for registering, searching, and updating case records.',
  ss: '',
  tech: ['Java', 'MySQL', 'OOP'],
  live: '#',
  code: 'https://github.com/ahmadjawad533/Crime-management-system'
},
  {
  title: 'Voting System',
  desc: 'Java voting system with candidate management, vote counting, and automatic winner calculation.',
  ss: '',
  tech: ['Java', 'OOP'],
  live: '#',
  code: 'https://github.com/ahmadjawad533/Voting_System'
},
  {
  title: 'Jazz Menu Simulator',
  desc: 'Java-based USSD menu simulator featuring CLI and Swing GUI with input validation and modular OOP design.',
  ss: '',
  tech: ['Java', 'Swing', 'OOP'],
  live: '#',
  code: 'https://github.com/ahmadjawad533/Jazz-Code-Menu'
},
 {
  title: 'Expense Tracker (Open Source Contribution)',
  desc: 'Open-source project for daily expense tracking using file-based storage, JSON parsing, and CSV export.',
  ss: '',
  tech: ['C++', 'JSON', 'CSV'],
  live: '#',
  code: 'https://github.com/ahmadjawad533/Expense_2025Framework'
},
{
  title: 'Library Management System (Open Source Contribution)',
  desc: 'C++ library management system with OOP, class inheritance, book issuing, and file-based data handling.',
  ss: '',
  tech: ['C++', 'OOP', 'File Handling'],
  live: '#',
  code: 'https://github.com/ahmadjawad533/Fest_2025'
},
{
  title: 'StandupDrafter',
  desc: 'Serverless web app that turns rough end-of-day notes into a clean status update grouped into Done, In Progress and Blockers, and keeps a per-user history of past updates. Built over a weekend for the AWS Builder Center "Weekend Annoying Task Challenge".',
  ss: '',
  tech: ['AWS CDK', 'AWS Lambda', 'Python 3.12', 'API Gateway', 'DynamoDB', 'Amazon S3', 'IAM'],
  live: 'http://standupdrafterstack-websitebucket75c24d94-7lxqfy4cn3eu.s3-website-us-east-1.amazonaws.com/',
  code: 'https://github.com/ahmadjawad533/startupdrafter'
},
{
  title: 'Ismail Welfare Trust (IWT)',
  desc: 'Charity management system with case CRUD, donation tracking and verification, JWT authentication, emailed receipts, newsletter subscriptions and reporting.',
  ss: '',
  tech: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'Nodemailer'],
  live: 'https://iwt-smoky.vercel.app',
  code: 'https://github.com/ahmadjawad533/IWT'
},
{
  title: 'Serverless Multi-Tenant SaaS Backend',
  desc: 'Team task management API demonstrating logical tenant isolation on AWS serverless services, using a single-table DynamoDB design and EventBridge for asynchronous background processing.',
  ss: '',
  tech: ['Python', 'AWS Lambda', 'API Gateway', 'DynamoDB', 'EventBridge', 'Cognito'],
  live: '',
  code: 'https://github.com/ahmadjawad533/Serverless-Multi-Tenant-SaaS'
},
{
  title: 'Pakistani Northern Areas Travel Planner',
  desc: 'AI-powered itinerary planner for the northern areas of Pakistan, combining hybrid keyword and vector search with a RAG pipeline for cultural insights, dynamic cost calculation in PKR and Urdu language support.',
  ss: '',
  tech: ['Python', 'FastAPI', 'ChromaDB', 'RAG', 'React', 'TypeScript', 'Tailwind CSS'],
  live: '',
  code: 'https://github.com/ahmadjawad533/Pakistani-Northern-Areas-Travel-Planner'
},
{
  title: 'Serverless Java CRUD API',
  desc: 'Serverless CRUD REST API for user records, built from Java 17 Lambda handlers behind API Gateway with DynamoDB persistence and a Maven build.',
  ss: '',
  tech: ['Java 17', 'AWS Lambda', 'API Gateway', 'DynamoDB', 'AWS SDK v2', 'Maven'],
  live: '',
  code: 'https://github.com/ahmadjawad533/CRUD-API'
},
{
  title: 'Campus Help Assistant (AWS Chatbot)',
  desc: 'Serverless campus chatbot that registers and tracks student complaints and answers FAQs, using Amazon Lex for natural language understanding and Lambda for the business logic.',
  ss: '',
  tech: ['Python', 'Amazon Lex', 'AWS Lambda', 'DynamoDB', 'Cognito', 'Amazon S3'],
  live: '',
  code: 'https://github.com/ahmadjawad533/AWS-Campus-Help-Assistant'
},
{
  title: 'Flight Price Tracker API',
  desc: 'REST API for tracking and searching flight ticket prices, with flight and search endpoints, MongoDB persistence and a seed script for sample data.',
  ss: '',
  tech: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST API'],
  live: '',
  code: 'https://github.com/ahmadjawad533/Flight_Tracker'
},
{
  title: 'CodeAlpha Java Internship Projects',
  desc: 'Three Java internship builds: a student grade tracker computing average, highest and lowest scores, a simulated stock trading platform with portfolio tracking, and a rule-based AI chatbot.',
  ss: '',
  tech: ['Java', 'OOP', 'Collections'],
  live: '',
  code: 'https://github.com/ahmadjawad533/Codealpha_JavaProgramming'
},
{
  title: 'Advanced Calculator (CLI + GUI)',
  desc: 'Core-Java calculator covering arithmetic, powers and roots, factorial and trigonometric functions, exposed through both a menu-driven CLI and a Swing desktop GUI with input validation.',
  ss: '',
  tech: ['Java', 'Swing', 'OOP'],
  live: '',
  code: 'https://github.com/ahmadjawad533/Advance-Calculator'
},
{
  title: 'Tank Shooting Game (Scratch)',
  desc: 'Scratch 3.0 tank shooter built as the CS50x Week 0 assignment, with keyboard sprite movement, a spacebar firing mechanism and collision-triggered explosion effects.',
  ss: '',
  tech: ['Scratch 3.0', 'Game Logic', 'CS50x'],
  live: '',
  code: 'https://github.com/ahmadjawad533/Tank-Shooting-Game-Scratch'
}
]

export default function Projects() {
  return (
    <motion.section
      className="container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      id="projects"
    >
      <div className="card" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 30 }}>
        <motion.h2
          className="text-4xl font-semibold text-cyan-400 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          🚀 Projects
        </motion.h2>
        <p className="text-gray-400 mb-10">
        A showcase of my core projects — combining AI, software engineering, and real-world problem solving.        </p>

        <div className="projects-grid" style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {PROJECTS.map((p, idx) => (
            <motion.div
              key={idx}
              className="project-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              style={{
                background: 'linear-gradient(145deg, rgba(20,20,20,0.9), rgba(10,10,10,0.9))',
                border: '1px solid rgba(0,255,255,0.1)',
                borderRadius: 16,
                padding: 16,
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(0,255,255,0.08)'
              }}
            >
              {p.ss && (
                <motion.div className="ss" whileHover={{ scale: 1.05 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
                  <img
                    src={p.ss}
                    alt={p.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: 12
                    }}
                  />
                </motion.div>
              )}

              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontSize: 18, color: '#0ea5e9', marginBottom: 6 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#bbb', marginBottom: 8, lineHeight: 1.6 }}>{p.desc}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: 'rgba(0,255,255,0.05)',
                        border: '1px solid rgba(0,255,255,0.1)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        color: '#aaf'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <motion.a
                    href={p.code}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    whileHover={{ scale: 1.08 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'rgba(255,255,255,0.05)',
                      color: '#0ea5e9',
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      border: '1px solid rgba(0,255,255,0.1)',
                      textDecoration: 'none'
                    }}
                  >
                    <Github size={14} /> Code
                  </motion.a>
                  {p.live && p.live !== '#' && (
                    <motion.a
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                      whileHover={{ scale: 1.08 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        background: 'linear-gradient(90deg, #06b6d4, #0891b2)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 13,
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={14} /> Live
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
