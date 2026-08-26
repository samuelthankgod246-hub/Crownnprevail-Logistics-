const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.jfif': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  // Handle root and /admin/ routing
  let url = req.url;
  if (url === '/') {
    url = '/admin/index.html';
  } else if (url === '/admin/' || url === '/admin') {
    url = '/admin/index.html';
  }
  
  let filePath = '.' + url;
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1><p>Path: ' + filePath + '</p>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: '+err.code+' ..\n');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n✅ Preview Server Started!\n`);
  console.log(`📍 Admin Dashboard: http://localhost:${PORT}`);
  console.log(`📍 Admin Login: http://localhost:${PORT}/admin/index.html`);
  console.log(`📍 Dashboard: http://localhost:${PORT}/admin/dashboard.html`);
  console.log(`📍 Blog Posts: http://localhost:${PORT}/admin/blogs.html`);
  console.log(`📍 Team: http://localhost:${PORT}/admin/team.html`);
  console.log(`📍 Inquiries: http://localhost:${PORT}/admin/inquiries.html`);
  console.log(`📍 Analytics: http://localhost:${PORT}/admin/analytics.html`);
  console.log(`📍 Profile: http://localhost:${PORT}/admin/profile.html`);
  console.log(`\n⏸  Press Ctrl+C to stop server\n`);
});

process.on('SIGINT', () => {
  console.log('\n\n❌ Server stopped');
  process.exit(0);
});
