// vercel.js
const { Server } = require('http');
const { app } = require('./dist/main');

module.exports = (req, res) => {
    const server = new Server((request, response) => {
        app.init();
        app.getHttpAdapter().getInstance()(request, response);
    });
    server.emit('request', req, res);
};