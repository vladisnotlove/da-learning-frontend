const express = require("express");
const {createProxyMiddleware} = require("http-proxy-middleware");


const proxyToFront = createProxyMiddleware({
	target: "http://localhost:3000",
	ws: true,
});

const proxyToBack = createProxyMiddleware({
	target: "http://localhost:8000",
});

const app = express();

app.use("/api", proxyToBack);
app.use("/admin", proxyToBack);
app.use("/static", proxyToBack);
app.use("/", proxyToFront);

app.listen("3030");

