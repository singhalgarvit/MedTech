import {jwtVerify} from "../utils/jwtSign.js";

const verifyToken = (req, res, next) => {
  //middleware to verify the JWT token
  const token = req.headers.token; //get the token from headers
  if (!token) {
    return res.status(401).json({error: "No token provided"});
  }
  try {
    const decoded = jwtVerify(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({error: "Invalid token"});
  }
};

const requireRole = (roles) => (req, res, next) => {
  //it is the middleware to check which user role has access to that route
  if (!roles.some((role) => req.user.role == role)) {
    //if required role is not found in the token role(the role we got from the frontend token)
    return res.status(403).json({error: "Forbidden : You don't have rights to access this"}); //then return the function
  }
  next(); //otherwise call next
};

export {verifyToken, requireRole};
