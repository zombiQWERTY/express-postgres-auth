import mongoose from 'mongoose';

export const connectDatabase = uri => new Promise((resolve, reject) => {
    mongoose.Promise = Promise;
    const connection = mongoose.createConnection(uri);

    connection
        .on('error', error => reject(error))
        .on('close', () => console.log('Database connection closed.'))
        .once('open', () => resolve(connection));
});
