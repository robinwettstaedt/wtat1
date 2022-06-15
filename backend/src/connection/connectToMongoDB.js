import mongoose from 'mongoose';

const connectToMongoDB = (opts = {}) => {
    try {
        let url = '';

        if (process.env.NODE_ENV === 'production') {
            url = process.env.PROD_MONGO_URI;
        }
        if (process.env.NODE_ENV === 'testing') {
            url = process.env.DEV_MONGO_URI;
        }
        if (process.env.NODE_ENV === 'development') {
            url = process.env.DEV_MONGO_URI;
        }

        mongoose.connect(url, {
            ...opts,
            maxPoolSize: 50,
            connectTimeoutMS: 5000,
            useNewUrlParser: true,
        });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error: '));
        db.once('open', () => {
            console.log('Connected successfully to the MongoDB database');
        });
    } catch (error) {
        console.log(error);
    }
};

export default connectToMongoDB;
