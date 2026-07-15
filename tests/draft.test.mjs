import assert from 'node:assert/strict';
import { FORMATIONS, rarityOf } from '../assets/js/config.js';
import { drawRound, compatibleSlot } from '../assets/js/draft-engine.js';

let legendaryMax=0;
for(const formation of Object.keys(FORMATIONS)){
  for(let run=0;run<50;run++){
    const p={formation,team:Array(11).fill(null)};
    while(p.team.some(x=>!x)){
      const round=drawRound(p);
      assert.equal(round.cards.length,4);
      const legends=round.cards.filter(x=>rarityOf(x.overall)==='legendary').length;
      legendaryMax=Math.max(legendaryMax,legends);assert.ok(legends<=1,'mais de uma carta lendária');
      for(const card of round.cards)assert.ok(compatibleSlot(p,card.position)>=0,`carta incompatível: ${card.position}`);
      const pick=round.cards[0],slot=compatibleSlot(p,pick.position);p.team[slot]=pick;
    }
    assert.equal(p.team.filter(Boolean).length,11);
  }
}
for(let i=0;i<500;i++){const p={formation:'4-3-3',team:Array(11).fill(null)};const round=drawRound(p);assert.ok(round.cards.filter(x=>x.position==='GK').length<4)}
console.log(`OK: 500 sorteios estatísticos + 150 drafts completos; máximo de lendárias por rodada: ${legendaryMax}`);
