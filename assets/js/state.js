import { MAX_REROLLS } from './config.js';
export const makePlayer = id => {
  const player={id,formation:null,lineup:Array(11).fill(null),rerolls:MAX_REROLLS,currentRound:0,currentOptions:null,selectedPlayerIds:new Set(),offeredPlayerIds:new Set(),recentlyOfferedPlayerIds:[],recentCountries:[],recentTournamentKeys:[],lastOfferRound:-1,draftDeadline:0,coach:'',finishedDraft:false};
  Object.defineProperties(player,{team:{get:()=>player.lineup},round:{get:()=>player.currentRound,set:v=>player.currentRound=v},current:{get:()=>player.currentOptions,set:v=>player.currentOptions=v}});
  return player;
};
export const game = {mode:'solo',active:'player1',locked:false,sound:true,players:{player1:makePlayer('player1'),player2:makePlayer('player2')},opponent:null};
export const activePlayer = () => game.players[game.active];
export function resetGame(mode='solo'){game.mode=mode;game.active='player1';game.locked=false;game.opponent=null;game.players.player1=makePlayer('player1');game.players.player2=makePlayer('player2')}
