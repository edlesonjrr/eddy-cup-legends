export const MAX_REROLLS = 3;
export const CARD_STAGGER_MS = 170;
export const POSITION_LABELS = {GK:'Goleiro',RB:'Lateral-direito',LB:'Lateral-esquerdo',CB:'Zagueiro',CDM:'Volante',CM:'Meio-campista',CAM:'Meia-atacante',RM:'Meia-direita',LM:'Meia-esquerda',RW:'Ponta-direita',LW:'Ponta-esquerda',CF:'Segundo atacante',ST:'Centroavante'};
export const FORMATIONS = {'4-3-3':['GK','RB','CB','CB','LB','CM','CM','CAM','LW','ST','RW'],'4-4-2':['GK','RB','CB','CB','LB','LM','CM','CM','RM','ST','ST'],'3-5-2':['GK','CB','CB','CB','LM','CM','CAM','CM','RM','ST','ST']};
export const COORDS = [[50,88],[82,70],[62,73],[38,73],[18,70],[33,49],[67,49],[50,38],[18,20],[50,14],[82,20]];
export const RARITIES = {common:{label:'Comum',min:50,max:79},rare:{label:'Raro',min:80,max:89},epic:{label:'Épico',min:90,max:97},legendary:{label:'Lendário',min:98,max:105}};
export const RARITY_MODELS = [{weight:55,slots:['common','common','rare','epic']},{weight:25,slots:['common','rare','rare','epic']},{weight:15,slots:['common','rare','epic','legendary']},{weight:5,slots:['rare','epic','epic','legendary']}];
export const positionLabel = code => POSITION_LABELS[code] || code;
export const rarityOf = overall => overall >= 98 ? 'legendary' : overall >= 90 ? 'epic' : overall >= 80 ? 'rare' : 'common';
