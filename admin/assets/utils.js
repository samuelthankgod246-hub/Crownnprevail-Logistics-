// ============================================================
// Admin Dashboard Utilities & Helpers
// ============================================================

// ── Toast Notifications ─────────────────────────────────
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  }

  show(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
    
    toast.innerHTML = `
      <div class="toast-icon"><i class="fas fa-${iconMap[type]}"></i></div>
      <div>${this.escapeHtml(message)}</div>
    `;
    
    this.container.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(msg) { this.show(msg, 'success'); }
  error(msg) { this.show(msg, 'error', 5000); }
  info(msg) { this.show(msg, 'info'); }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export const toastManager = new ToastManager();
export { ToastManager };

// ── Form Validation ─────────────────────────────────────
export const validators = {
  required: (value) => ({
    valid: value && value.trim().length > 0,
    message: 'This field is required'
  }),

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      valid: emailRegex.test(value),
      message: 'Please enter a valid email address'
    };
  },

  minLength: (min) => (value) => ({
    valid: value && value.length >= min,
    message: `Minimum ${min} characters required`
  }),

  maxLength: (max) => (value) => ({
    valid: !value || value.length <= max,
    message: `Maximum ${max} characters allowed`
  }),

  phone: (value) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return {
      valid: !value || (value.length >= 10 && phoneRegex.test(value)),
      message: 'Please enter a valid phone number'
    };
  },

  url: (value) => {
    try {
      new URL(value);
      return { valid: true, message: '' };
    } catch {
      return { valid: false, message: 'Please enter a valid URL' };
    }
  },

  number: (value) => ({
    valid: !value || !isNaN(value),
    message: 'Please enter a valid number'
  })
};

export class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.fields = new Map();
  }

  addField(fieldName, validators) {
    this.fields.set(fieldName, validators);
  }

  validateField(fieldName, value) {
    const fieldValidators = this.fields.get(fieldName);
    if (!fieldValidators) return { valid: true };

    for (const validator of fieldValidators) {
      const result = validator(value);
      if (!result.valid) return result;
    }
    return { valid: true };
  }

  validate() {
    let isValid = true;
    const errors = {};

    for (const [fieldName, validators] of this.fields.entries()) {
      const input = this.form.querySelector(`[name="${fieldName}"], #${fieldName}`);
      if (!input) continue;

      const result = this.validateField(fieldName, input.value);
      const formGroup = input.closest('.form-group');

      if (!result.valid) {
        isValid = false;
        errors[fieldName] = result.message;
        if (formGroup) {
          formGroup.classList.add('has-error');
          let errorMsg = formGroup.querySelector('.error-message');
          if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            formGroup.appendChild(errorMsg);
          }
          errorMsg.textContent = result.message;
        }
      } else {
        if (formGroup) {
          formGroup.classList.remove('has-error');
          formGroup.classList.add('has-success');
          const errorMsg = formGroup.querySelector('.error-message');
          if (errorMsg) errorMsg.textContent = '';
        }
      }
    }

    return { valid: isValid, errors };
  }

  reset() {
    this.form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error', 'has-success');
      const errorMsg = group.querySelector('.error-message');
      if (errorMsg) errorMsg.textContent = '';
    });
  }

  clearFieldError(fieldName) {
    const input = this.form.querySelector(`[name="${fieldName}"], #${fieldName}`);
    if (!input) return;

    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('has-error', 'has-success');
      const errorMsg = formGroup.querySelector('.error-message');
      if (errorMsg) errorMsg.textContent = '';
    }

    input.addEventListener('input', () => {
      const result = this.validateField(fieldName, input.value);
      if (result.valid) {
        formGroup.classList.remove('has-error');
        formGroup.classList.add('has-success');
      }
    }, { once: true });
  }
}

// ── Sanitization ────────────────────────────────────────
export function sanitizeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function sanitizeInput(input) {
  return input.replace(/[<>\"']/g, match => ({
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[match]));
}

