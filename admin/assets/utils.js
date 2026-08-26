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
