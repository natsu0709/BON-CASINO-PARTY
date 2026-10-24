// 1人プレイのセーブデータ（今はブラウザに保存。後でFirebaseに移行）
const Save = (() => {
  const KEY = 'bon-casino-solo-v1';
  const START = 25000;

  const fresh = () => ({
    balance: START,
    maxBalance: START,
    resetCount: 0,
    plays: {},   // ゲームごとのプレイ回数（称号用）
    wins: {},
  });

  let data;
  try {
    data = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {});
  } catch (e) {
    data = fresh();
  }

  const listeners = [];
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    listeners.forEach(fn => fn(data));
  }

  return {
    START,
    get: () => data,
    onChange: fn => { listeners.push(fn); fn(data); },
    // 賭け金を引く。足りなければ false
    take(amount) {
      if (amount <= 0 || amount > data.balance) return false;
      data.balance -= amount;
      persist();
      return true;
    },
    // 払い戻し（賭け金込み）
    pay(amount) {
      data.balance += amount;
      if (data.balance > data.maxBalance) data.maxBalance = data.balance;
      persist();
    },
    recordPlay(game, won) {
      data.plays[game] = (data.plays[game] || 0) + 1;
      if (won) data.wins[game] = (data.wins[game] || 0) + 1;
      persist();
    },
    // 所持金0、またはリセットボタン
    reset() {
      data.balance = START;
      data.resetCount += 1;
      persist();
    },
  };
})();
