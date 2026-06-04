
document.addEventListener('DOMContentLoaded', ()=>{
 const conteudo=document.getElementById('instrumentosConteudo');
 const detalhes=document.getElementById('instrumentosDetalhes');
 if(!conteudo||!detalhes) return;

 function abrirInstrumento(inst){
   detalhes.innerHTML=`<div class="instrumento-admin">
   <h3>${inst}</h3>
   <input id="novoMusicoNome" placeholder="Nome do músico">
   <button id="addMusicoBtn">Adicionar</button>
   <div id="listaMusicos"></div></div>`;

   function renderLista(){
     const db=obterBancoMusicos();
     const lista=document.getElementById('listaMusicos');
     lista.innerHTML='';
     (db[inst]||[]).forEach((m,idx)=>{
       const row=document.createElement('div');
       row.className='musico-row';
       row.innerHTML=`<span>${m.nome}</span>
       <button class="toggle">${m.ativo?'🟢 Ligado':'🔴 Desligado'}</button>
       <button class="edit">✏️</button>
       <button class="del">🗑️</button>`;
       const btns=row.querySelectorAll('button');
       btns[0].onclick=()=>{const db=obterBancoMusicos();db[inst][idx].ativo=!db[inst][idx].ativo;salvarBancoMusicos(db);renderLista();};
       btns[1].onclick=()=>{const nome=prompt('Editar músico',m.nome); if(nome){const db=obterBancoMusicos();db[inst][idx].nome=nome;salvarBancoMusicos(db);renderLista();}};
       btns[2].onclick=()=>{if(confirm('Excluir músico?')){const db=obterBancoMusicos();db[inst].splice(idx,1);salvarBancoMusicos(db);renderLista();}};
       lista.appendChild(row);
     });
   }
   renderLista();

   document.getElementById('addMusicoBtn').onclick=()=>{
      const nome=document.getElementById('novoMusicoNome').value.trim();
      if(!nome) return;
      const db=obterBancoMusicos();
      db[inst]=db[inst]||[];
      db[inst].push({nome,ativo:true});
      salvarBancoMusicos(db);
      document.getElementById('novoMusicoNome').value='';
      renderLista();
   };
 }
 setTimeout(()=>{
   window.renderInstrumentos=function(){
     const db=obterBancoMusicos();
     conteudo.innerHTML='';
     Object.keys(db).forEach(inst=>{
       const el=document.createElement('div');
       el.className='instrumento-item';
       el.innerHTML='<strong>'+inst+'</strong>';
       el.onclick=()=>abrirInstrumento(inst);
       conteudo.appendChild(el);
     });
   }
 },500);
});


/* Paginação automática para PDFs grandes */
(function(){
  function aplicarPaginacaoPDF(){
    const paginas = document.querySelectorAll('.print-page');
    paginas.forEach(pg=>{
      pg.style.maxHeight = 'unset';
      pg.style.overflow = 'visible';
    });

    const blocos = document.querySelectorAll('.print-dia,.culto-card,.evento-card,.evento-item');
    let contador = 0;

    blocos.forEach((b,i)=>{
      contador++;
      /* força nova página a cada vários blocos */
      if(contador >= 8){
        b.style.pageBreakBefore = 'always';
        b.style.breakBefore = 'page';
        contador = 0;
      }
    });
  }

  const oldPrint = window.print;
  window.print = function(){
    try{ aplicarPaginacaoPDF(); }catch(e){}
    return oldPrint ? oldPrint() : undefined;
  };
})();
