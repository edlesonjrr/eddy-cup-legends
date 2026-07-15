import { rarityOf } from './config.js';

export const COACHES=[
  {name:'Zagallo',rate:67,note:'campeão mundial em 1970'},
  {name:'Felipão',rate:55,note:'campeão mundial em 2002'},
  {name:'Lippi',rate:57,note:'campeão mundial em 2006'},
  {name:'Scaloni',rate:72,note:'campeão mundial em 2022'},
  {name:'Deschamps',rate:65,note:'campeão mundial em 2018'},
  {name:'Beckenbauer',rate:61,note:'campeão mundial em 1990'},
  {name:'Parreira',rate:58,note:'campeão mundial em 1994'},
  {name:'Vicente del Bosque',rate:70,note:'campeão mundial em 2010'}
];
export const coachData=name=>COACHES.find(coach=>coach.name===name)||{name:name||'Técnico automático',rate:55,note:'experiência internacional'};
export const legendaryCount=team=>team.filter(player=>rarityOf(player.overall)==='legendary').length;
export function chemistry(team=[]){
  if(!team.length)return 0;
  let links=0;
  for(let i=0;i<team.length;i++)for(let j=i+1;j<team.length;j++){
    if(team[i].country===team[j].country)links+=2.4;
    if(Math.abs(team[i].year-team[j].year)<=4)links+=.55;
  }
  const sectors={def:0,mid:0,att:0};
  team.forEach(player=>{if(['GK','RB','LB','CB'].includes(player.position))sectors.def++;else if(['CDM','CM','CAM','RM','LM'].includes(player.position))sectors.mid++;else sectors.att++});
  const balance=sectors.def>=4&&sectors.mid>=3&&sectors.att>=2?12:7;
  return Math.round(Math.min(100,42+links+balance));
}
export function teamPower(entry){
  const team=entry.team||entry.lineup||[],average=team.length?team.reduce((sum,player)=>sum+player.overall,0)/team.length:70;
  const chem=chemistry(team),legends=legendaryCount(team),coach=coachData(entry.coach);
  const captain=team.find(player=>player.id===entry.captainId)?.overall||average;
  const strategyBonus={attack:.6,balanced:0,defend:.35,counter:.5}[entry.strategy]||0;
  return{average,chem,legends,coach,captain,power:average+chem*.065+legends*2+(coach.rate-50)*.12+(captain-average)*.05+strategyBonus};
}
export function winProbabilities(home,away){
  const a=teamPower(home),b=teamPower(away),homeEdge=1.2,difference=a.power+homeEdge-b.power;
  const homeChance=Math.round(Math.max(15,Math.min(85,50+difference*2.15)));
  return{home:homeChance,away:100-homeChance,homeDetails:a,awayDetails:b};
}
