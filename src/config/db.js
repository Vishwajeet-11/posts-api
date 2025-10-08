import mongoose from 'mongoose';

const { connect, connection, set } = mongoose;
export async function connectDB(uri) {
    set('strictQuery', true);
    await connect(uri);
    return connection;
}
