import { MAX_REROLLS } from './config.js';
const makePlayer = id => ({id,formation:null,team:Array(11).fill(null),round:0,rerolls:MAX_REROLLS,coach:'',current:null});
export const game = {mode:'solo',active:'player1',locked:false,sound:true,players:{player1:makePlayer('player1'),player2:makePlayer('player2')},opponent:null};
export const activePlayer = () => game.players[game.active];
export function resetGame(mode='solo'){game.mode=mode;game.active='player1';game.locked=false;game.opponent=null;game.players.player1=makePlayer('player1');game.players.player2=makePlayer('player2')}
