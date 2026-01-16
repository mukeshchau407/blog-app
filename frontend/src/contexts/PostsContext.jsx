import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { dummyPosts } from "../utils/DummyData.js";
import { generateAutoImage, isValidImageUrl } from "../utils/ImageUtils.js";

export const PostsContext = createContext(null);

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const postsPerPage = 6;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load dummy posts from local data
      // Check if we have custom posts in localStorage
      const customPosts = JSON.parse(
        localStorage.getItem("blog_posts") || "[]"
      );

      // Combine dummy posts with custom posts
      const allPosts = [...customPosts, ...dummyPosts].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setPosts(allPosts);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = useCallback(async (newPost) => {
    setLoading(true);
    try {
      // Use custom image if provided and valid, otherwise auto-generate
      let imageUrl = newPost.image;

      if (!imageUrl || !isValidImageUrl(imageUrl)) {
        // Generate high-quality category-specific image
        imageUrl = generateAutoImage(newPost.category, newPost.title);
      }

      const enhancedPost = {
        ...newPost,
        id: Date.now(),
        date: new Date().toISOString(),
        image: imageUrl,
        readTime: Math.ceil(
          newPost.body.split(" ").filter((w) => w).length / 200
        ), // ~200 words per minute
      };

      // Save to localStorage
      const customPosts = JSON.parse(
        localStorage.getItem("blog_posts") || "[]"
      );
      customPosts.unshift(enhancedPost);
      localStorage.setItem("blog_posts", JSON.stringify(customPosts));

      setPosts((prev) => [enhancedPost, ...prev]);
      return enhancedPost;
    } catch (err) {
      setError("Failed to create post");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id, updatedPost) => {
    setLoading(true);
    try {
      // Update in localStorage
      const customPosts = JSON.parse(
        localStorage.getItem("blog_posts") || "[]"
      );
      const postIndex = customPosts.findIndex((p) => p.id === id);

      if (postIndex !== -1) {
        const oldPost = customPosts[postIndex];

        // Handle image update
        let imageUrl = updatedPost.image;

        if (!imageUrl) {
          // No new image provided, keep the old one
          imageUrl = oldPost.image;
        } else if (!isValidImageUrl(imageUrl)) {
          // Invalid URL provided, generate new one
          imageUrl = generateAutoImage(
            updatedPost.category || oldPost.category,
            updatedPost.title || oldPost.title
          );
        }

        updatedPost.image = imageUrl;

        // Recalculate read time if body changed
        if (updatedPost.body) {
          updatedPost.readTime = Math.ceil(
            updatedPost.body.split(" ").filter((w) => w).length / 200
          );
        }

        customPosts[postIndex] = { ...oldPost, ...updatedPost };
        localStorage.setItem("blog_posts", JSON.stringify(customPosts));
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, ...updatedPost } : post
        )
      );
    } catch (err) {
      setError("Failed to update post");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    setLoading(true);
    try {
      // Delete from localStorage (only custom posts can be deleted)
      const customPosts = JSON.parse(
        localStorage.getItem("blog_posts") || "[]"
      );
      const filteredPosts = customPosts.filter((p) => p.id !== id);
      localStorage.setItem("blog_posts", JSON.stringify(filteredPosts));

      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError("Failed to delete post");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtering and pagination
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const paginatedPosts = useMemo(() => {
    const startIdx = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIdx, startIdx + postsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const value = useMemo(
    () => ({
      posts: paginatedPosts,
      allPosts: posts,
      loading,
      error,
      addPost,
      updatePost,
      deletePost,
      currentPage,
      setCurrentPage,
      totalPages,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
    }),
    [
      paginatedPosts,
      posts,
      loading,
      error,
      addPost,
      updatePost,
      deletePost,
      currentPage,
      totalPages,
      searchQuery,
      selectedCategory,
    ]
  );

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
};
