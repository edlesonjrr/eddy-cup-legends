import assert from 'node:assert/strict';
import { FORMATIONS, RARITY_MODELS, rarityOf } from '../assets/js/config.js';
import { drawRound, findBestAvailableSlot, selectCard, completeDraft, autoDraft, autoDraftByDifficulty } from '../assets/js/draft-engine.js';
import { makePlayer } from '../assets/js/state.js';
import { PLAYERS } from '../assets/js/players.js';
import { EXTRA_TIME_MS, MATCH_DURATION_MS, runMatch } from '../assets/js/simulator.js';
import { chemistry, legendaryCount, winProbabilities } from '../assets/js/competitive.js';

const stats={rounds:0,mixedCountries:0,mixedYears:0,multipleLegends:0,fourEpics:0,fourSamePosition:0,blockedCards:0,roundsWithoutUsableCard:0,duplicates:0,rarities:{common:0,rare:0,epic:0,legendary:0}};
assert.equal(MATCH_DURATION_MS,90000);assert.equal(EXTRA_TIME_MS,10000);stats.matchDuration=MATCH_DURATION_MS;
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
assert.equal(new Set(PLAYERS.map(player=>player.id)).size,PLAYERS.length,'IDs duplicados');
assert.equal(new Set(PLAYERS.map(player=>`${player.country}|${player.year}|${player.name}`)).size,PLAYERS.length,'mesma pessoa duplicada na mesma Copa');
assert.equal(PLAYERS.filter(player=>player.overall===105).length,1,'deve existir somente um overall 105');
assert.equal(PLAYERS.find(player=>player.overall===105)?.name,'Pelé');
for(const player of PLAYERS)assert.deepEqual(Object.keys(player).sort(),['country','id','name','overall','position','year']);
const local1=makePlayer('player1'),local2=makePlayer('player2');local1.formation='4-3-3';local2.formation='4-4-2';local1.rerolls--;local1.selectedPlayerIds.add('teste');assert.equal(local2.rerolls,3);assert.equal(local2.selectedPlayerIds.size,0);assert.notEqual(local1.lineup,local2.lineup);
const varietyPlayer=makePlayer('variety');varietyPlayer.formation='4-3-3';let previousCountry='',consecutiveCountryRepeats=0;for(let i=0;i<100;i++){const round=drawRound(varietyPlayer);if(round.country===previousCountry)consecutiveCountryRepeats++;previousCountry=round.country}assert.equal(consecutiveCountryRepeats,0,'país repetido em sorteios consecutivos');
let endgameChecks=0;for(const [formation,slots] of Object.entries(FORMATIONS))for(let emptyIndex=0;emptyIndex<slots.length;emptyIndex++){const p=makePlayer(`endgame-${formation}-${emptyIndex}`);p.formation=formation;p.lineup=p.lineup.map((_,index)=>index===emptyIndex?null:{id:`dummy-${index}`,name:'Preenchido',country:'Teste',year:2000,position:slots[index],overall:70});p.currentRound=10;const round=drawRound(p);assert.ok(round.cards.length>=1&&round.cards.length<=4);assert.ok(round.cards.every(card=>findBestAvailableSlot(card,p)>=0),'carta bloqueada no modo de conclusão');completeDraft(p);assert.equal(p.lineup.filter(Boolean).length,11);endgameChecks++}
stats.consecutiveCountryRepeats=consecutiveCountryRepeats;stats.totalPlayers=PLAYERS.length;
stats.endgameChecks=endgameChecks;
const simulationTeamA=autoDraft('4-3-3'),simulationTeamB=autoDraft('4-4-2'),simulation=await runMatch({home:simulationTeamA,away:simulationTeamB,seed:'test-match',durationMs:120,extraTimeMs:80,onDecision:async event=>({value:event.type==='tactic'?'balanced':'center',batterId:event.candidates?.[0]?.id})});assert.equal(simulation.finished,true);assert.ok(simulation.logs.length>=3);assert.ok(simulation.stats.home.possession+simulation.stats.away.possession===100);stats.simulationFinished=simulation.finished;
const competitiveHome={team:simulationTeamA,coach:'Scaloni',captainId:simulationTeamA[0].id,strategy:'attack'},competitiveAway={team:simulationTeamB,coach:'Felipão',captainId:simulationTeamB[0].id,strategy:'balanced'},odds=winProbabilities(competitiveHome,competitiveAway);assert.ok(chemistry(simulationTeamA)>=0&&chemistry(simulationTeamA)<=100);assert.ok(legendaryCount(simulationTeamA)>=0);assert.equal(odds.home+odds.away,100);stats.competitiveOdds=odds;
const difficultyAverages={};for(const level of ['easy','medium','hard','legendary']){const teams=Array.from({length:40},()=>autoDraftByDifficulty('4-3-3',level)),cards=teams.flat();difficultyAverages[level]=cards.reduce((sum,card)=>sum+card.overall,0)/cards.length}assert.ok(difficultyAverages.easy<difficultyAverages.medium&&difficultyAverages.medium<difficultyAverages.hard&&difficultyAverages.hard<difficultyAverages.legendary);stats.difficultyAverages=difficultyAverages;
console.log(JSON.stringify(stats,null,2));
