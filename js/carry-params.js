// Repassa parâmetros recebidos na URL (ex.: cargo escolhido em perfil.html)
// para campos ocultos do formulário desta página, para que sigam adiante
// na navegação (tudo via query string, sem localStorage).
(function () {
  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll('[data-carry-param]').forEach((el) => {
    const key = el.getAttribute('data-carry-param');
    if (params.has(key)) el.value = params.get(key);
  });
})();
