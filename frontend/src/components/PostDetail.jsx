import React from "react";
import { useAuth } from "../hooks/useAuth";

const PostDetail = ({ post, onBack, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="post-detail">
      <button onClick={onBack} className="back-button">
        ← Back to Stories
      </button>

      <article className="post-detail-content">
        <div className="post-detail-header">
          <div className="post-detail-category">{post.category}</div>
          <h1 className="post-detail-title">{post.title}</h1>

          <div className="post-detail-meta">
            <span>{post.author}</span>
            <span>·</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <img src={post.image} alt={post.title} className="post-detail-image" />

        <div className="post-detail-body">
          <p>{post.body}</p>
          <p>{post.body}</p>
          <p>{post.body}</p>
        </div>

        {isAdmin && (
          <div className="post-detail-actions">
            <button onClick={() => onEdit(post)} className="btn-secondary">
              Edit Post
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="btn-text danger"
            >
              Delete Post
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetail;
