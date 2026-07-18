const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export const MATCH_DURATION_MS=90000;
export const EXTRA_TIME_MS=10000;
const hash=value=>[...value].reduce((acc,char)=>(acc*31+char.charCodeAt(0))>>>0,2166136261);
const rngFrom=seed=>{let state=hash(seed);return()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296}};
const groups={defense:new Set(['GK','RB','LB','CB']),midfield:new Set(['CDM','CM','CAM','RM','LM']),attack:new Set(['RW','LW','CF','ST'])};
const average=list=>list.length?list.reduce((sum,item)=>sum+item.overall,0)/list.length:70;
export function teamProfile(team){const by=group=>team.filter(player=>groups[group].has(player.position));return{overall:average(team),goalkeeper:average(by('defense').filter(player=>player.position==='GK')),defense:average(by('defense')),midfield:average(by('midfield')),attack:average(by('attack'))}}
const attackers=team=>[...team].filter(player=>groups.attack.has(player.position)||player.position==='CAM').sort((a,b)=>b.overall-a.overall);
const eventText=(minute,text)=>`${minute}' — ${text}`;
const directions=['left','center','right'];
const directionName=value=>value==='left'?'esquerda':value==='right'?'direita':'centro';

export async function runMatch({home,away,seed='legends',onUpdate,onDecision,durationMs=MATCH_DURATION_MS,extraTimeMs=EXTRA_TIME_MS}){
  const dramaFlightMs=durationMs<5000?5:1700,dramaResultMs=durationMs<5000?5:1150;
  const random=rngFrom(seed),profile={home:teamProfile(home),away:teamProfile(away)},competitiveMatch=Math.abs(profile.home.overall-profile.away.overall)<3;
  const playerStats={home:home.map(player=>({id:player.id,name:player.name,position:player.position,overall:player.overall,goals:0,shots:0,saves:0,injured:false,rating:6})),away:away.map(player=>({id:player.id,name:player.name,position:player.position,overall:player.overall,goals:0,shots:0,saves:0,injured:false,rating:6}))};
  const state={phase:'first-half',minute:0,score:{home:0,away:0},stats:{home:{shots:0,saves:0,cards:0,possession:50},away:{shots:0,saves:0,cards:0,possession:50}},playerStats,logs:[],momentum:{home:0,away:0},tactics:{home:'balanced',away:'balanced'},penaltyShots:{home:[],away:[]},waitingFor:null,visualEvent:null,finished:false};
  let decisionSequence=0;
  const individual=(side,player)=>state.playerStats[side].find(item=>item.id===player?.id)||state.playerStats[side][0];
  const emit=async()=>onUpdate?.(structuredClone(state));
  const log=async text=>{state.logs.push(text);if(state.logs.length>40)state.logs.shift();await emit()};
  const visual=async(type,side,extra={})=>{state.visualEvent={id:`${type}-${state.minute}-${decisionSequence++}`,type,side,...extra};await emit()};
  const decide=async(type,side,payload={})=>{const decisionId=`${type}-${side}-${state.minute}-${decisionSequence++}`;state.waitingFor=side;await emit();return onDecision?.({type,side,decisionId,timeout:9000,state:structuredClone(state),...payload})};
  const strength=side=>{const rival=side==='home'?'away':'home',tactic=state.tactics[side],bonus=tactic==='attack'?3:tactic==='defend'?-2:0;return profile[side].attack*.38+profile[side].midfield*.32+profile[side].overall*.3-profile[rival].defense*.22+bonus+state.momentum[side]*2};
  const attackEvent=async(side,minute)=>{
    const rival=side==='home'?'away':'home',team=side==='home'?home:away,opponent=rival==='home'?home:away,fastPlayers=attackers(team).filter(player=>['RW','LW','ST'].includes(player.position)),runners=random()<.38?fastPlayers:attackers(team),player=runners[Math.floor(random()*Math.max(1,runners.length))]||team[0],keeper=opponent.find(item=>item.position==='GK')||opponent[0],speed=Math.max(70,Math.min(99,player.overall+(['RW','LW'].includes(player.position)?4:0)));
    state.stats[side].shots++;individual(side,player).shots++;const base=Math.max(.07,Math.min(.38,.14+(strength(side)-55)/180+(speed-88)*.004)),goalChance=competitiveMatch?base*.78:base;
    await visual('attack',side,{player:player.name});
    if(speed>=96&&random()<.28)await log(eventText(minute,`${player.name} dispara em velocidade pelas costas da defesa!`));
    if(random()<goalChance){state.score[side]++;individual(side,player).goals++;state.momentum[side]=0;state.momentum[rival]-=.3;await visual('goal',side,{player:player.name});await log(eventText(minute,`GOL! ${player.name} finaliza com precisão e marca!`))}
    else if(random()<.58){state.stats[rival].saves++;individual(rival,keeper).saves++;state.momentum[side]+=.22;await visual('save',side,{player:player.name});await log(eventText(minute,`${player.name} bate forte, mas ${keeper.name} faz a defesa.`))}
    else{state.momentum[side]+=.12;await visual('miss',side,{player:player.name});await log(eventText(minute,`${player.name} finaliza para fora por muito pouco.`))}
  };
  const penaltyDuel=async(attacking,defending,batter,keeper,label)=>{
    await visual('penalty',attacking,{player:batter.name});
    await log(eventText(state.minute,`${label} ${batter.name} contra ${keeper.name}.`));
    const kick=await decide('penalty-kick',attacking,{candidates:[batter],options:directions});
    const accuracy=await decide('penalty-accuracy',attacking,{candidates:[batter],greenWidth:Math.max(24,Math.min(48,28+(batter.overall-80)*.7))});
    const save=await decide('penalty-save',defending,{candidates:[keeper],options:directions});
    const shotDirection=kick?.value||directions[Math.floor(random()*3)],keeperDirection=save?.value||directions[Math.floor(random()*3)],precision=Number(accuracy?.accuracy)||0;
    const onTarget=precision>=.48,stopped=shotDirection===keeperDirection;
    state.waitingFor=null;await visual('penalty-flight',attacking,{player:batter.name,keeper:keeper.name,shotDirection,keeperDirection});await wait(dramaFlightMs);
    individual(attacking,batter).shots++;
    if(!onTarget){await visual('penalty-result',attacking,{player:batter.name,keeper:keeper.name,shotDirection,keeperDirection,outcome:'miss'});await wait(dramaResultMs);await log(eventText(state.minute,`PARA FORA! ${batter.name} erra o tempo da finalização.`));return false}
    if(stopped){state.stats[defending].saves++;individual(defending,keeper).saves++;await visual('penalty-result',attacking,{player:batter.name,keeper:keeper.name,shotDirection,keeperDirection,outcome:'save'});await wait(dramaResultMs);await log(eventText(state.minute,`DEFENDEU! ${keeper.name} pula para ${directionName(keeperDirection)} e acerta o canto.`));return false}
    state.score[attacking]++;individual(attacking,batter).goals++;await visual('penalty-result',attacking,{player:batter.name,keeper:keeper.name,shotDirection,keeperDirection,outcome:'goal'});await wait(dramaResultMs);await log(eventText(state.minute,`GOL DE PÊNALTI! ${batter.name} bate em ${directionName(shotDirection)} e desloca o goleiro.`));return true
  };
  const freeKickEvent=async(attacking,defending)=>{
    const team=attacking==='home'?home:away,opponent=defending==='home'?home:away,kicker=attackers(team)[0]||team[0],keeper=opponent.find(item=>item.position==='GK')||opponent[0];
    await visual('free-kick',attacking,{player:kicker.name});await log(eventText(state.minute,`Falta perigosa! ${kicker.name} prepara a cobrança.`));
    const kick=await decide('free-kick',attacking,{candidates:[kicker],options:['curve','power','under']});
    const wall=await decide('free-kick-wall',defending,{candidates:[keeper],options:['jump','hold','rush']});
    const beats={curve:'jump',power:'rush',under:'hold'},success=beats[kick?.value||'curve']!==(wall?.value||'jump')&&random()<Math.max(.28,Math.min(.62,.38+(kicker.overall-keeper.overall)*.012));
    state.stats[attacking].shots++;individual(attacking,kicker).shots++;
    if(success){state.score[attacking]++;individual(attacking,kicker).goals++;await visual('goal',attacking,{player:kicker.name});await log(eventText(state.minute,`GOLAÇO DE FALTA! ${kicker.name} supera a barreira.`))}
    else{state.stats[defending].saves++;individual(defending,keeper).saves++;await visual('save',attacking,{player:keeper.name});await log(eventText(state.minute,`${keeper.name} lê a cobrança e evita o gol.`))}
  };
  const expectedTicks=Math.max(12,Math.floor(durationMs/750)),randomTick=()=>5+Math.floor(random()*Math.max(4,expectedTicks-10));
  const penaltyTick=random()<.18?randomTick():null,freeKickTick=random()<.07?randomTick():null,injuryTick=random()<.24?randomTick():null,redTick=random()<.06?randomTick():null;
  let tick=0,halftimeDone=false,penaltyDone=false,freeKickDone=false,injuryDone=false,redDone=false;
  await log(eventText(0,'A bola está rolando no Estádio das Lendas.'));const started=Date.now();
  while(Date.now()-started<durationMs){
    await wait(Math.min(750,durationMs));tick++;state.minute=Math.min(90,Math.floor((Date.now()-started)/durationMs*90));state.phase=state.minute<45?'first-half':'second-half';
    if(!halftimeDone&&state.minute>=45){halftimeDone=true;await log(eventText(45,'Intervalo. Os times voltam preparados para a etapa final.'));await log(eventText(46,'Começa o segundo tempo.'))}
    const attacking=random()<.5?'home':'away',defending=attacking==='home'?'away':'home';state.stats.home.possession=Math.max(38,Math.min(62,Math.round(50+(profile.home.midfield-profile.away.midfield)*.55+(state.momentum.home-state.momentum.away)*2)));state.stats.away.possession=100-state.stats.home.possession;
    if(!penaltyDone&&penaltyTick&&tick>=penaltyTick){penaltyDone=true;const team=attacking==='home'?home:away,opponent=defending==='home'?home:away,batter=attackers(team)[0]||team[0],keeper=opponent.find(item=>item.position==='GK')||opponent[0];await penaltyDuel(attacking,defending,batter,keeper,'Pênalti durante a partida!');continue}
    if(!freeKickDone&&freeKickTick&&tick>=freeKickTick){freeKickDone=true;await freeKickEvent(attacking,defending);continue}
    if(!injuryDone&&injuryTick&&tick>=injuryTick){injuryDone=true;const attackTeam=attacking==='home'?home:away,defenseTeam=defending==='home'?home:away,player=attackers(attackTeam)[0]||attackTeam[0],defender=defenseTeam.filter(card=>card.position==='CB').sort((a,b)=>b.overall-a.overall)[0]||defenseTeam[0],impact=Math.max(.2,Math.min(.8,.35+(defender.overall-player.overall)*.025));individual(attacking,player).injured=true;state.momentum[attacking]-=impact;await visual('injury',attacking,{player:player.name});await log(eventText(state.minute,`${defender.name} chega firme em ${player.name}. O atacante recebe atendimento e continua limitado.`));continue}
    if(!redDone&&redTick&&tick>=redTick){redDone=true;state.stats[defending].cards++;state.momentum[defending]-=.7;await visual('card',defending);await log(eventText(state.minute,'Cartão vermelho! Um jogador é expulso.'));continue}
    const roll=random();if(roll<.14)await attackEvent(attacking,state.minute);else if(roll<.20){state.stats[defending].cards++;await visual('card',defending);await log(eventText(state.minute,'Falta dura. Cartão amarelo.'))}else if(roll<.24){state.stats[attacking].shots++;state.momentum[attacking]+=.18;await visual('post',attacking);await log(eventText(state.minute,'A finalização explode na trave!'))}else if(roll<.30){await visual('pressure',attacking);await log(eventText(state.minute,`${attacking==='home'?'O time da casa':'O visitante'} aumenta a pressão.`))}state.momentum.home*=.92;state.momentum.away*=.92;await emit()
  }
  state.minute=90;await log(eventText(90,'Fim do tempo regulamentar.'));
  if(state.score.home===state.score.away)await interactiveShootout({home,away,state,random,onDecision,emit,log,extraTimeMs,competitiveMatch,decisionStart:decisionSequence,dramaFlightMs,dramaResultMs});
  for(const side of ['home','away'])for(const player of state.playerStats[side])player.rating=Math.max(5.5,Math.min(10,Math.round((6+player.goals*1.45+player.saves*.28+player.shots*.12+(player.overall-80)*.015-(player.injured?.35:0))*10)/10));state.manOfTheMatch=[...state.playerStats.home.map(player=>({...player,side:'home'})),...state.playerStats.away.map(player=>({...player,side:'away'}))].sort((a,b)=>b.rating-a.rating||b.goals-a.goals||b.overall-a.overall)[0];
  state.waitingFor=null;state.finished=true;state.phase='finished';await emit();return state
}

