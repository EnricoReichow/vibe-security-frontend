// Fluxo de 2 passos do card "Comece já":
// 1) Nome + e-mail -> Formspree A
// 2) Profissão/empresa -> Formspree B
// Depois do passo 2, agradece e volta pro passo 1 (pronto pra próxima pessoa).
// Estado só em memória — se der F5, reseta.
(function () {
  const card = document.getElementById('signup-card');
  if (!card) return;

  const step1 = document.getElementById('signup-step-1');
  const step2 = document.getElementById('signup-step-2');
  const form1 = document.getElementById('signup-form-1');
  const form2 = document.getElementById('signup-form-2');
  const status = document.getElementById('signup-status');
  const thanksTitle = document.getElementById('signup-thanks-title');
  const hiddenNome = document.getElementById('signup-hidden-nome');
  const hiddenEmail = document.getElementById('signup-hidden-email');

  function setStatus(text, isError) {
    status.textContent = text || '';
    status.classList.toggle('is-error', !!isError);
  }

  function showStep(step) {
    step1.hidden = step !== 1;
    step2.hidden = step !== 2;
  }

  async function submitViaAjax(form) {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    return response.ok;
  }

  async function handleSubmit(form, onSuccess) {
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    setStatus('');

    let ok = false;
    try {
      ok = await submitViaAjax(form);
    } catch (err) {
      ok = false;
    }

    btn.disabled = false;
    btn.textContent = original;

    if (ok) {
      onSuccess();
    } else {
      setStatus('Não foi possível enviar agora. Tenta de novo em instantes.', true);
    }
  }

  form1.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmit(form1, () => {
      const nome = form1.querySelector('#signup-nome').value.trim();
      const email = form1.querySelector('#signup-email').value.trim();
      hiddenNome.value = nome;
      hiddenEmail.value = email;
      thanksTitle.textContent = nome ? `Obrigado, ${nome}!` : 'Obrigado!';
      form1.reset();
      showStep(2);
    });
  });

  form2.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmit(form2, () => {
      form2.reset();
      step2.hidden = true;
      setStatus('Recebemos seu interesse! Obrigado.');
      setTimeout(() => {
        setStatus('');
        showStep(1);
      }, 2500);
    });
  });
})();
