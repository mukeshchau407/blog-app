import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

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
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const data = await response.json();

      // Enhance posts with additional metadata
      const enhancedPosts = data.slice(0, 30).map((post, idx) => ({
        ...post,
        author: `Author ${post.userId}`,
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        category: ["Technology", "Design", "Business", "Lifestyle"][idx % 4],
        image: `https://picsum.photos/seed/${post.id}/800/500`,
        readTime: Math.floor(Math.random() * 10) + 3,
      }));

      setPosts(enhancedPosts);
    } catch (err) {
      setError("Failed to fetch posts. Please try again.");
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
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPost),
        }
      );
      const data = await response.json();

      const enhancedPost = {
        ...data,
        id: Date.now(),
        author: newPost.author || "You",
        date: new Date().toISOString(),
        category: newPost.category || "Uncategorized",
        image: `https://picsum.photos/seed/${Date.now()}/800/500`,
        readTime: Math.floor(Math.random() * 10) + 3,
      };

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
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

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
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
      });

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
