import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token)
      return res.status(401).json({ success: false, message: "Login please" });

    jwt.verify(token, process.env.JWT_SECRET, (err, Decode) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      } else {
        req.body.userId = Decode.id;
        next();
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ success: false, message: "Invalid Token" });
  }
};

export default auth;
