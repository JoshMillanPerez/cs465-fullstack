const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;
const readLine = require('readline');

// Attempt to connect to the database
const connect = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Wait up to 5 seconds to connect
        });
        console.log(`Mongoose connected to ${dbURI}`);
    } catch (err) {
        console.log('Mongoose connection error:', err);
        setTimeout(connect, 5000); // Retry after 5 seconds if connection fails
    }
};

// Monitor connection events
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Windows specific listener
if (process.platform === 'win32') {
    const r1 = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    r1.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}

// Graceful shutdown
const gracefulShutdown = (msg) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
    });
};

// Event listeners for graceful shutdown
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', () => {
    gracefulShutdown('app termination');
    process.exit(0);
});

process.on('SIGTERM', () => {
    gracefulShutdown('app shutdown');
    process.exit(0);
});

// Start initial DB connection
connect();

// Import models
require('./travlr'); // Ensure your models are imported after DB connection
module.exports = mongoose;
