export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role"); // if you store role
  window.location.href = "/login";
};
