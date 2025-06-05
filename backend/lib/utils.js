import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET,process.env.JWT_EXPIRES_IN );

    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'strict', //CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // Convert seconds to milliseconds
        secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
    });

    return token;
}