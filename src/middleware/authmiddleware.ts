import * as jwt from 'jsonwebtoken';

export const authenticateToken = (req:any, res:any, next:any) => {
    const token = req.headers['key'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'secret', (err:any, decoded:any) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};


