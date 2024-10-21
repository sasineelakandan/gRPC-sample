const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();

server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  getTodo: getTodo,
  streamTodo: streamTodo,
});

server.bindAsync(
  "0.0.0.0:3000",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    console.log("server started in " + port);
  }
);

const todo = [];

function createTodo(call, callback) {
  const item = {
    id: todo.length +1,
    text: call.request.text,
  };

  todo.push(item);

  callback(null, item);
}

function getTodo(call, callback) {
  callback(null, { items: todo });
}

function streamTodo(call, callback) {
  todo.forEach((item) => {
    call.write(item);
  });
  call.end();
}
