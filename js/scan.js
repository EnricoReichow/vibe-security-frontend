// Simula o progresso da varredura (sem varredura real). Ao final, revela
// o botão "Ver feedback" em vez de redirecionar sozinho. Prototipo: sem
// chamadas de rede.
(function () {
  const items = document.querySelectorAll('.scan-item');
  const fill = document.getElementById('scan-progress-fill');
  const statusEl = document.getElementById('scan-status-text');
  const cta = document.getElementById('scan-cta');
  const ctaButton = document.getElementById('scan-cta-button');

  // Cenário mockado: só o cargo "Desenvolvimento" dá resultado seguro,
  // todos os outros cargos (ou nenhum informado) caem em não seguro.
  const cargo = new URLSearchParams(window.location.search).get('cargo');
  const redirectTo = cargo === 'desenvolvimento'
    ? 'resultado-seguro.html'
    : (document.body.dataset.scanRedirect || 'resultado-nao-seguro.html');

  if (!items.length || !fill) return;

  const DEFAULT_STEP_MS = 650;
  let i = 0;

  function step() {
    if (i > 0) {
      items[i - 1].classList.remove('is-active');
      items[i - 1].classList.add('is-done');
    }

    if (i >= items.length) {
      fill.style.width = '100%';
      if (statusEl) statusEl.textContent = 'Concluído';
      if (cta) cta.style.display = 'block';
      return;
    }

    const currentItem = items[i];
    currentItem.classList.add('is-active');
    fill.style.width = Math.round(((i + 0.5) / items.length) * 100) + '%';
    const duration = parseInt(currentItem.dataset.duration, 10) || DEFAULT_STEP_MS;
    i += 1;
    setTimeout(step, duration);
  }

  setTimeout(step, 400);

  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      const url = new URL(redirectTo, window.location.href);
      if (cargo) url.searchParams.set('cargo', cargo);
      window.location.href = url.toString();
    });
  }
})();
