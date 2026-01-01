import serverless from 'serverless-http';
import app from '../../server/app.js';
import connectDB from '../../server/config/database.js';

const handler = serverless(app);

export default async function handlerWrapper(req, res) {
    // Ensure DB is connected before handling the request
    try {
        await connectDB();
    } catch (err) {
        console.error('DB connection failed in serverless handler:', err.message || err);
        res.status(500).json({ message: 'Database connection error' });
        return;
    }

    return handler(req, res);
}
