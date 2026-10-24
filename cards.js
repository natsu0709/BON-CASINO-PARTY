// トランプ共通（ブラックジャック・バカラ・ポーカーで使い回す）
const Cards = (() => {
  const SUITS = ['♠', '♥', '♦', '♣'];
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Math.random より偏りの少ない乱数
  function randInt(n) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / n) * n;
    do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
    return buf[0] % n;
  }

  function shoe(decks = 1) {
    const cards = [];
    for (let d = 0; d < decks; d++)
      for (const s of SUITS) for (const r of RANKS) cards.push({ r, s });
    for (let i = cards.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  function el(card, faceDown = false, anim = false) {
    const div = document.createElement('div');
    div.className = 'card' + (faceDown ? ' back' : '') + (anim ? ' anim' : '') +
      (card.s === '♥' || card.s === '♦' ? ' red' : '');
    div.innerHTML =
      `<span class="rank">${card.r}${card.s}</span>` +
      `<span class="suit-big">${card.s}</span>` +
      `<span class="rank bottom">${card.r}${card.s}</span>`;
    return div;
  }

  return { shoe, el, randInt };
})();
