# World Cup Legends Draft

Jogo web em HTML, CSS e JavaScript Vanilla. Abra `index.html` para jogar localmente.

## Incluído nesta versão

- Modos solo e multiplayer local
- Formações 4-3-3, 4-4-2 e 3-5-2
- Draft equilibrado de 11 rodadas com posições variadas, raridades probabilísticas e três rerolls por jogador
- Escolha de treinador, sorteio de árbitro e simulação da partida
- Interface responsiva, acessível e sem imagens reais de atletas
- Banco local com 305 versões reais de jogadores, distribuídas por 19 seleções históricas de Copa
- Proteção contra repetição consecutiva de países e duplicação da mesma pessoa em uma Copa
- Modo Online com sala de seis caracteres, dois jogadores, estado persistente e cronômetro compartilhado de 2 minutos
- Modo de conclusão que oferece somente cartas compatíveis nas duas últimas vagas
- Simulação ao vivo de 25 segundos com logs, momentum, estatísticas, pênaltis interativos e decisão tática no intervalo
- Prorrogação e disputa de pênaltis em empates, com estado compartilhado no modo Online

## Executar localmente

1. Instale o Node.js 20 ou superior.
2. Execute `npm install`.
3. Execute `npm run dev`.
4. Abra o endereço exibido no terminal.

## Testes

Execute `npm test` para validar 5.000 sorteios estatísticos, equilíbrio de raridades, país/ano, compatibilidade e drafts completos nas três formações.
