import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const PostCard = ({ post, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);
  const { isAdmin, user } = useAuth();

  // Show actions if user is admin OR if user is the post author
  const canEditPost = isAdmin || (user && post.userId === user.id);

  return (
    <article
      className="post-card"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="post-image" onClick={() => onView(post)}>
        <img src={post.image} alt={post.title} loading="lazy" />
        <div className="post-category">{post.category}</div>
      </div>

      <div className="post-content">
        <div className="post-meta">
          <span className="post-author">{post.author}</span>
          <span className="post-divider">·</span>
          <span className="post-date">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="post-divider">·</span>
          <span className="post-read-time">{post.readTime} min read</span>
        </div>

        <h3 className="post-title" onClick={() => onView(post)}>
          {post.title}
        </h3>

        <p className="post-excerpt">{post.body.slice(0, 120)}...</p>

        {canEditPost && (
          <div className={`post-actions ${showActions ? "visible" : ""}`}>
            <button onClick={() => onEdit(post)} className="btn-text">
              Edit
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="btn-text danger"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
