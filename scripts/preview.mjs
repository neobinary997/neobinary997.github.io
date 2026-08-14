#!/usr/bin/env node
/**
 * 本地预览静态构建产物。
 *
 * 用法：
 *   npm run build
 *   npm run preview
 *
 * 用 Node 内置模块起一个静态服务器，服务于 out/ 目录，
 * 默认端口 4173，可用环境变量 PORT 覆盖。
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");
const PORT = Number(process.env.PORT || 4173);

if (!fs.existsSync(OUT_DIR)) {
  console.error(`未找到 ${OUT_DIR}，请先运行 npm run build。`);
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (urlPath.endsWith("/")) urlPath += "index.html";

  let filePath = path.normalize(path.join(OUT_DIR, urlPath));
  if (!filePath.startsWith(OUT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`预览地址: http://localhost:${PORT}`);
  console.log(`(按 Ctrl+C 停止)`);
});
