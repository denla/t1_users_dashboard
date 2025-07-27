import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import CreateUserPage from "@/pages/CreateUserPage";
import EditUserPage from "@/pages/EditUserPage";
import UsersPage from "@/pages/UsersPage";
import { useEffect } from "react";
import Layout from "./shared/ui/layout/Layout";

export const App = () => {
  useEffect(() => {
    document.title = "Users Dashboard";
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/user/create" element={<CreateUserPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/edit/:id" element={<EditUserPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
