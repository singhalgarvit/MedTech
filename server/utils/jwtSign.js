import jwt from 'jsonwebtoken';
const jwtSecret = process.env.jwt_Secret_key;

const jwtSign = (data)=>{
    return jwt.sign(data,jwtSecret);
}
export default jwtSign;