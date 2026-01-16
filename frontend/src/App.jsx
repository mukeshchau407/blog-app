import React, { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import PostEditor from "./pages/PostEditor";
import Loader from "./components/Loader";
import "./styles/globals.css";

const BlogApp = () => {
  const { canWrite, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [editingPost, setEditingPost] = useState(null);

  const navigate = (page) => {
    // Redirect to login if trying to access author/admin pages without auth
    if ((page === "create" || page === "edit") && !canWrite) {
      setCurrentPage("login");
      return;
    }
    setCurrentPage(page);
    if (page !== "edit") {
      setEditingPost(null);
    }
  };

  const handleEditPost = (post) => {
    if (!canWrite) {
      setCurrentPage("login");
      return;
    }
    setEditingPost(post);
    setCurrentPage("edit");
  };

  if (authLoading) {
    return <Loader />;
  }

  // Show auth pages when navigated to
  if (currentPage === "login") {
    return <LoginPage onNavigate={navigate} />;
  }

  if (currentPage === "register") {
    return <RegisterPage onNavigate={navigate} />;
  }

  return (
    <>
      <Header currentPage={currentPage} onNavigate={navigate} />
      <main className="main-content">
        {currentPage === "dashboard" && (
          <Dashboard onNavigate={navigate} onEditPost={handleEditPost} />
        )}
        {(currentPage === "create" || currentPage === "edit") && (
          <PostEditor editingPost={editingPost} onNavigate={navigate} />
        )}
      </main>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PostsProvider>
          <BlogApp />
        </PostsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
