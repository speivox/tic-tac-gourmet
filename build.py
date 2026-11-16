#!/usr/bin/env python3
"""Monta index.html a partir dos partials em src/."""

import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, 'src')
OUT = os.path.join(BASE, 'index.html')

PARTS = [
    'head.html',
    'header.html',
    's-hero.html',
    's-cardapio.html',
    's-carrinhos.html',
    's-como-funciona.html',
    's-clientes.html',
    's-sobre.html',
    's-galeria.html',
    's-depoimentos.html',
    's-faq.html',
    's-cta-final.html',
    'footer.html',
]

missing = [p for p in PARTS if not os.path.exists(os.path.join(SRC, p))]
if missing:
    print(f'Erro: partials não encontrados: {missing}', file=sys.stderr)
    sys.exit(1)

with open(OUT, 'w', encoding='utf-8') as out:
    for part in PARTS:
        with open(os.path.join(SRC, part), encoding='utf-8') as f:
            out.write(f.read())

print(f'index.html gerado a partir de {len(PARTS)} partials.')
