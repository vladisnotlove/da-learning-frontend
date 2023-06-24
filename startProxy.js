const express = require("express");
const {createProxyMiddleware} = require("http-proxy-middleware");

const PORT = 3030;

const proxyToFront = createProxyMiddleware({
	target: "http://localhost:3000",
	ws: true,
});

const proxyToBack = createProxyMiddleware({
	target: "http://127.0.0.1:8000",
});

const app = express();

app.use("/api", proxyToBack);
app.use("/admin", proxyToBack);
app.use("/static", proxyToBack);
app.use("/media", proxyToBack);
app.use("/", proxyToFront);

app.listen(PORT);

console.log();
console.log("Server ready");
console.log(`URL: http://localhost:${PORT}`);


