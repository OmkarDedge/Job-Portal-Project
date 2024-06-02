// error middleware
const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  return res.status(500).send({
    success: false,
    message: "Something went wrong",
    err,
  });
};

export default errorMiddleware;
