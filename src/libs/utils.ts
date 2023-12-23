export const baseURL = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://172.17.0.2:3000";

  // "http://ec2-3-137-182-223.us-east-2.compute.amazonaws.com/";

  return url;
};
