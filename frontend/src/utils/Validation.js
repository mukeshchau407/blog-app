export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validatePostForm = (data) => {
  const errors = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (!data.body || data.body.trim().length < 10) {
    errors.body = "Content must be at least 10 characters";
  }

  if (!data.category) {
    errors.category = "Please select a category";
  }

  return errors;
};
