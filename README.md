# Eddy Cup Legends

Um game de draft inspirado na história das Copas do Mundo, desenvolvido com HTML, CSS e JavaScript. Monte uma seleção histórica, combine química, capitão, treinador e lendas, e acompanhe a partida em uma simulação interativa.

## Destaques

- 1.247 versões de jogadores reais de 38 seleções.
- Modos Solo, Multiplayer Local e Online por código de sala.
- Dificuldades Fácil, Médio, Difícil e Lendário.
- Formações 4-3-3, 4-4-2 e 3-5-2 com posicionamento próprio no campo.
- Draft com raridades, posições bloqueadas, rerolls e proteção para completar as 11 vagas.
- Química de equipe, capitão, bônus por lendas e influência histórica dos treinadores.
- Pré-jogo com escalações, chance de vitória e formações independentes.
- Simulação de 90 segundos com campo animado, logs, eventos, lesões e decisões rápidas.
- Prorrogação e disputa de pênaltis interativa.
- Pesquisa de jogadores por nome, seleção e edição da Copa.
- Interface responsiva para desktop e dispositivos móveis.

## Tecnologias

- HTML5
- CSS3
- JavaScript ES Modules
- Vite
- Cloudflare D1/Worker para as salas online na configuração original

## Executar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal.

## Build de produção

```bash
npm run build
```

Os arquivos finais serão gerados na pasta `dist`.

## Testes

```bash
npm test
```

A suíte valida 5.000 rodadas de draft, distribuição de raridades, compatibilidade de posições, proteção contra duplicações, formações, duração da partida e equilíbrio das dificuldades.

## Observação sobre o modo Online

As salas online utilizam persistência D1/Worker na configuração original do projeto. Em outra plataforma de hospedagem, essa camada precisa ser adaptada ou conectada a um serviço de banco compatível.

## Autor

Criado por Eddy.
