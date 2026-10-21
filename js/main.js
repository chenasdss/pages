/**
 * MySite 交互脚本
 * 1. 明暗主题切换（记忆到 localStorage）
 * 2. 点击计数器
 * 3. 滚动渐入动画
 * 4. 名字列表增删
 */
(() => {
  'use strict';

  /* ========== 1. 主题切换 ========== */
  const THEME_KEY = 'mysite-theme';
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色主题' : '切换到深色主题');
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  toggleBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ========== 2. 计数器 ========== */
  const COUNT_KEY = 'mysite-count';
  const counterEl = document.getElementById('counter');
  const countBtn = document.getElementById('count-btn');

  let count = Number(localStorage.getItem(COUNT_KEY)) || 0;
  if (counterEl) counterEl.textContent = String(count);

  countBtn?.addEventListener('click', () => {
    count += 1;
    localStorage.setItem(COUNT_KEY, String(count));
    if (counterEl) {
      counterEl.textContent = String(count);
      counterEl.classList.remove('bump');
      // 强制重排以重新触发动画
      void counterEl.offsetWidth;
      counterEl.classList.add('bump');
    }
  });

  /* ========== 3. 滚动渐入 ========== */
  const cards = document.querySelectorAll('.card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((card) => observer.observe(card));
  } else {
    cards.forEach((card) => card.classList.add('visible'));
  }

  /* ========== 4. 名字列表 ========== */
  const NAMES_KEY = 'mysite-names';
  const form = document.getElementById('message-form');
  const input = document.getElementById('name-input');
  const hint = document.getElementById('form-hint');
  const list = document.getElementById('message-list');

  function loadNames() {
    try {
      const raw = JSON.parse(localStorage.getItem(NAMES_KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((n) => typeof n === 'string') : [];
    } catch {
      return [];
    }
  }

  let names = loadNames();

  function saveNames() {
    localStorage.setItem(NAMES_KEY, JSON.stringify(names));
  }

  function renderNames() {
    if (!list) return;
    list.innerHTML = '';

    if (names.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'empty-hint';
      empty.textContent = '还没有人留言，来当第一个吧～';
      list.appendChild(empty);
      return;
    }

    names.forEach((name, index) => {
      const li = document.createElement('li');
      li.textContent = name;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '×';
      removeBtn.title = '删除';
      removeBtn.setAttribute('aria-label', `删除 ${name}`);
      removeBtn.addEventListener('click', () => {
        names.splice(index, 1);
        saveNames();
        renderNames();
      });

      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  }

  function setHint(text, isError = false) {
    if (!hint) return;
    hint.textContent = text;
    hint.classList.toggle('error', isError);
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = (input?.value || '').trim();

    if (!value) {
      setHint('请先输入一个名字。', true);
      input?.focus();
      return;
    }

    if (names.includes(value)) {
      setHint(`“${value}” 已经在列表里了。`, true);
      return;
    }

    if (names.length >= 12) {
      setHint('最多只能添加 12 个名字，先删掉几个吧。', true);
      return;
    }

    names.push(value);
    saveNames();
    renderNames();
    setHint(`已添加：${value}`);
    if (input) {
      input.value = '';
      input.focus();
    }
  });

  renderNames();

  /* ========== 5. 年份与导航高亮 ========== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => navObserver.observe(section));
  }
})();
