const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
};

const server = http.createServer((req, res) => {
  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(__dirname, requestPath);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    });
    res.end(content);
  });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Deck designer running at http://localhost:${port}`);
});
