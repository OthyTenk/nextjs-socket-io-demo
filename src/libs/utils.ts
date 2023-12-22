export const baseURL = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : // : "https://socketionextjs.netlify.app";
        "http://ec2-3-133-127-21.us-east-2.compute.amazonaws.com";

  return url;
};
