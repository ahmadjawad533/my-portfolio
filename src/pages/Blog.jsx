import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import "./blog.css";

export default function Blog() {
  // Published articles. Ordered newest first.
  const defaultPosts = [
    {
      id: 1,
      title: "Weekend Annoying Task Challenge: StandupDrafter",
      text: "Turning messy end-of-day notes into a clean, ready-to-post status update — automatically. A weekend build write-up covering the CDK stack, the Lambda and DynamoDB backend, and the deployment debugging that followed, including an account-level Bedrock restriction that forced a pivot to a rule-based categorizer in Lambda.",
      link: "https://builder.aws.com/content/3HKOGXe4qHrjb4cnVh7Or1VW9Z0/weekend-annoying-task-challenge-standupdrafter",
      source: "AWS Builder Center",
    },
    {
      id: 2,
      title: "9 Serverless Anti-Patterns Every AWS Developer Should Avoid",
      text: "Nine common AWS serverless anti-patterns that impact performance, security, scalability and cost, with practical solutions for production workloads. It opens with a serverless app that crashed at peak traffic while running up a $2,000 bill in six hours, then works through monolithic Lambdas, tight coupling, IAM wildcards, cold starts and weak observability.",
      link: "https://builder.aws.com/content/3GoElePICI7UkM391djL4elfQcq/9-serverless-anti-patterns-every-aws-developer-should-avoid",
      source: "AWS Builder Center",
    },
    {
      id: 3,
      title: "Security Features in AWS",
      text: "How to automate AWS GuardDuty, Macie and Inspector for continuous threat detection, sensitive-data discovery and vulnerability management. Covers wiring CloudWatch and Lambda for automated responses, and consolidating findings from all three services in AWS Security Hub.",
      link: "https://ahmadjawad533.medium.com/security-features-in-aw-920d47a468ff",
      source: "Medium",
    },
    {
      id: 4,
      title: "Building a Robust Multi-Region Architecture for AWS Disaster Recovery",
      text: "Defining RTO and RPO, picking regions around latency and data-residency constraints, and architecting failover and failback with Route 53, S3 and RDS replication. Also weighs synchronous against asynchronous replication and covers VPC peering, Direct Connect and running regular DR drills.",
      link: "https://ahmadjawad533.medium.com/building-a-robust-multi-region-architecture-for-aws-disaster-recovery-b8294b89f21d",
      source: "Medium",
    },
    {
      id: 5,
      title: "E-commerce at Scale: Mastering High-Traffic Websites with AWS",
      text: "A guide for e-commerce architects and DevOps engineers scaling online stores past traditional hosting limits. Covers the AWS infrastructure foundation — EC2 instance selection, Auto Scaling groups, load balancers, CloudFront and VPC design — plus database choices for high-volume transactions and a microservices architecture.",
      link: "https://ahmadjawad533.medium.com/e-commerce-at-scale-mastering-high-traffic-websites-with-aws-b3018709271a",
      source: "Medium",
    },
    {
      id: 6,
      title: "Building Modern Web Apps with AWS Amplify",
      text: "An Amplify walkthrough for JavaScript and React developers building serverless full-stack apps. Goes from CLI setup and project init through GraphQL and REST APIs with DataStore real-time sync, Cognito authentication with MFA and role-based access, and Git-driven deployment with custom domains.",
      link: "https://ahmadjawad533.medium.com/building-modern-web-apps-with-aws-amplify-2616289f54b0",
      source: "Medium",
    },
    {
      id: 7,
      title: "Amazon Web Services (AWS)",
      text: "An introduction to AWS and its on-demand model, walking through the core services — EC2, S3, RDS, Lambda and CloudFront — and the benefits of scalability, security, cost-effectiveness and global reach. Closes with how Netflix, Slack and NASA lean on the platform.",
      link: "https://ahmadjawad533.medium.com/amazon-web-services-aws-f050fde84ebf",
      source: "Medium",
    },
  ];

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedVotes = JSON.parse(localStorage.getItem("aj_blog_votes") || "{}");
    const votedByUser = JSON.parse(localStorage.getItem("aj_blog_voted") || "{}");
    const withVotes = defaultPosts.map((p) => ({
      ...p,
      agree: savedVotes[p.id]?.agree || 0,
      disagree: savedVotes[p.id]?.disagree || 0,
      userVote: votedByUser[p.id] || null,
    }));
    setPosts(withVotes);
  }, []);

  function vote(id, type) {
    const votedByUser = JSON.parse(localStorage.getItem("aj_blog_voted") || "{}");
    if (votedByUser[id]) return;

    const next = posts.map((p) =>
      p.id === id ? { ...p, [type]: p[type] + 1, userVote: type } : p
    );
    setPosts(next);

    const votes = Object.fromEntries(
      next.map((p) => [p.id, { agree: p.agree, disagree: p.disagree }])
    );
    localStorage.setItem("aj_blog_votes", JSON.stringify(votes));
    localStorage.setItem(
      "aj_blog_voted",
      JSON.stringify({ ...votedByUser, [id]: type })
    );
  }

  return (
    <motion.section
      className="blog-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="blog-title"
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        📝 My Blog
      </motion.h2>
      <p className="blog-sub">
        Articles I've published on Medium and the AWS Builder Center — feel free
        to react!
      </p>

      <div className="blog-grid">
        {posts.map((p, idx) => (
          <motion.div
            key={p.id}
            className="blog-post"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 20px rgba(255,255,255,0.1)",
            }}
          >
            <h3 className="post-title">{p.title}</h3>
            <p className="post-text">{p.text}</p>

            <div className="post-meta">
              <span className="post-source">{p.source}</span>
              <a
                className="post-link"
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read article →
              </a>
            </div>

            <div className="vote-container">
              <motion.button
                onClick={() => vote(p.id, "agree")}
                disabled={!!p.userVote}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.15 }}
                className={`vote-btn-circle agree ${
                  p.userVote === "agree" ? "active" : ""
                }`}
              >
                <ThumbsUp size={20} />
                <motion.span
                  key={p.agree}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="vote-count"
                >
                  {p.agree}
                </motion.span>
              </motion.button>

              <motion.button
                onClick={() => vote(p.id, "disagree")}
                disabled={!!p.userVote}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.15 }}
                className={`vote-btn-circle disagree ${
                  p.userVote === "disagree" ? "active" : ""
                }`}
              >
                <ThumbsDown size={20} />
                <motion.span
                  key={p.disagree}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="vote-count"
                >
                  {p.disagree}
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
