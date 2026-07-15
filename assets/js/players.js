const squads = [
 ['Brasil',1970,[['Félix','GK',84],['Carlos Alberto','RB',100],['Brito','CB',78],['Everaldo','LB',76],['Clodoaldo','CM',89],['Gérson','CAM',96],['Jairzinho','RW',100],['Pelé','ST',105],['Tostão','CF',95],['Rivelino','LW',96],['Piazza','CB',82]]],
 ['Argentina',1986,[['Nery Pumpido','GK',84],['Cuciuffo','RB',76],['José Brown','CB',85],['Olarticoechea','LB',82],['Batista','CDM',79],['Burruchaga','CM',91],['Maradona','CAM',104],['Valdano','ST',93],['Claudio Borghi','CF',78],['Giusti','RM',80],['Ruggeri','CB',90]]],
 ['Alemanha',1990,[['Bodo Illgner','GK',87],['Thomas Berthold','RB',82],['Kohler','CB',92],['Brehme','LB',96],['Buchwald','CB',86],['Hässler','RM',84],['Matthäus','CM',101],['Littbarski','LM',90],['Völler','ST',94],['Klinsmann','ST',95],['Reuter','CM',78]]],
 ['Brasil',1994,[['Taffarel','GK',91],['Jorginho','RB',89],['Aldair','CB',92],['Branco','LB',87],['Márcio Santos','CB',85],['Dunga','CDM',91],['Mazinho','CM',84],['Zinho','LM',82],['Bebeto','CF',94],['Romário','ST',101],['Viola','ST',75]]],
 ['França',1998,[['Barthez','GK',91],['Thuram','RB',96],['Desailly','CB',95],['Blanc','CB',92],['Lizarazu','LB',90],['Deschamps','CDM',89],['Petit','CM',90],['Zidane','CAM',103],['Djorkaeff','CF',90],['Henry','ST',88],['Dugarry','ST',78]]],
 ['Brasil',2002,[['Marcos','GK',92],['Cafu','RB',101],['Lúcio','CB',94],['Edmílson','CB',89],['Roberto Carlos','LB',101],['Gilberto Silva','CDM',88],['Kléberson','CM',82],['Ronaldinho','CAM',102],['Rivaldo','LW',99],['Ronaldo','ST',104],['Denílson','RW',86]]],
 ['Itália',2006,[['Buffon','GK',98],['Zambrotta','RB',94],['Cannavaro','CB',99],['Materazzi','CB',91],['Grosso','LB',90],['Gattuso','CDM',88],['Pirlo','CM',97],['Camoranesi','RM',85],['Totti','CAM',96],['Del Piero','CF',94],['Toni','ST',92]]],
 ['Espanha',2010,[['Casillas','GK',97],['Sergio Ramos','RB',98],['Piqué','CB',94],['Puyol','CB',97],['Capdevila','LB',84],['Busquets','CDM',92],['Xavi','CM',100],['Iniesta','CAM',101],['Pedro','RW',86],['David Villa','ST',97],['Mata','LW',82]]],
 ['Alemanha',2014,[['Neuer','GK',98],['Lahm','RB',98],['Hummels','CB',94],['Boateng','CB',91],['Höwedes','LB',85],['Khedira','CDM',89],['Kroos','CM',96],['Özil','CAM',94],['Schürrle','LW',86],['Thomas Müller','RW',96],['Klose','ST',98]]],
 ['Argentina',2022,[['Emiliano Martínez','GK',92],['Molina','RB',86],['Otamendi','CB',91],['Romero','CB',90],['Tagliafico','LB',84],['De Paul','CM',90],['Enzo Fernández','CM',91],['Mac Allister','CAM',89],['Di María','RW',96],['Messi','CF',104],['Julián Álvarez','ST',93]]],
 ['França',2018,[['Lloris','GK',92],['Pavard','RB',86],['Varane','CB',94],['Umtiti','CB',90],['Hernández','LB',87],['Kanté','CDM',96],['Pogba','CM',94],['Griezmann','CAM',97],['Mbappé','RW',98],['Giroud','ST',89],['Dembélé','LW',82]]]
];
const extras = [
 ['Robert Pirès','França',1998,'LM',91],['Ángel Di María','Argentina',2022,'LM',96],['Pavel Nedvěd','Tchéquia',2006,'LM',95],['Ryan Giggs','País de Gales',1998,'LM',94],
 ['David Beckham','Inglaterra',2002,'RM',96],['Luís Figo','Portugal',2006,'RM',99],['Thomas Müller','Alemanha',2014,'RM',96],['Pierre Littbarski','Alemanha',1990,'RM',90]
].map(([name,country,year,position,overall])=>({name,country,year,position,overall}));
const depth = [
 ['Brasil',1970,[['Ado','GK',72],['Marco Antônio','LB',74],['Joel Camargo','CB',76],['Edu','LW',81],['Roberto Miranda','ST',82]]],
 ['Argentina',1986,[['Luis Islas','GK',73],['Oscar Garré','LB',77],['Julio Olarticoechea','LM',78],['Ricardo Bochini','CAM',85],['Pedro Pasculli','ST',83]]],
 ['Alemanha',1990,[['Andreas Köpke','GK',76],['Stefan Reuter','RB',79],['Hans Pflügler','LB',75],['Uwe Bein','CAM',85],['Karl-Heinz Riedle','ST',87]]],
 ['Brasil',1994,[['Zetti','GK',76],['Cafu','RB',84],['Ronaldão','CB',74],['Raí','CAM',87],['Müller','ST',85]]],
 ['França',1998,[['Lama','GK',78],['Leboeuf','CB',84],['Karembeu','RM',81],['Guivarc’h','ST',76],['Trezeguet','ST',86]]],
 ['Brasil',2002,[['Dida','GK',82],['Belletti','RB',77],['Anderson Polga','CB',76],['Juninho Paulista','CAM',84],['Luizão','ST',79]]],
 ['Itália',2006,[['Peruzzi','GK',81],['Barzagli','CB',84],['De Rossi','CM',87],['Iaquinta','RW',78],['Inzaghi','ST',86]]],
 ['Espanha',2010,[['Reina','GK',82],['Arbeloa','RB',78],['Albiol','CB',79],['Javi Martínez','CDM',83],['Llorente','ST',85]]],
 ['Alemanha',2014,[['Weidenfeller','GK',80],['Durm','LB',74],['Mertesacker','CB',86],['Draxler','LM',84],['Podolski','ST',87]]],
 ['Argentina',2022,[['Armani','GK',78],['Foyth','RB',79],['Pezzella','CB',84],['Paredes','CDM',86],['Lautaro Martínez','ST',88]]],
 ['França',2018,[['Mandanda','GK',82],['Sidibé','RB',78],['Rami','CB',76],['Tolisso','CM',84],['Thauvin','RW',81],['Nabil Fekir','CF',87]]]
].flatMap(([country,year,list])=>list.map(([name,position,overall])=>({name,country,year,position,overall})));
const countryCode = {'Brasil':'bra','Argentina':'arg','Alemanha':'ger','França':'fra','Itália':'ita','Espanha':'esp','Tchéquia':'cze','País de Gales':'wal','Inglaterra':'eng','Portugal':'por'};
const slug = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const rawPlayers=[...squads.flatMap(([country,year,list])=>list.map(([name,position,overall])=>({name,country,year,position,overall}))),...extras,...depth];
const baseIds=rawPlayers.map(player=>`${countryCode[player.country]||slug(player.country).slice(0,3)}-${player.year}-${slug(player.name)}`);
export const PLAYERS = rawPlayers.map((player,index)=>({id:baseIds.filter(id=>id===baseIds[index]).length>1?`${baseIds[index]}-${player.position.toLowerCase()}`:baseIds[index],...player}));
export const TOURNAMENTS = squads.map(([country,year])=>({country,year}));
