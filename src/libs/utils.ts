export const baseURL = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : // : "https://socketionextjs.netlify.app";
        "http://socketio-dev-lb-2066316858.us-east-2.elb.amazonaws.com/";

  return url;
};
