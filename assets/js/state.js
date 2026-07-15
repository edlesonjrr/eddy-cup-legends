import { MAX_REROLLS } from './config.js';
export const makePlayer = id => {
  const player={id,side:'home',formation:null,lineup:Array(11).fill(null),rerolls:MAX_REROLLS,currentRound:0,currentOptions:null,selectedPlayerIds:new Set(),offeredPlayerIds:new Set(),recentlyOfferedPlayerIds:[],recentCountries:[],recentTournamentKeys:[],lastOfferRound:-1,draftDeadline:0,coach:'',captainId:'',strategy:'balanced',finishedDraft:false};
  Object.defineProperties(player,{team:{get:()=>player.lineup},round:{get:()=>player.currentRound,set:v=>player.currentRound=v},current:{get:()=>player.currentOptions,set:v=>player.currentOptions=v}});
  return player;
};
export const game = {mode:'solo',difficulty:'medium',active:'player1',locked:false,sound:true,matchFormat:'single',series:{home:0,away:0,game:1},players:{player1:makePlayer('player1'),player2:makePlayer('player2')},opponent:null};
export const activePlayer = () => game.players[game.active];
export function resetGame(mode='solo'){game.mode=mode;game.difficulty='medium';game.active='player1';game.locked=false;game.matchFormat='single';game.series={home:0,away:0,game:1};game.opponent=null;game.players.player1=makePlayer('player1');game.players.player2=makePlayer('player2')}
