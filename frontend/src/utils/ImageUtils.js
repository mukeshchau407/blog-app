// Auto-generate images based on category
// Uses curated Unsplash collections for better quality and relevance

export const generateAutoImage = (category, title = "") => {
  // Category-specific Unsplash collection IDs and search terms
  const imageConfigs = {
    Technology: {
      collections: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop", // Coding
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop", // Code on screen
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=500&fit=crop", // Laptop
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop", // Technology abstract
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop", // Data visualization
      ],
    },
    Design: {
      collections: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop", // Design tools
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop", // Color palette
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=500&fit=crop", // UI/UX
        "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=500&fit=crop", // Creative workspace
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=500&fit=crop", // Design process
      ],
    },
    Business: {
      collections: [
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop", // Office work
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=500&fit=crop", // Professional
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop", // Team meeting
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop", // Handshake
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop", // Charts/graphs
      ],
    },
    Lifestyle: {
      collections: [
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop", // Food/lifestyle
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop", // Meditation
        "https://images.unsplash.com/photo-1445384763658-0400939829cd?w=800&h=500&fit=crop", // Nature/health
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=500&fit=crop", // Lifestyle scene
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop", // Home/living
      ],
    },
  };

  // Get category config or default
  const config = imageConfigs[category] || imageConfigs.Technology;

  // Select random image from the category collection
  const randomIndex = Math.floor(Math.random() * config.collections.length);
  const selectedImage = config.collections[randomIndex];

  return selectedImage;
};

// Fallback if image fails to load
export const getFallbackImage = () => {
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop"; // Generic blog image
};

// Validate if URL is a valid image URL
export const isValidImageUrl = (url) => {
  if (!url) return false;

  // Check if it's a valid URL
  try {
    new URL(url);
  } catch {
    return false;
  }

  // Check if it ends with common image extensions or is from known image services
  const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const imageServices = [
    "unsplash.com",
    "pexels.com",
    "pixabay.com",
    "imgur.com",
  ];

  return (
    imagePattern.test(url) ||
    imageServices.some((service) => url.includes(service))
  );
};
