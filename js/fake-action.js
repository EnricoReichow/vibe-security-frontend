// Feedback visual para ações que não têm back-end real neste protótipo
// (exportar relatório, copiar selo, encaminhar resumo) — evita a sensação
// de botão que "não faz nada" ao clicar.
(function () {
  document.querySelectorAll('.js-fake-action').forEach((btn) => {
    const original = btn.textContent;
    const done = btn.dataset.done || 'Concluído ✓';
    let resetTimer = null;

    btn.addEventListener('click', () => {
      btn.textContent = done;
      btn.disabled = true;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 2200);
    });
  });
})();
