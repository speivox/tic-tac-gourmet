# Tic Tac Gourmet — landing page

Landing page estática. O `index.html` é **gerado**: não edite ele diretamente.

## Como funciona

Os partials ficam em `src/` e são concatenados na ordem definida em `build.py`.

```bash
python3 build.py        # gera index.html a partir de src/
```

Para ver no navegador, abra o `index.html` ou suba um servidor local:

```bash
python3 -m http.server 8000
```

## Estrutura

```
src/            partials na ordem da página (head → footer)
style.css       folha única, tokens em :root
script.js       WhatsApp, menu mobile, filtro do cardápio, FAQ
assets/img      logos e fotos
assets/video    vídeo de apresentação
docs/           briefing consolidado do cliente
```

## Convenções

- `.tbc` — trecho de texto a confirmar com o cliente (fica sublinhado pontilhado).
- `.tbc-block` — bloco inteiro a confirmar.
- `.ph` com `data-ph="..."` — espaço reservado para foto que ainda não recebemos.

Antes de publicar, varra o `index.html` por `tbc` e `ph` para não deixar nada pendente.

## Pendências

Ver `docs/briefing.md`. A principal é que ainda não recebemos nenhuma foto.

## Publicação

```bash
python3 build.py      # sempre antes de publicar
npx vercel            # URL de preview, para revisão interna
npx vercel --prod     # produção
```

**`.vercelignore` é obrigatório e não pode ser removido.** Sem ele o Vercel sobe a pasta
inteira, e `outros/` (planilha de preços com margem), `feedbacks-clientes/` (57 prints com
nome completo de clientes, telefone do plantão e códigos de cupom) e `logos/` ficariam
acessíveis por URL direta no domínio publicado.

`vercel.json` está com `X-Robots-Tag: noindex, nofollow` e o `head.html` tem a meta `robots`
de desenvolvimento. Mantenha os dois enquanto for link de revisão. **Remover os dois ao
publicar no domínio do cliente** (www.tictaceventos.com.br).
