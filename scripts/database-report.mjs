import { PLAYERS, TOURNAMENTS } from '../assets/js/players.js';
import { rarityOf } from '../assets/js/config.js';
const countBy=fn=>PLAYERS.reduce((acc,p)=>{const key=fn(p);acc[key]=(acc[key]||0)+1;return acc},{});
const ids=new Set(PLAYERS.map(p=>p.id));
const combinations=[...new Map(PLAYERS.map(p=>[`${p.country}|${p.year}`,{country:p.country,year:p.year}])).values()];
const report={total:PLAYERS.length,uniqueIds:ids.size,byTournament:countBy(p=>`${p.country} ${p.year}`),byPosition:countBy(p=>p.position),byRarity:countBy(p=>rarityOf(p.overall)),tournamentsWithFewerThanFour:combinations.filter(t=>PLAYERS.filter(p=>p.country===t.country&&p.year===t.year).length<4)};
console.log(JSON.stringify(report,null,2));
