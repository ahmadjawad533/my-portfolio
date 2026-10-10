# 💻 Ahmad Jawad Bandesha — Portfolio Website
Welcome to my personal portfolio website built with **React.js**, **Framer Motion**, and **modern UI design** principles.
It showcases my work, projects, skills, and journey as a developer passionate about **AI, ML, and Web Technologies**.

---

## 🚀 Features

* 🎨 **Modern UI/UX** with black-based aesthetic theme
* ⚡ Smooth **Framer Motion** animations
* 💼 **Projects, Resume, and Contact sections**
* 🧠 Tech-focused portfolio highlighting AI/ML projects
* 📨 Functional contact form powered by **EmailJS**
* 🖼️ **Auto-populated gallery** from workspace images
* 🔄 **Auto-generated projects** from GitHub repositories (optional)
* 🧩 Responsive design for all screen sizes

---

## 🛠️ Tech Stack

| Category            | Tools / Libraries                        |
| ------------------- | ---------------------------------------- |
| **Frontend**        | React.js, HTML5, CSS3, JavaScript (ES6+) |
| **Styling**         | Custom CSS                               |
| **Animation**       | Framer Motion                            |
| **Contact Form**    | EmailJS                                  |
| **Build System**    | Vite                                     |
| **Auto Build**      | Node.js build scripts                    |
| **Version Control** | Git & GitHub                             |
| **Deployment**      | Vercel / Netlify                         |

---

## ⚙️ Setup Instructions

To run this project locally:

```bash
# 1️⃣ Clone the repository
git clone https://github.com/ahmadjawad533/portfolio.git

# 2️⃣ Navigate to project directory
cd portfolio

# 3️⃣ Install dependencies
npm install

# 4️⃣ Copy environment template (optional)
cp .env.example .env

# 5️⃣ Run the Vite development server
npm run dev
```

Now open [http://localhost:5173](http://localhost:5173) in your browser 🚀

### Available Scripts

```bash
npm run dev               # Start dev server with hot reload
npm run build            # Build for production + auto-populate portfolio data
npm run build:portfolio  # Manually populate projects and gallery (runs automatically during npm run build)
npm run preview          # Preview the production build locally
npm run test             # Run property-based tests
npm run test:watch       # Run tests in watch mode
```

### Environment Setup

The `.env` file is required for the contact form. Copy `.env.example` to `.env` and fill in your EmailJS credentials:

```bash
# .env - Example configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Optional: GitHub integration for auto-populating projects
# Get a GitHub token from: https://github.com/settings/tokens
# Scope: public_repo (or repo for private repos)
# GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Note:** The contact form requires the three `VITE_EMAILJS_*` values to be filled in.
> Without them, email submissions will fail silently.

### Portfolio Auto-Population

The portfolio automatically fetches your GitHub repositories and organizes workspace images during build:

**Manual Trigger (optional):**
```bash
npm run build:portfolio
```

**With GitHub Token (optional, for higher rate limits):**
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx npm run build:portfolio
```

**For CI/CD (e.g., GitHub Actions):**
```bash
- name: Build portfolio
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: npm run build
```

The build script:
1. Fetches public repositories from your GitHub profile
2. Filters out duplicates and empty repos
3. Scans workspace root for images (jpg, jpeg, png, gif, webp)
4. Categorizes images by keyword matching (personal, projects, achievements)
5. Organizes images into `public/gallery/{category}/` directories
6. Updates `src/pages/Projects.jsx` and `src/pages/Gallery.jsx` with new data

Existing data is always preserved if the process fails.

---

## 📬 Contact

If you'd like to collaborate or just say hi 👋, feel free to reach out!

* 📧 **Email:** [iahmadjawad.533@gmail.com](mailto:iahmadjawad.533@gmail.com)
* 💼 **LinkedIn:** [linkedin.com/in/ahmadjawad533](https://www.linkedin.com/in/ahmadjawad533/)

---

## 🌟 Deployment

Deployed seamlessly on **Vercel** for continuous integration and fast CDN delivery.
Every push to the `main` branch triggers an automatic rebuild and deployment.

---

### 🏁 License

This project is open source and available under the [MIT License](LICENSE).
Feel free to fork, use, and build upon it ⭐

---

> *"Showcasing my work and passion through technology 💻"*
