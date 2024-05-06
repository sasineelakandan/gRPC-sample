const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo(
  "localhost:3000",
  grpc.credentials.createInsecure()
);

const text = process.argv[2];

client.createTodo({ id: 1, text }, (err, response) => {
  if (err) {
    console.log("error in res ", err);
    return;
  }
  console.log(response);
});

client.getTodo({}, (err, response) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(response.items);
});

const call = client.streamTodo();
call.on("data", (item) => {
  console.log("streamed data ",item.text);
});

call.on("end", () => {
  console.log("stream ended");
});
