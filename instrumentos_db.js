document.addEventListener('DOMContentLoaded', () => {
  const conteudo = document.getElementById('instrumentosConteudo');
  const detalhes = document.getElementById('instrumentosDetalhes');
  if (!conteudo || !detalhes) return;

  function abrirInstrumento(inst) {
    // Highlight active item
    const items = conteudo.querySelectorAll('.instrumento-item');
    items.forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-inst') === inst);
    });

    detalhes.innerHTML = `<div class="instrumento-admin">
      <h3>${inst}</h3>
      <div class="add-musico-form">
        <input id="novoMusicoNome" placeholder="Nome do novo músico para ${inst}..." autocomplete="off">
        <button id="addMusicoBtn">+ Adicionar</button>
      </div>
      <div id="listaMusicos"></div>
    </div>`;

    function renderLista() {
      const db = (typeof obterBancoMusicos === 'function') ? obterBancoMusicos() : {};
      const lista = document.getElementById('listaMusicos');
      if (!lista) return;
      lista.innerHTML = '';
      const musicos = db[inst] || [];
      if (musicos.length === 0) {
        lista.innerHTML = '<div class="empty-state" style="padding:16px 0;"><div class="empty-text">Nenhum músico cadastrado para este instrumento.</div></div>';
        return;
      }
      musicos.forEach((m, idx) => {
        const row = document.createElement('div');
        row.className = 'musico-row';
        row.innerHTML = `<span>${m.nome}</span>
        <div class="musico-row-actions">
          <button class="toggle ${m.ativo ? 'ativo' : 'inativo'}">${m.ativo ? '🟢 Ativo' : '⚪ Inativo'}</button>
          <button class="edit" title="Editar nome">✏️</button>
          <button class="del" title="Excluir">🗑️</button>
        </div>`;
        const btns = row.querySelectorAll('button');
        btns[0].onclick = () => {
          const db = obterBancoMusicos();
          db[inst][idx].ativo = !db[inst][idx].ativo;
          salvarBancoMusicos(db);
          renderLista();
          renderInstrumentosTabsOnly();
          if (typeof renderizar === 'function') renderizar();
        };
        btns[1].onclick = () => {
          const nome = prompt('Editar nome do músico:', m.nome);
          if (nome && nome.trim()) {
            const db = obterBancoMusicos();
            db[inst][idx].nome = nome.trim();
            salvarBancoMusicos(db);
            renderLista();
            if (typeof renderizar === 'function') renderizar();
          }
        };
        btns[2].onclick = () => {
          if (confirm(`Excluir ${m.nome} de ${inst}?`)) {
            const db = obterBancoMusicos();
            db[inst].splice(idx, 1);
            salvarBancoMusicos(db);
            renderLista();
            renderInstrumentosTabsOnly();
            if (typeof renderizar === 'function') renderizar();
          }
        };
        lista.appendChild(row);
      });
    }
    renderLista();

    const addBtn = document.getElementById('addMusicoBtn');
    const input = document.getElementById('novoMusicoNome');
    function adicionar() {
      const nome = input ? input.value.trim() : '';
      if (!nome) return;
      const db = obterBancoMusicos();
      db[inst] = db[inst] || [];
      db[inst].push({ nome, ativo: true });
      salvarBancoMusicos(db);
      if (input) input.value = '';
      renderLista();
      renderInstrumentosTabsOnly();
      if (typeof renderizar === 'function') renderizar();
    }
    if (addBtn) addBtn.onclick = adicionar;
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') adicionar();
      });
    }
  }

  function renderInstrumentosTabsOnly() {
    const db = (typeof obterBancoMusicos === 'function') ? obterBancoMusicos() : {};
    const insts = Object.keys(db);
    const activeItem = conteudo.querySelector('.instrumento-item.active');
    const activeInst = activeItem ? activeItem.getAttribute('data-inst') : null;

    conteudo.innerHTML = '';
    insts.forEach((inst) => {
      const el = document.createElement('div');
      el.className = 'instrumento-item' + (activeInst === inst ? ' active' : '');
      el.setAttribute('data-inst', inst);
      const ativos = (db[inst] || []).filter(m => m.ativo).length;
      const total = (db[inst] || []).length;
      el.innerHTML = `<strong>${inst}</strong> <span style="font-size:12px;opacity:.7;">(${ativos}/${total})</span>`;
      el.onclick = () => abrirInstrumento(inst);
      conteudo.appendChild(el);
    });
  }

  window.renderInstrumentos = function () {
    const db = (typeof obterBancoMusicos === 'function') ? obterBancoMusicos() : {};
    conteudo.innerHTML = '';
    detalhes.innerHTML = '';
    const insts = Object.keys(db);
    insts.forEach((inst, i) => {
      const el = document.createElement('div');
      el.className = 'instrumento-item' + (i === 0 ? ' active' : '');
      el.setAttribute('data-inst', inst);
      const ativos = (db[inst] || []).filter(m => m.ativo).length;
      const total = (db[inst] || []).length;
      el.innerHTML = `<strong>${inst}</strong> <span style="font-size:12px;opacity:.7;">(${ativos}/${total})</span>`;
      el.onclick = () => abrirInstrumento(inst);
      conteudo.appendChild(el);
      if (i === 0) abrirInstrumento(inst);
    });
  };
});
