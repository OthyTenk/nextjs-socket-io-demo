export const baseURL = () => {
  return;
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://nextjs-socket-io-demo";
};
