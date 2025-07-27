import { makeAutoObservable } from "mobx";
import axios from "axios";

export interface User {
  name: string;
  email: string;
}

class UserStore {
  user: User | null = null;
  loading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  async login(data: { email: string; password: string }) {
    try {
      const response = await axios.post("/api/v1/auth/login", data);
      console.log("Login successful:", response.data);
      await this.fetchUser();
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error");
      throw error;
    }
  }

  async fetchUser() {
    this.loading = true;
    try {
      const res = await axios.get("/api/v1/auth/me");
      this.user = res.data;
    } catch (err) {
      this.user = null;
    } finally {
      this.loading = false;
    }
  }

  setUser(user: User | null) {
    this.user = user;
  }

  async logout() {
    await axios.post("/api/v1/auth/logout").finally(() => {
      this.setUser(null);
    });
  }
}

export const userStore = new UserStore();
