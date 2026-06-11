// Modules
const { Server } = require("socket.io");

// ---------------------------------------IMPORTS---------------------------------------

// Function to active socket
const activateSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User with id ${socket.id} connected!`);

        socket.on("joinRoom", (chatId) => {
            socket.join(chatId);
        });

        socket.on("leaveRoom", (chatId) => {
            socket.leave(chatId);
        });

        socket.on("disconnect", () => {
            console.log(`User with id ${socket.id} disconnected!`);
        });
    });
};

module.exports = activateSocket;