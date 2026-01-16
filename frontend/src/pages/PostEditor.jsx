import React, { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { useAuth } from "../hooks/useAuth";
import { validatePostForm } from "../utils/Validation.js";

const PostEditor = ({ editingPost, onNavigate }) => {
  const { addPost, updatePost } = usePosts();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: editingPost?.title || "",
    body: editingPost?.body || "",
    category: editingPost?.category || "Technology",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePostForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const postData = {
        ...formData,
        author: user?.name || "Anonymous",
        userId: user?.id || 1,
      };

      if (editingPost) {
        await updatePost(editingPost.id, postData);
      } else {
        await addPost(postData);
      }

      onNavigate("dashboard");
    } catch (err) {
      setErrors({ submit: "Failed to save post. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-container">
        <div className="editor-header">
          <h1 className="editor-title">
            {editingPost ? "Edit Your Story" : "Create New Story"}
          </h1>
          <button
            onClick={() => onNavigate("dashboard")}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter a captivating title..."
              className={`title-input ${errors.title ? "error" : ""}`}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={errors.category ? "error" : ""}
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
            {errors.category && (
              <span className="error-text">{errors.category}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="body">Content</label>
            <textarea
              id="body"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              placeholder="Tell your story..."
              rows={15}
              className={`content-textarea ${errors.body ? "error" : ""}`}
            />
            {errors.body && <span className="error-text">{errors.body}</span>}
            <div className="character-count">
              {formData.body.length} characters
            </div>
          </div>

          {errors.submit && <div className="error-banner">{errors.submit}</div>}

          <div className="editor-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Saving..."
                : editingPost
                ? "Update Story"
                : "Publish Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditor;
