export const baseURL = () => {
  return;
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://localhost:3000";
};
