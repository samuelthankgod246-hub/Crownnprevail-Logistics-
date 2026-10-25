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
  // Decode URL to handle spaces and special characters
  const decodedUrl = decodeURIComponent(req.url);
  
  // Handle root and /admin/ routing
  let url = decodedUrl;
  if (url === '/' || url === '') {
    url = '/admin/index.html';
  } else if (url === '/admin/' || url === '/admin') {
    url = '/admin/index.html';
  }
  
  let filePath = '.' + url;

  // Serve a runtime env shim so pages served without a bundler can access
  // environment variables (useful for preview mode). Access in the page as
  // `window.__APP_CONFIG__.VITE_GEMINI_API_KEY` or `window.__APP_CONFIG__.VITE_OPENROUTER_API_KEY`.
  if (url === '/env.js') {
    // Attempt to read .env from project root
    try {
      const envRaw = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
      const lines = envRaw.split(/\r?\n/).filter(Boolean);
      const obj = {};
      lines.forEach(line => {
        const m = line.match(/^\s*([^=]+)=([\s\S]*)$/);
        if (m) {
          const key = m[1].trim();
          let val = m[2].trim();
          // Strip optional surrounding quotes
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          obj[key] = val;
        }
      });

      const js = `window.__APP_CONFIG__ = ${JSON.stringify(obj)};`;
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(js, 'utf-8');
      return;
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end('window.__APP_CONFIG__ = {};', 'utf-8');
      return;
    }
  }

  // Simple AI proxy for preview: POST /ai/generate
  if (url === '/ai/generate' && req.method === 'POST') {
    let body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', async () => {
      try {
        body = Buffer.concat(body).toString();
        const payload = JSON.parse(body || '{}');

        // Read keys from .env
        const envRaw = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
        const lines = envRaw.split(/\r?\n/).filter(Boolean);
        const env = {};
        lines.forEach(line => {
          const m = line.match(/^\s*([^=]+)=([\s\S]*)$/);
          if (m) {
            const key = m[1].trim();
            let val = m[2].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.substring(1, val.length - 1);
            }
            env[key] = val;
          }
        });

        const AI_SYSTEM_PROMPT = `You are an AI logistics assistant for CrownPrevail Logistics company in Nigeria. Be concise, professional, and data-driven. Use Nigerian Naira for currency.

FORMAT RULES (important):
- Structure every answer: begin with a short **Bold heading**, then bullet lists (- item) or numbered steps.
- Bold key figures like amounts, percentages, and counts.
- Keep paragraphs to 1-2 sentences max; never write walls of text.
- Use markdown tables only when comparing 3+ items across attributes.
- Never output raw HTML. Default to 180 words or fewer unless the user asks for detail.`;

        // Prefer OpenRouter (currently fast/reliable), fall back to Gemini
        if (env.VITE_OPENROUTER_API_KEY) {
          // Rotate through known-good free models — free tiers go down often
          const modelCandidates = [
            env.VITE_OPENROUTER_MODEL || 'poolside/laguna-s-2.1:free',
            'poolside/laguna-xs-2.1:free',
            'nvidia/nemotron-3.5-super-vl:free',
            'dots-studio/dots-3-note-preview:free'
          ].filter((m, i, a) => a.indexOf(m) === i);

          async function callModel(model) {
            const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              signal: AbortSignal.timeout(45000),
              headers: {
                'Authorization': `Bearer ${env.VITE_OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ model: model, messages: [{ role: 'system', content: AI_SYSTEM_PROMPT }, { role: 'user', content: payload.prompt }], max_tokens: 500, temperature: 0.7 })
            });
            const data = await resp.json();
            return { status: resp.status, data };
          }

          for (const model of modelCandidates) {
            try {
              console.log('OpenRouter: trying model', model);
              const { status, data } = await callModel(model);
              const content = data.choices?.[0]?.message?.content;
              if (content) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, response: content, provider: 'OpenRouter' }));
                return;
              }
              console.warn(`OpenRouter ${model}: no content (status ${status})`, JSON.stringify(data).slice(0, 150));
              if (status === 429) await new Promise(r => setTimeout(r, 2000));
            } catch (err) {
              console.warn(`OpenRouter ${model} failed:`, err && err.message ? err.message : err);
            }
          }
          console.warn('All OpenRouter models failed, falling back to Gemini');
        }

        // Gemini fallback
        if (env.VITE_GEMINI_API_KEY) {
          try {
            const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${env.VITE_GEMINI_API_KEY}`, {
              method: 'POST',
              signal: AbortSignal.timeout(20000),
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: AI_SYSTEM_PROMPT + '\n\nUser: ' + payload.prompt }] }] })
            });
            const data = await resp.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
            if (text) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, response: text, provider: 'Gemini' }));
              return;
            }
            console.warn('Gemini returned no usable text', JSON.stringify(data).slice(0, 200));
          } catch (err) {
            console.warn('Gemini call failed', err && err.message ? err.message : err);
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'No AI provider responded. Check keys/models in .env.' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: String(err) }));
      }
    });
    return;
  }

  // Endpoint to list OpenRouter models for the configured API key
  if (url.startsWith('/ai/list-openrouter-models')) {
    (async () => {
      try {
        console.log('Handling /ai/list-openrouter-models request');
        const envRaw = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
        const lines = envRaw.split(/\r?\n/).filter(Boolean);
        const env = {};
        lines.forEach(line => {
          const m = line.match(/^\s*([^=]+)=([\s\S]*)$/);
          if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, "");
        });

        if (!env.VITE_OPENROUTER_API_KEY) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'No OpenRouter API key in .env' }));
          return;
        }

        const resp = await fetch('https://openrouter.ai/api/v1/models', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${env.VITE_OPENROUTER_API_KEY}` }
        });
        const data = await resp.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data }));
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: String(err) }));
        return;
      }
    })();
    return;
  }
  
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
  console.log(`📍 AI Assistant: http://localhost:${PORT}/admin/ai-assistant.html`);
  console.log(`\n⏸  Press Ctrl+C to stop server\n`);
});

process.on('SIGINT', () => {
  console.log('\n\n❌ Server stopped');
  process.exit(0);
});
