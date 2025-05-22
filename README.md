# 📊 ShadCN Dashboard UI

A **responsive dashboard application** built with **React**, **ShadCN UI**, and **Express**, combining both frontend and backend in a single fullstack deployment on **Render**.

This project features a clean layout, sidebar navigation, dynamic table, and dummy data rendered using modern UI components with full responsiveness.

---

## 🚀 Live Demo

🔗**Hosted on Render**: [https://shadui-dashboard-1.onrender.com](https://shadui-dashboard-1.onrender.com)


---

## 📁 Project Structure
```plaintext
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── hooks/
│   │   │   ├── use-auth.tsx
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   └── ...
│   ├── lib/
│   ├── pages/
│   │   ├── App.tsx
│   │   └── ...
│   ├── index.css
│   ├── main.tsx
│   └── ...
├── dist/
├── node_modules/
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── vite.ts
│   └── ...
├── shared/
├── components.json
├── drizzle.config.ts
├── generated-icon.png
├── package-lock.json
├── package.json
├── postcss.config.js
├── project-setup.md
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .gitignore
└── README.md
```

---

## 🧩 Features

- ✅ **Responsive Sidebar** with navigation (ShadCN `sidebar-07`)
- ✅ **Dashboard Cards** for quick insights (ShadCN `dashboard-01`)
- ✅ **Data Table** with dummy transaction data
- ✅ **API Routes** served from Express backend
- ✅ Fully integrated frontend + backend build
- ✅ Organized file structure with reusable components
- ✅ Bonus: Dummy routing with React Router, loading skeletons, and toast feedback

---

## 🛠 Tech Stack

| Category     | Tech |
|--------------|------|
| Frontend     | React, Vite, TailwindCSS, ShadCN UI |
| Backend      | Node.js, Express |
| Build Tools  | Vite, ESBuild |
| State        | React Query |
| Routing      | React Router |
| Deployment   | Render |
| Styling      | TailwindCSS + Animate |

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/shadcn-dashboard.git
cd shadcn-dashboard
```
### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
```bash
npm run dev
```
Express API: http://localhost:5000

Vite Frontend: http://localhost:5173

### 4. Build for Production
```bash
npm run build
```
This will:

Build the frontend with Vite into dist/

Bundle the backend with esbuild into dist/index.js

### 5. Start Production Server
```bash
npm start
```
## 📦 NPM Scripts

| Command           | Description                                      |
|------------------|--------------------------------------------------|
| `npm run dev`     | Start frontend and backend in development mode   |
| `npm run build`   | Bundle frontend and backend for Render deployment|
| `npm start`       | Start server from `dist/index.js`                |
| `npm run check`   | Type-check the project                          |
| `npm run deploy`  | Deploy frontend to GitHub Pages (optional)       |

## 🌐 Deployment (Render)

✅ **Combined Frontend + Backend**

To deploy this full-stack app on [Render](https://render.com):

1. **Create a new Web Service** on Render.
2. **Connect your GitHub repository.**
3. **Set the following configuration:**

   - **Build Command:**
     ```bash
     npm run build
     ```

   - **Start Command:**
     ```bash
     npm start
     ```

   - **Root Directory:**  
     ```
     /
     ```

4. **Output is served from:**
   dist/
>This setup assumes both frontend and backend are in the same project directory.

## 💡 Extra Features

- 🌐 **React Router** routing for seamless navigation  
- ⌛ Minimal loading skeletons for improved user experience  
- ✅ Custom hooks for authentication, mobile device detection, and toast notifications  
- 💬 Toast notifications implemented with `use-toast`  
- 📱 Fully responsive design supporting both mobile and desktop screens  


## 📸 Screenshots

Add your screenshots to the `/screenshots/` folder and link them here:

- **Dashboard View**  
  ![Dashboard View](./screenshots/dashboard-view.png)

- **Table View**  
  ![Table View](./screenshots/table-view.png)

---

## 📃 License

MIT © Prashanth Bonkuru

---

## 🙌 Acknowledgements

- [ShadCN/UI](https://ui.shadcn.com/)  
- [Vite](https://vitejs.dev/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Render Hosting](https://render.com/)

---

## 🔗 Links

- GitHub: [https://github.com/Prashanth2Github](https://github.com/Prashanth2Github)  
- Live Demo: [https://shadui-dashboard-1.onrender.com](https://shadui-dashboard-1.onrender.com)

