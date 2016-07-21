import jwt from 'jsonwebtoken';

const jwtSign = (result) => {
  return jwt.sign({
      id: result.id,
      username: result.username,
    },process.env.JWT_SECRET)
}

export default jwtSign;
