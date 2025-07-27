import { makeAutoObservable } from "mobx";

class ThemeStore {
  theme: "light" | "dark" = "light";

  constructor() {
    makeAutoObservable(this);
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      this.theme = "dark";
      document.documentElement.classList.add("dark");
    }
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    if (this.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", this.theme);
  }

  setTheme(theme: "light" | "dark") {
    this.theme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }
}

export const themeStore = new ThemeStore();
