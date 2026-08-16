// Lista de arquivos/pastas selecionados para upload.
// Estado guardado só em memória (variável JS) — some ao recarregar a página, de propósito.
(function () {
  const fileInput = document.getElementById('arquivo-upload');
  const dirInput = document.getElementById('pasta-upload');
  const listEl = document.getElementById('upload-list');

  if (!fileInput || !dirInput || !listEl) return;

  let uploaded = [];
  let expanded = false;
  const VISIBLE_LIMIT = 3;

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function addFiles(fileList) {
    Array.from(fileList).forEach((file) => {
      const path = file.webkitRelativePath || file.name;
      const key = path + '|' + file.size;
      if (uploaded.some((f) => f.key === key)) return;
      uploaded.push({ key, path, size: file.size });
    });
    render();
  }

  function removeFile(key) {
    uploaded = uploaded.filter((f) => f.key !== key);
    if (uploaded.length <= VISIBLE_LIMIT) expanded = false;
    render();
  }

  function render() {
    if (uploaded.length === 0) {
      listEl.innerHTML = '';
      listEl.style.display = 'none';
      return;
    }

    listEl.style.display = 'flex';
    const totalSize = uploaded.reduce((sum, f) => sum + f.size, 0);
    const label = uploaded.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados';

    const summary = `<div class="upload-list__summary">${uploaded.length} ${label} · ${formatSize(totalSize)}</div>`;

    const visible = expanded ? uploaded : uploaded.slice(0, VISIBLE_LIMIT);
    const hiddenCount = uploaded.length - visible.length;

    const items = visible.map((f) => `
      <div class="upload-item">
        <span class="upload-item__name" title="${escapeHtml(f.path)}">${escapeHtml(f.path)}</span>
        <span class="upload-item__meta">${formatSize(f.size)}</span>
        <button type="button" class="upload-item__remove" data-key="${escapeHtml(f.key)}" aria-label="Remover ${escapeHtml(f.path)}">×</button>
      </div>
    `).join('');

    let toggle = '';
    if (hiddenCount > 0) {
      toggle = `<button type="button" class="upload-list__toggle" id="upload-list-toggle">Mostrar mais (+${hiddenCount})</button>`;
    } else if (expanded && uploaded.length > VISIBLE_LIMIT) {
      toggle = `<button type="button" class="upload-list__toggle" id="upload-list-toggle">Mostrar menos</button>`;
    }

    listEl.innerHTML = summary + items + toggle;

    listEl.querySelectorAll('.upload-item__remove').forEach((btn) => {
      btn.addEventListener('click', () => removeFile(btn.dataset.key));
    });

    const toggleBtn = document.getElementById('upload-list-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        expanded = !expanded;
        render();
      });
    }
  }

  fileInput.addEventListener('change', () => addFiles(fileInput.files));
  dirInput.addEventListener('change', () => addFiles(dirInput.files));
})();
