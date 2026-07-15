import assert from 'node:assert/strict';
import { FORMATIONS, RARITY_MODELS, rarityOf } from '../assets/js/config.js';
import { drawRound, findBestAvailableSlot, selectCard, autoDraft } from '../assets/js/draft-engine.js';
import { makePlayer } from '../assets/js/state.js';

const stats={rounds:0,mixedCountries:0,mixedYears:0,multipleLegends:0,fourEpics:0,fourSamePosition:0,blockedCards:0,roundsWithoutUsableCard:0,duplicates:0,rarities:{common:0,rare:0,epic:0,legendary:0}};
for(let i=0;i<5000;i++){
  const p=makePlayer(`stat-${i}`);p.formation=Object.keys(FORMATIONS)[i%3];
  const round=drawRound(p);stats.rounds++;
  const countries=new Set(round.cards.map(c=>c.country)),years=new Set(round.cards.map(c=>c.year));
  if(countries.size>1)stats.mixedCountries++;if(years.size>1)stats.mixedYears++;
  const rarities=round.cards.map(c=>rarityOf(c.overall));rarities.forEach(r=>stats.rarities[r]++);
  if(rarities.filter(r=>r==='legendary').length>1)stats.multipleLegends++;
  if(rarities.filter(r=>r==='epic').length===4)stats.fourEpics++;
  if(new Set(round.cards.map(c=>c.position)).size===1)stats.fourSamePosition++;
  const usable=round.cards.filter(card=>findBestAvailableSlot(card,p)>=0);stats.blockedCards+=4-usable.length;if(!usable.length)stats.roundsWithoutUsableCard++;
}
for(const formation of Object.keys(FORMATIONS))for(let run=0;run<30;run++){
  const lineup=autoDraft(formation);assert.equal(lineup.length,11);assert.equal(new Set(lineup.map(p=>p.id)).size,11);if(new Set(lineup.map(p=>p.id)).size!==11)stats.duplicates++;
}
assert.equal(stats.mixedCountries,0);assert.equal(stats.mixedYears,0);assert.equal(stats.multipleLegends,0);assert.equal(stats.fourEpics,0);assert.equal(stats.fourSamePosition,0);assert.equal(stats.roundsWithoutUsableCard,0);assert.equal(stats.duplicates,0);
assert.ok(stats.rarities.common+stats.rarities.rare>stats.rarities.epic+stats.rarities.legendary,'comuns e raras não predominam');
console.log(JSON.stringify(stats,null,2));
