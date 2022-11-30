// Controller agrees to implement the function called "respond"
module.exports.respond = function (socket) {
  // this function expects a socket_io connection as argument

  console.log("A user connected!");

  // now we can do whatever we want:
  socket.on("message", (message) => {
    // as is proper, protocol logic like
    // this belongs in a controller:
    console.log("Received message: ", message);
    socket.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected!");
  });
};
