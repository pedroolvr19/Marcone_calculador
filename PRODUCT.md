# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pacientes do nutricionista Marcone Ramos (CRN 51047) que já têm um plano alimentar prescrito por ele. Usam a ferramenta no dia a dia, tipicamente no celular, quando querem ou precisam trocar um alimento do plano por outro equivalente (falta em casa, mercado, restaurante, variar o cardápio). O trabalho deles: "tenho X g de um alimento no plano; quanto de outro alimento do mesmo grupo posso comer no lugar?".

Não é uma ferramenta de captação de público nem de uso clínico do próprio nutricionista.

## Product Purpose

Calculadora/tabela de substituição de alimentos por equivalência calórica, dentro de um mesmo grupo (Frutas, Gordura vegetal, Carboidratos, Proteína, Laticínios). O paciente escolhe o grupo, o alimento do seu plano e a quantidade em gramas; a lista mostra quantos gramas de cada outro alimento do grupo equivalem em calorias. Sucesso = o paciente consegue fazer a troca sozinho, rápido e com confiança, sem sair do plano e sem precisar mandar mensagem ao nutricionista para cada dúvida.

## Positioning

Ferramenta própria do consultório do Marcone, alimentada pela tabela de alimentos que ele mantém, e não uma base nutricional genérica: os grupos, alimentos (inclusive marcas específicas de iogurte) e o aviso de uso refletem a prática dele.

## Operating Context

- Uso no celular, em contextos reais de rotina alimentar; contato direto com o nutricionista via WhatsApp (botão principal) e Instagram.
- Os dados vivem numa Planilha Google: aba `Alimentos` (Grupo | Alimento | kcal por 100 g) e aba `Config` (nome, subtítulo, whatsapp, instagram, logoUrl, aviso). O nutricionista edita a planilha; a ferramenta reflete.
- Deploy: `index.html` hospedado como site estático (GitHub Pages/Vercel/Netlify) lendo a planilha via Web App do Apps Script (`Code.gs`, `?format=json`) passado como `?api=`. Os dados embutidos em `index.html` são fallback.

## Capabilities and Constraints

- Página única, HTML/CSS/JS puro, sem build; idioma pt-BR.
- Cálculo: gramas equivalentes = (kcal_ref × qtd / 100) / kcal_alvo × 100. Equivalência é só calórica (não por macronutriente).
- Ajustes rápidos de quantidade (−10/+10, 30/50/100 g), busca com normalização de acentos, tocar numa linha torna aquele alimento a referência.
- Conteúdo (nome, contatos, aviso, alimentos) é configurável pela planilha; a interface precisa tolerar nomes longos, grupos vazios, falta de logo e contatos ausentes.
- Em aberto: não há logo real (usa iniciais); não foi confirmado que os valores de kcal foram revisados pelo nutricionista.

## Brand Commitments

- Nome: "Marcone Ramos Nutri"; subtítulo "Nutricionista · CRN 51047".
- Existe um site/identidade oficial do Marcone que esta ferramenta deve seguir. A URL ainda não foi registrada aqui; o CSS atual declara usar a paleta desse site.
- Voz: português direto, acolhedor e prático ("Trocar 100 g de…", "Pode trocar por").
- O slogan "Nutrição para a vida real" aparece num comentário de código, mas não foi confirmado como oficial.

## Evidence on Hand

- Tabela de alimentos com kcal por 100 g em `index.html` e `Code.gs` (mesmos dados).
- Não há logo/foto, depoimentos, nem dados clínicos. Não inventar credenciais, resultados ou depoimentos.

## Product Principles

1. O plano do nutricionista manda: a ferramenta ajuda a seguir o plano, nunca sugere sair dele; o aviso de aproximação fica sempre visível.
2. Resposta em um toque: escolher alimento e quantidade deve mostrar as equivalências imediatamente, legíveis no celular com uma mão.
3. A planilha é a fonte da verdade: nada que o nutricionista precise mudar deve exigir editar código.
4. Contato humano a um toque: o WhatsApp do nutricionista é o caminho para dúvidas que a tabela não resolve.

## Accessibility & Inclusion

Nenhum requisito específico estabelecido além do básico web (pacientes de idades variadas, uso móvel). Manter alvos de toque generosos, contraste legível e rótulos acessíveis já presentes.
