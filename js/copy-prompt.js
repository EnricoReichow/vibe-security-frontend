// Copia o texto do prompt de correção para a área de transferência.
(function () {
  document.querySelectorAll('.js-copy-prompt').forEach((btn) => {
    const original = btn.textContent;
    const targetId = btn.dataset.copyTarget;
    const target = targetId && document.getElementById(targetId);
    if (!target) return;

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        btn.textContent = 'Copiado ✓';
      } catch (err) {
        btn.textContent = 'Não foi possível copiar';
      }
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    });
  });
})();
