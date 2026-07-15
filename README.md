# Eddy Cup Legends

[![Production Pipeline](https://github.com/edlesonjrr/eddy-cup-legends/actions/workflows/production.yml/badge.svg)](https://github.com/edlesonjrr/eddy-cup-legends/actions/workflows/production.yml)

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
- Supabase gratuito para salas, sincronização e partidas Online

## Pipeline de produção

Cada envio para a branch `main` passa automaticamente por seis etapas: instalação das dependências, testes, build, auditoria de segurança, publicação na Vercel e verificação do site em produção.

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

## Configurar o modo Online

Copie `.env.example` para `.env.local` e informe a URL e a chave publicável do seu projeto Supabase. A chave publicável pode ficar no frontend; nenhuma chave administrativa é incluída no site.

O backend das salas está em `supabase/functions/online-rooms` e o esquema versionado em `supabase/migrations`. As salas usam códigos temporários, aceitam exatamente dois jogadores e expiram após quatro horas.

## Testes

```bash
npm test
```

A suíte valida 5.000 rodadas de draft, distribuição de raridades, compatibilidade de posições, proteção contra duplicações, formações, duração da partida e equilíbrio das dificuldades.

## Autor

Criado por Eddy.
