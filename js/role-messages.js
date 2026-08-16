// Adapta a explicação "simples" de cada vulnerabilidade ao cargo escolhido
// em perfil.html (recebido via query string ?cargo=). Sem cargo reconhecido
// (ex.: "outro"), mantém o texto genérico já presente no HTML.
(function () {
  const CARGO_LABELS = {
    infraestrutura: 'Infraestrutura',
    desenvolvimento: 'Desenvolvimento',
    produto: 'Produto / Design',
    fundador: 'Fundador(a) / Empreendedor(a)',
  };

  const MESSAGES = {
    1: {
      infraestrutura: 'Uma credencial de acesso à conta de pagamentos está gravada dentro do código-fonte, sem nenhuma proteção. Se esse repositório vazar ou for acessado por alguém sem permissão, essa credencial vai junto: trate como se ela já estivesse comprometida, revogue o acesso atual e gere uma nova o quanto antes.',
      desenvolvimento: 'Uma chave de API da Stripe ficou hardcoded no código e foi commitada no histórico do Git. Revogue essa chave agora, mova o valor para uma variável de ambiente e confirme que .env está no .gitignore antes de seguir.',
      produto: 'Encontramos uma senha de acesso ao sistema de pagamentos exposta dentro do código do produto. Isso é sério: enquanto não for corrigido, existe risco real de alguém acessar indevidamente os pagamentos dos seus usuários. Priorize essa correção antes de qualquer lançamento.',
      fundador: 'Encontramos uma credencial de pagamentos exposta no código do seu produto: hoje, alguém com acesso ao código poderia mexer na sua conta de pagamentos. Fale com quem cuida do desenvolvimento (ou siga o passo a passo abaixo) antes de publicar ou divulgar o projeto.',
    },
    2: {
      infraestrutura: 'Uma biblioteca usada pelo sistema está numa versão com falha de segurança já documentada publicamente, com identificador oficial (CVE). Priorize a atualização dessa dependência no próximo ciclo de manutenção: esse tipo de brecha é conhecido e costuma ser explorado de forma automatizada.',
      desenvolvimento: 'O lodash está numa versão vulnerável a prototype pollution (CVE-2020-8203). Atualize para 4.17.21 ou mais recente e rode a suíte de testes antes de subir a mudança.',
      produto: 'Uma das peças internas que sustentam o produto está desatualizada e tem uma falha de segurança conhecida publicamente. Não afeta a experiência visível do usuário agora, mas é um risco real enquanto não for atualizada. Vale entrar na próxima janela de manutenção técnica.',
      fundador: 'O time usa uma ferramenta interna de código que está desatualizada e tem uma falha de segurança já conhecida por qualquer pessoa que pesquisar sobre ela. É uma correção rápida e de baixo custo: peça para o time atualizá-la ainda esta semana.',
    },
    3: {
      infraestrutura: 'O endpoint que recebe pedidos aceita qualquer dado enviado, sem validação. Isso aumenta a superfície de ataque do sistema e pode servir de porta de entrada para outras explorações. Vale revisar junto com o time de desenvolvimento e, se possível, reforçar a validação também na camada de proxy/gateway.',
      desenvolvimento: 'POST /api/pedidos não valida o corpo da requisição. Adicione validação de schema (zod, joi ou similar) e rejeite com status 400 qualquer payload fora do formato esperado.',
      produto: 'A parte do sistema que recebe novos pedidos aceita informações sem checar se fazem sentido antes de usar. Na prática, isso pode ser explorado para gerar comportamentos inesperados no fluxo de pedidos. Vale alinhar com o time técnico antes de divulgar essa funcionalidade.',
      fundador: 'A área do sistema que recebe pedidos de clientes aceita qualquer informação enviada, sem checar se ela é válida antes de processar. Alguém mal-intencionado pode usar isso para burlar o fluxo normal de pedidos. Peça para o time técnico adicionar essa checagem antes de crescer o volume de uso.',
    },
    4: {
      infraestrutura: 'O servidor não está configurado para enviar os cabeçalhos HTTP de segurança recomendados. É uma configuração simples, de baixo risco de quebrar algo: vale incluir no próximo deploy.',
      desenvolvimento: 'Faltam cabeçalhos de segurança (CSP, X-Content-Type-Options, HSTS). Adicione o helmet (se for Node/Express) para configurar isso automaticamente.',
      produto: 'Falta uma camada extra de proteção técnica no site, que ajuda a bloquear alguns tipos de ataque no navegador de quem acessa. É de baixa prioridade e não deve travar seu cronograma de lançamento, mas vale incluir no roadmap técnico.',
      fundador: 'É uma proteção técnica simples que está faltando no seu site, algo como um cadeado extra na porta. Não é urgente, mas é barato de resolver: peça para o time incluir na próxima atualização.',
    },
  };

  const cargo = new URLSearchParams(window.location.search).get('cargo');
  const label = CARGO_LABELS[cargo];

  const badge = document.getElementById('cargo-badge');
  const labelEl = document.getElementById('cargo-label');
  if (label && badge && labelEl) {
    labelEl.textContent = label;
    badge.style.display = 'inline-flex';
  }

  if (!label) return;

  document.querySelectorAll('.vuln-simple[data-vuln-id]').forEach((el) => {
    const id = el.getAttribute('data-vuln-id');
    const text = MESSAGES[id] && MESSAGES[id][cargo];
    if (text) el.textContent = text;
  });
})();
