const Todo = require("./Todo");
const mongoose = require("mongoose");
const fastify = require("fastify")({
  logger: true,
});

fastify.get("/ping", (request, reply) => {
  reply.send({ status: "ok" });
});

fastify.get("/todos", async (request, reply) => {
  const todos = await Todo.find().lean();
  reply.send({ todos });
});

fastify.get("/todos/:id", async (request, reply) => {
  const id = request.params.id;
  const todo = await Todo.findOne({ _id: id }).lean();

  reply.send({ todo });
});

fastify.post("/todos", async (request, reply) => {
  const { title, completed } = request.body;
  if (typeof title !== "string") {
    return reply.send({ error: "title is required" });
  }
  if (completed && typeof completed !== "boolean") {
    return reply.send({ error: "completed must be a boolean" });
  }

  const todo = new Todo({ title, completed });

  await todo.save();

  reply.send({ todo });
});

fastify.listen(process.env.PORT || 3000, "0.0.0.0", (err, address) => {
  if (err) {
    console.log(err);
    return process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.log(`MONGO_URI not found`);
    return process.exit(1);
  }
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("mongodb connection established...");
    })
    .catch(err => {
      console.log("mongodb connection failed", err);
    });
  console.log(
    `server ${address} listening on port ${process.env.PORT || 3000}`
  );
});
