import React, { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { useAuth } from "../hooks/useAuth";
import PostCard from "../components/PostCard";
import PostDetail from "../components/PostDetail";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const Dashboard = ({ onNavigate, onEditPost }) => {
  const {
    posts,
    loading,
    error,
    deletePost,
    currentPage,
    setCurrentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = usePosts();

  const { canWrite } = useAuth();
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = ["all", "Technology", "Design", "Business", "Lifestyle"];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
    }
  };

  const handleView = (post) => {
    setSelectedPost(post);
  };

  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        onEdit={onEditPost}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">Latest Stories</h1>
          <p className="dashboard-subtitle">
            Discover insights, ideas, and inspiration
          </p>
        </div>

        {canWrite && (
          <button onClick={() => onNavigate("create")} className="btn-primary">
            <span className="btn-icon">+</span>
            New Story
          </button>
        )}
      </div>

      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`category-filter ${
                selectedCategory === cat ? "active" : ""
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <Loader message="Loading stories..." />
      ) : posts.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No stories found"
          message="Try adjusting your filters or create a new story"
          actionLabel={canWrite ? "Create Story" : undefined}
          onAction={canWrite ? () => onNavigate("create") : undefined}
        />
      ) : (
        <>
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={onEditPost}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