async function interactiveShootout({home,away,state,random,onDecision,emit,log,extraTimeMs,competitiveMatch,decisionStart,dramaFlightMs,dramaResultMs}){
  let sequence=decisionStart;const decide=async(type,side,payload={})=>{const decisionId=`${type}-${side}-shootout-${sequence++}`;state.waitingFor=side;await emit();return onDecision?.({type,side,decisionId,timeout:9000,state:structuredClone(state),...payload})};
  state.phase='extra-time';await log(competitiveMatch?'PRORROGAÇÃO — O equilíbrio aumenta a chance de pênaltis.':'PRORROGAÇÃO — Ainda está tudo igual.');await wait(extraTimeMs);state.phase='shootout';await log('PÊNALTIS — Um jogador bate; o adversário escolhe onde o goleiro pula.');
  const ordered={};
  for(const side of ['home','away']){const team=side==='home'?home:away,candidates=[...team].filter(player=>player.position!=='GK').sort((a,b)=>b.overall-a.overall).slice(0,8),decision=await decide('shootout-order',side,{candidates,timeout:15000}),ids=decision?.orderedIds||[];ordered[side]=[...ids.map(id=>candidates.find(player=>player.id===id)).filter(Boolean),...candidates.filter(player=>!ids.includes(player.id))].slice(0,5)}
  let homePens=0,awayPens=0;
  for(let shot=0;shot<5;shot++)for(const side of ['home','away']){
    const rival=side==='home'?'away':'home',batter=ordered[side][shot],opponent=rival==='home'?home:away,keeper=opponent.find(player=>player.position==='GK')||opponent[0];
    state.visualEvent={id:`shootout-${side}-${shot}`,type:'penalty',side,player:batter.name};await emit();
    const kick=await decide('shootout-kick',side,{candidates:[batter],shot:shot+1,options:directions});
    const save=await decide('shootout-save',rival,{candidates:[keeper],shot:shot+1,options:directions});
    const direction=kick?.value||directions[Math.floor(random()*3)],keeperDirection=save?.value||directions[Math.floor(random()*3)],goal=direction!==keeperDirection;state.waitingFor=null;state.visualEvent={id:`shootout-flight-${side}-${shot}`,type:'penalty-flight',side,player:batter.name,keeper:keeper.name,shotDirection:direction,keeperDirection,shot:shot+1};await emit();await wait(dramaFlightMs);state.penaltyShots[side].push(goal);
    if(goal){side==='home'?homePens++:awayPens++;state.visualEvent={id:`shootout-goal-${side}-${shot}`,type:'penalty-result',side,player:batter.name,keeper:keeper.name,shotDirection:direction,keeperDirection,outcome:'goal',shot:shot+1}}else{state.visualEvent={id:`shootout-save-${side}-${shot}`,type:'penalty-result',side,player:batter.name,keeper:keeper.name,shotDirection:direction,keeperDirection,outcome:'save',shot:shot+1}}state.shootout={home:homePens,away:awayPens};await emit();await wait(dramaResultMs);if(goal)await log(`PÊNALTI ${shot+1} — GOL! ${batter.name} bate em ${directionName(direction)} e desloca ${keeper.name}.`);else await log(`PÊNALTI ${shot+1} — DEFENDEU! ${keeper.name} escolhe ${directionName(keeperDirection)} e para ${batter.name}.`)
  }
  while(homePens===awayPens){if(random()<.72)homePens++;if(random()<.72)awayPens++}
  state.waitingFor=null;state.shootout={home:homePens,away:awayPens};await log(`PÊNALTIS — ${homePens} a ${awayPens}.`)
}
