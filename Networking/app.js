const http = require("http");

const port = 4090;
const hostname = "127.0.0.1"

const server = http.createServer((req, res) => {
  const data = { message: "Hi there!" };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Connection", "close");
  res.statusCode = 200;
  res.end(JSON.stringify(data));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Server running at http://${hostname}`);
});
