// 画面の切り替えとロビー
const App = (() => {
  const app = document.getElementById('app');
  const fmt = n => n.toLocaleString('ja-JP');

  const GAMES = [
    { id: 'blackjack', name: 'ブラックジャック', icon: '🃏', desc: '21を目指せ', ready: true, open: () => Blackjack.showSettings(app, home) },
    { id: 'roulette', name: 'ルーレット', icon: '🎡', desc: '赤か黒か' },
    { id: 'poker', name: 'ポーカー', icon: '♠️', desc: 'テキサスホールデム' },
    { id: 'baccarat', name: 'バカラ', icon: '🎴', desc: 'プレイヤー or バンカー' },
    { id: 'chinchiro', name: 'チンチロ', icon: '🎲', desc: 'サイコロ3つで勝負' },
    { id: 'keiba', name: '競馬', icon: '🏇', desc: '1着を当てろ' },
    { id: 'pachinko', name: 'パチンコ', icon: '🔮', desc: '1人用' },
    { id: 'slot', name: 'パチスロ', icon: '🎰', desc: '1人用' },
  ];

  function home() {
    const d = Save.get();
    app.innerHTML = `
      <section class="hero">
        <h1>BON!</h1>
        <p>1人プレイ ・ ${fmt(Save.START)} BONからスタート</p>
      </section>
      <div class="stats">
        <div class="stat"><b>${fmt(d.balance)}</b><small>現在の所持金</small></div>
        <div class="stat"><b>${fmt(d.maxBalance)}</b><small>最大所持金</small></div>
        <div class="stat"><b>${d.resetCount}</b><small>リセット回数</small></div>
      </div>
      <div class="section-title">ゲームをえらぶ</div>
      <div class="game-grid">
        ${GAMES.map(g => `
          <button class="game-card" data-id="${g.id}" ${g.ready ? '' : 'disabled'}>
            <span class="badge ${g.ready ? 'live' : ''}">${g.ready ? 'PLAY' : '準備中'}</span>
            <span class="icon">${g.icon}</span>
            <b>${g.name}</b><small>${g.desc}</small>
          </button>`).join('')}
      </div>
      <div class="room-banner">👥 最大6人で遊べる「ルーム」は準備中です</div>
      <button class="text-btn" id="resetBtn">所持金をリセットする</button>`;

    app.querySelectorAll('.game-card').forEach(b => b.onclick = () => {
      GAMES.find(g => g.id === b.dataset.id).open();
      window.scrollTo(0, 0);
    });
    app.querySelector('#resetBtn').onclick = () => {
      if (confirm(`所持金を ${fmt(Save.START)} BON に戻します。リセット回数が1増えます。よろしいですか？`)) {
        Save.reset();
        toast('リセットしました');
        home();
      }
    };
  }

  let toastTimer;
  function toast(text) {
    const t = document.getElementById('toast');
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  Save.onChange(d => { document.getElementById('balance').textContent = fmt(d.balance); });
  document.getElementById('homeBtn').onclick = () => {
    if (app.querySelector('#hit')) return toast('ゲーム中は戻れません');
    home();
  };
  home();

  return { toast, home };
})();
