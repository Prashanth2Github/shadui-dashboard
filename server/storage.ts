import { users, type User, type InsertUser, Transaction, Stats } from "@shared/schema";

// Extended storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTransactions(): Promise<any[]>;
  getStats(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: any[];
  private stats: any;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.transactions = [];
    this.stats = {};
    this.currentId = 1;
    
    // Initialize with dummy data
    this.initializeDummyData();
  }

  private initializeDummyData() {
    // Create admin user
    const adminUser: User = {
      id: this.currentId++,
      username: "admin",
      password: "password",
      email: "admin@example.com",
      isAdmin: true,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create transactions data
    this.transactions = [
      {
        id: "#38293",
        customer: {
          name: "John Doe",
          email: "john@example.com",
          initials: "JD",
          avatarColor: "blue",
        },
        date: "Aug 23, 2023",
        amount: "$239.00",
        status: "completed",
      },
      {
        id: "#38292",
        customer: {
          name: "Sarah Kim",
          email: "sarah@example.com",
          initials: "SK",
          avatarColor: "green",
        },
        date: "Aug 22, 2023",
        amount: "$129.99",
        status: "completed",
      },
      {
        id: "#38291",
        customer: {
          name: "Robert Miller",
          email: "robert@example.com",
          initials: "RM",
          avatarColor: "purple",
        },
        date: "Aug 21, 2023",
        amount: "$532.49",
        status: "pending",
      },
      {
        id: "#38290",
        customer: {
          name: "Emma Johnson",
          email: "emma@example.com",
          initials: "EJ",
          avatarColor: "red",
        },
        date: "Aug 20, 2023",
        amount: "$89.00",
        status: "failed",
      },
      {
        id: "#38289",
        customer: {
          name: "David Wang",
          email: "david@example.com",
          initials: "DW",
          avatarColor: "orange",
        },
        date: "Aug 19, 2023",
        amount: "$175.25",
        status: "completed",
      }
    ];

    // Create stats data
    this.stats = {
      revenue: {
        value: "$48,256",
        trend: {
          value: "12.5%",
          isPositive: true,
        },
      },
      users: {
        value: "2,541",
        trend: {
          value: "8.2%",
          isPositive: true,
        },
      },
      conversion: {
        value: "3.42%",
        trend: {
          value: "1.8%",
          isPositive: false,
        },
      },
      orderValue: {
        value: "$86.24",
        trend: {
          value: "4.6%",
          isPositive: true,
        },
      },
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      email: insertUser.email || null,
      isAdmin: insertUser.isAdmin || false 
    };
    this.users.set(id, user);
    return user;
  }

  async getTransactions(): Promise<any[]> {
    return this.transactions;
  }

  async getStats(): Promise<any> {
    return this.stats;
  }
}

export const storage = new MemStorage();