// ── Formatting & Utilities ──────────────────────────────
export function formatDate(timestamp) {
  if (!timestamp) return '-';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text, len = 100) {
  if (!text) return '';
  return text.length > len ? text.substring(0, len) + '...' : text;
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// ── Table Utilities ────────────────────────────────────
export class TableManager {
  constructor(tableId) {
    this.table = document.getElementById(tableId);
    this.tbody = this.table.querySelector('tbody');
    this.data = [];
    this.sortField = null;
    this.sortDirection = 'asc';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.filteredData = [];
  }

  setData(data) {
    this.data = data;
    this.filteredData = [...data];
  }

  sort(field) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (this.sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    this.currentPage = 1;
    this.render();
  }

  search(query, searchFields) {
    const q = query.toLowerCase();
    this.filteredData = this.data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(q);
      })
    );
    this.currentPage = 1;
    this.render();
  }

  filter(predicate) {
    this.filteredData = this.data.filter(predicate);
    this.currentPage = 1;
    this.render();
  }

  getPaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredData.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  render() {
    // Override in subclass
  }
}

// ── Loading Skeleton ────────────────────────────────────
export function createSkeletonRow(columns = 5) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td colspan="${columns}" style="padding: 12px;">
      <div style="display: flex; gap: 16px;">
        ${Array(columns).fill().map(() => '<div class="skeleton" style="flex: 1; height: 16px; border-radius: 4px;"></div>').join('')}
      </div>
    </td>
  `;
  return row;
}

export function showLoadingSkeleton(tbody, rowCount = 3, colCount = 5) {
  tbody.innerHTML = '';
  for (let i = 0; i < rowCount; i++) {
    tbody.appendChild(createSkeletonRow(colCount));
  }
}

// ── Date Range Utilities ────────────────────────────────
export function getDateRange(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
}

export function isDateInRange(date, startDate, endDate) {
  const d = date.toDate ? date.toDate() : new Date(date);
  return d >= startDate && d <= endDate;
}

// ── Debounce & Throttle ────────────────────────────────
export function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export function throttle(func, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ── Export utilities ────────────────────────────────────
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) {
    toastManager.error('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        let value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  toastManager.success('Data exported successfully');
}

// ── Markdown Renderer (safe, minimal) ───────────────────
// Escapes HTML first, then converts a practical markdown subset:
// headings, bold/italic, inline code, fenced code blocks, ul/ol lists,
// and http(s)-only markdown links. Anything else renders as plain text.
export function renderMarkdown(text) {
  if (!text) return '';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Protect fenced code blocks with placeholders
  const codeBlocks = [];
  let src = String(text).replace(/```([\w-]*)\n?([\s\S]*?)```/g, (m, lang, code) => {
    codeBlocks.push(code);
    return `\u0000CODE${codeBlocks.length - 1}\u0000`;
  });

  src = esc(src);

  const inline = (s) => s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\n])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  const lines = src.split(/\r?\n/);
  let html = '';
  let listType = null; // 'ul' | 'ol'
  const closeList = () => { if (listType) { html += `</${listType}>`; listType = null; } };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const codeMatch = line.trim().match(/^\u0000CODE(\d+)\u0000$/);
    if (codeMatch) {
      closeList();
      html += `<pre class="md-pre"><code>${esc(codeBlocks[+codeMatch[1]].replace(/\n$/, ''))}</code></pre>`;
      continue;
    }
    if (!line.trim()) { closeList(); continue; }

    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      closeList();
      html += `<div class="md-h">${inline(m[2])}</div>`;
    } else if ((m = line.match(/^[-*\u2022]\s+(.*)$/))) {
      if (listType !== 'ul') { closeList(); html += '<ul class="md-list">'; listType = 'ul'; }
      html += `<li>${inline(m[1])}</li>`;
    } else if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
      if (listType !== 'ol') { closeList(); html += '<ol class="md-list">'; listType = 'ol'; }
      html += `<li>${inline(m[1])}</li>`;
    } else {
      closeList();
      html += `<p class="md-p">${inline(line)}</p>`;
    }
  }
  closeList();
  return html;
}

// ── AI API Fallback Handler ─────────────────────────────
// Tries OpenRouter first, falls back to Gemini if OpenRouter fails
export class AIApiHandler {
  constructor() {
    // Safe runtime detection for environment variables. When files are served
    // directly (no bundler), `import.meta.env` is undefined in the browser.
    // Fall back to `window.__APP_CONFIG__` or `localStorage` if available so
    // the AI features work in preview mode.
    const importEnv = (import.meta && import.meta.env) ? import.meta.env : null;
    const windowConfig = (typeof window !== 'undefined' && window.__APP_CONFIG__) ? window.__APP_CONFIG__ : null;

    this.openRouterKey = (importEnv && importEnv.VITE_OPENROUTER_API_KEY) ||
                         (windowConfig && windowConfig.VITE_OPENROUTER_API_KEY) ||
                         (typeof localStorage !== 'undefined' ? localStorage.getItem('openrouter_api_key') : null) ||
                         null;

    this.geminiKey = (importEnv && importEnv.VITE_GEMINI_API_KEY) ||
                     (windowConfig && windowConfig.VITE_GEMINI_API_KEY) ||
                     (typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') : null) ||
                     null;

    this.openRouterModel = 'poolside/laguna-s-2.1:free';
    this.geminiModel = 'gemini-3.8-flash';
  }

  async generateResponse(prompt, conversationHistory = []) {
    const systemPrompt = `You are an AI logistics assistant for CrownPrevail Logistics company in Nigeria. You help with:
