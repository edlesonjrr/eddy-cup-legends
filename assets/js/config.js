export const MAX_REROLLS = 3;
export const CARD_STAGGER_MS = 230;
export const DRAW_TICK_MS = 125;
export const DRAW_COUNTRY_TICKS = 9;
export const DRAW_YEAR_TICKS = 8;
export const DRAW_SETTLE_MS = 450;
export const DRAFT_TIMER_MS = 120000;
export const POSITION_LABELS = {GK:'Goleiro',RB:'Lateral-direito',LB:'Lateral-esquerdo',CB:'Zagueiro',CDM:'Volante',CM:'Meio-campista',CAM:'Meia-atacante',RM:'Meia-direita',LM:'Meia-esquerda',RW:'Ponta-direita',LW:'Ponta-esquerda',CF:'Segundo atacante',ST:'Centroavante'};
export const FORMATIONS = {'4-3-3':['GK','RB','CB','CB','LB','CM','CM','CAM','LW','ST','RW'],'4-4-2':['GK','RB','CB','CB','LB','LM','CM','CM','RM','ST','ST'],'3-5-2':['GK','CB','CB','CB','LM','CM','CAM','CM','RM','ST','ST']};
export const FORMATION_COORDS = {
  '4-3-3':[[50,89],[84,72],[63,75],[37,75],[16,72],[30,52],[70,52],[50,40],[18,20],[50,14],[82,20]],
  '4-4-2':[[50,89],[84,73],[63,76],[37,76],[16,73],[18,49],[40,53],[60,53],[82,49],[38,19],[62,19]],
  '3-5-2':[[50,89],[72,73],[50,77],[28,73],[15,48],[37,54],[50,40],[63,54],[85,48],[38,18],[62,18]]
};
export const RARITIES = {common:{label:'Comum',min:50,max:79},rare:{label:'Raro',min:80,max:89},epic:{label:'Épico',min:90,max:97},legendary:{label:'Lendário',min:98,max:105}};
export const RARITY_MODELS = [{weight:55,slots:['common','common','rare','epic']},{weight:25,slots:['common','rare','rare','epic']},{weight:15,slots:['common','rare','epic','legendary']},{weight:5,slots:['rare','epic','epic','legendary']}];
export const POSITION_COMPATIBILITY = {GK:['GK'],CB:['CB'],RB:['RB','RWB'],LB:['LB','LWB'],CM:['CM','CAM','CDM'],CAM:['CAM','CM','CF'],CDM:['CDM','CM'],RM:['RM','RW'],LM:['LM','LW'],RW:['RW','RM'],LW:['LW','LM'],ST:['ST','CF'],CF:['CF','ST','CAM']};
export const MAX_DRAW_ATTEMPTS = 40;
export const RECENT_OFFER_ROUNDS = 3;
export const positionLabel = code => POSITION_LABELS[code] || code;
export const rarityOf = overall => overall >= 98 ? 'legendary' : overall >= 90 ? 'epic' : overall >= 80 ? 'rare' : 'common';
