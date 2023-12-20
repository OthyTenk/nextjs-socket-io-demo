export const baseURL = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://socketionextjs.netlify.app";
  // : "https://nextjs-socket-io-demo.vercel.app";

  return url;
};