- Financial analysis (income, expenses, profit/loss tracking)
- Invoice generation and management
- Shipment tracking and optimization
- Performance analytics and forecasting
- Business recommendations and insights
- Report generation
Be concise, professional, and data-driven. Provide actionable insights. Use Nigerian Naira (₦) for currency.

FORMAT RULES (important):
- Structure every answer: begin with a short **Bold heading**, then bullet lists (- item) or numbered steps.
- Bold key figures like ₦ amounts, percentages, and counts.
- Keep paragraphs to 1-2 sentences max; never write walls of text.
- Use markdown tables only when comparing 3+ items across attributes.
- Never output raw HTML. Default to 180 words or fewer unless the user asks for detail.`;

    // Try OpenRouter first if key is available
    if (this.openRouterKey) {
      try {
        const result = await this.callOpenRouter(prompt, conversationHistory, systemPrompt);
        return { success: true, response: result, provider: 'OpenRouter' };
      } catch (err) {
        console.warn('OpenRouter failed, trying Gemini:', err.message);
      }
    }

    // Fallback to Gemini if OpenRouter fails or no key
    if (this.geminiKey) {
      try {
        const result = await this.callGemini(prompt, conversationHistory, systemPrompt);
        return { success: true, response: result, provider: 'Gemini' };
      } catch (err) {
        console.error('Gemini failed:', err.message);
      }
    }

    // No API keys available
    return { 
      success: false, 
      error: 'No API keys configured. Please add VITE_OPENROUTER_API_KEY or VITE_GEMINI_API_KEY to .env file.' 
    };
  }

  async callOpenRouter(prompt, conversationHistory, systemPrompt) {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: prompt }
    ];

    // Rotate through known-good free models — free tiers go down often
    const models = [this.openRouterModel, 'poolside/laguna-xs-2.1:free', 'nvidia/nemotron-3.5-super-vl:free']
      .filter((m, i, a) => a.indexOf(m) === i);
    let lastErr = null;
    for (const model of models) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: AbortSignal.timeout(45000),
          headers: {
            'Authorization': `Bearer ${this.openRouterKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            max_tokens: 500,
            temperature: 0.7
          })
        });
        if (!response.ok) throw new Error(`OpenRouter API error: ${response.status}`);
        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return data.choices[0].message.content;
        }
        throw new Error('Invalid response from OpenRouter');
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('Invalid response from OpenRouter');
  }

  async callGemini(prompt, conversationHistory, systemPrompt) {
    // Build context from conversation history
    let context = `${systemPrompt}\n\n`;
    conversationHistory.forEach(msg => {
      context += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    context += `User: ${prompt}`;

    // Specific model first, then the always-available latest alias
    const models = [this.geminiModel, 'gemini-flash-latest'].filter((m, i, a) => a.indexOf(m) === i);
    let lastErr = null;
    for (const model of models) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiKey}`, {
          method: 'POST',
          signal: AbortSignal.timeout(20000),
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: context }]
            }]
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Gemini API error: ${errorData.error?.message || response.status}`);
        }
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
        throw new Error('Invalid response from Gemini');
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('Invalid response from Gemini');
  }

  hasAvailableKey() {
    return !!this.openRouterKey || !!this.geminiKey;
  }
}

export const aiApiHandler = new AIApiHandler();
