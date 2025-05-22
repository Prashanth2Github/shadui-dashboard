// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  transactions;
  stats;
  currentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.transactions = [];
    this.stats = {};
    this.currentId = 1;
    this.initializeDummyData();
  }
  initializeDummyData() {
    const adminUser = {
      id: this.currentId++,
      username: "admin",
      password: "password",
      email: "admin@example.com",
      isAdmin: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(adminUser.id, adminUser);
    this.transactions = [
      {
        id: "#38293",
        customer: {
          name: "John Doe",
          email: "john@example.com",
          initials: "JD",
          avatarColor: "blue"
        },
        date: "Aug 23, 2023",
        amount: "$239.00",
        status: "completed"
      },
      {
        id: "#38292",
        customer: {
          name: "Sarah Kim",
          email: "sarah@example.com",
          initials: "SK",
          avatarColor: "green"
        },
        date: "Aug 22, 2023",
        amount: "$129.99",
        status: "completed"
      },
      {
        id: "#38291",
        customer: {
          name: "Robert Miller",
          email: "robert@example.com",
          initials: "RM",
          avatarColor: "purple"
        },
        date: "Aug 21, 2023",
        amount: "$532.49",
        status: "pending"
      },
      {
        id: "#38290",
        customer: {
          name: "Emma Johnson",
          email: "emma@example.com",
          initials: "EJ",
          avatarColor: "red"
        },
        date: "Aug 20, 2023",
        amount: "$89.00",
        status: "failed"
      },
      {
        id: "#38289",
        customer: {
          name: "David Wang",
          email: "david@example.com",
          initials: "DW",
          avatarColor: "orange"
        },
        date: "Aug 19, 2023",
        amount: "$175.25",
        status: "completed"
      }
    ];
    this.stats = {
      revenue: {
        value: "$48,256",
        trend: {
          value: "12.5%",
          isPositive: true
        }
      },
      users: {
        value: "2,541",
        trend: {
          value: "8.2%",
          isPositive: true
        }
      },
      conversion: {
        value: "3.42%",
        trend: {
          value: "1.8%",
          isPositive: false
        }
      },
      orderValue: {
        value: "$86.24",
        trend: {
          value: "4.6%",
          isPositive: true
        }
      }
    };
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      email: insertUser.email || null,
      isAdmin: insertUser.isAdmin || false
    };
    this.users.set(id, user);
    return user;
  }
  async getTransactions() {
    return this.transactions;
  }
  async getStats() {
    return this.stats;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 10 }).notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerInitials: varchar("customer_initials", { length: 3 }).notNull(),
  avatarColor: varchar("avatar_color", { length: 10 }).notNull(),
  date: text("date").notNull(),
  amount: text("amount").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  revenue: text("revenue").notNull(),
  revenueValue: text("revenue_value").notNull(),
  revenueTrend: text("revenue_trend").notNull(),
  revenueTrendIsPositive: boolean("revenue_trend_is_positive").notNull(),
  users: text("users").notNull(),
  usersValue: text("users_value").notNull(),
  usersTrend: text("users_trend").notNull(),
  usersTrendIsPositive: boolean("users_trend_is_positive").notNull(),
  conversion: text("conversion").notNull(),
  conversionValue: text("conversion_value").notNull(),
  conversionTrend: text("conversion_trend").notNull(),
  conversionTrendIsPositive: boolean("conversion_trend_is_positive").notNull(),
  orderValue: text("order_value").notNull(),
  orderValueValue: text("order_value_value").notNull(),
  orderValueTrend: text("order_value_trend").notNull(),
  orderValueTrendIsPositive: boolean("order_value_trend_is_positive").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true
});
var insertStatsSchema = createInsertSchema(stats).omit({
  id: true
});
var loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  app2.post("/api/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  app2.post("/api/logout", (req, res) => {
    res.json({ success: true });
  });
  app2.get("/api/me", async (req, res) => {
    res.status(401).json({ message: "Not authenticated" });
  });
  app2.post("/api/register", async (req, res) => {
    try {
      const { username, email, password, fullName } = req.body;
      const existingUserName = await storage.getUserByUsername(username);
      if (existingUserName) {
        return res.status(400).json({ message: "Username already taken" });
      }
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const newUser = await storage.createUser({
        username,
        email,
        password,
        isAdmin: false
      });
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error creating user account" });
      }
    }
  });
  app2.get("/api/transactions", async (req, res) => {
    try {
      const transactions2 = await storage.getTransactions();
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  app2.get("/api/stats", async (req, res) => {
    try {
      const stats2 = await storage.getStats();
      res.json(stats2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("Server Error:", err);
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const PORT = 5e3;
  server.listen(PORT, () => {
    log(`\u2705 Server is running at http://localhost:${PORT}`);
  });
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
  });
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
  });
})();
