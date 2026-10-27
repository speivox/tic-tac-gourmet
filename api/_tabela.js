// GERADO POR tools/extrair_precos.py — NÃO EDITE À MÃO.
// Fonte: outros/ORÇAMENTO TIC TAC.xlsx
//
// Fica em api/ de propósito: esta tabela não pode ser servida
// publicamente. Só a serverless function a lê.

'use strict';

module.exports = {
  "fonte": "ORÇAMENTO TIC TAC.xlsx",
  "fonteSha256": "6186f6c5594b81a8888828d1dc55a73c0d52898be3c81d21aeb67fab0030875f",
  "constantes": {
    "cacheMonitor": 180.0,
    "taxaCarrinho": 220.0,
    "horaExtra": 300.0,
    "horasBase": 4,
    "descontoVista": 0.05,
    "fatorAjuste": {
      "ate4Carrinhos": 0.73,
      "acima4Carrinhos": 0.53
    },
    "maxUnidadesPorPessoa": 14
  },
  "itens": [
    {
      "cod": "MH",
      "nome": "MINI HAMBÚRGUER ARTESANAL",
      "linhaOrcamento": 8,
      "linhaPrecos": 6,
      "qtdAdulto": 3.0,
      "qtdCrianca": 2.0,
      "monitores": 2,
      "pesoCarrinho": 1.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 13.0
        },
        {
          "ateUnidades": 400,
          "preco": 13.0
        },
        {
          "ateUnidades": null,
          "preco": 13.0
        }
      ]
    },
    {
      "cod": "FF",
      "nome": "FAST FOOD (MINI HAMBÚRGUER ARTESANAL  + FRITAS)",
      "linhaOrcamento": 9,
      "linhaPrecos": 7,
      "qtdAdulto": 3.0,
      "qtdCrianca": 2.0,
      "monitores": 2,
      "pesoCarrinho": 1.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 17.0
        },
        {
          "ateUnidades": 400,
          "preco": 17.0
        },
        {
          "ateUnidades": null,
          "preco": 17.0
        }
      ]
    },
    {
      "cod": "TR",
      "nome": "TROPEIRO",
      "linhaOrcamento": 10,
      "linhaPrecos": 41,
      "qtdAdulto": 2.0,
      "qtdCrianca": 1.0,
      "monitores": 2,
      "pesoCarrinho": 1.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 20.0
        },
        {
          "ateUnidades": 400,
          "preco": 20.0
        },
        {
          "ateUnidades": null,
          "preco": 20.0
        }
      ]
    },
    {
      "cod": "FR",
      "nome": "FRIOS - CHARCUTARIA",
      "linhaOrcamento": 11,
      "linhaPrecos": 8,
      "qtdAdulto": 2.0,
      "qtdCrianca": 1.0,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 100,
          "preco": 20.0
        },
        {
          "ateUnidades": 200,
          "preco": 20.0
        },
        {
          "ateUnidades": null,
          "preco": 20.0
        }
      ]
    },
    {
      "cod": "MP",
      "nome": "MINI PIZZA",
      "linhaOrcamento": 12,
      "linhaPrecos": 9,
      "qtdAdulto": 5.0,
      "qtdCrianca": 3.0,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 300,
          "preco": 5.5
        },
        {
          "ateUnidades": 600,
          "preco": 5.5
        },
        {
          "ateUnidades": null,
          "preco": 5.5
        }
      ]
    },
    {
      "cod": "PB",
      "nome": "PIZZA BROTINHO (5 INGREDIENTES)",
      "linhaOrcamento": 13,
      "linhaPrecos": 10,
      "qtdAdulto": 2.5,
      "qtdCrianca": 1.0,
      "monitores": 2,
      "pesoCarrinho": 1.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 13.8
        },
        {
          "ateUnidades": 400,
          "preco": 13.8
        },
        {
          "ateUnidades": null,
          "preco": 13.8
        }
      ]
    },
    {
      "cod": "HD",
      "nome": "MINI HOT DOG ESPECIAL",
      "linhaOrcamento": 14,
      "linhaPrecos": 11,
      "qtdAdulto": 2.0,
      "qtdCrianca": 1.0,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 8.4
        },
        {
          "ateUnidades": 400,
          "preco": 8.4
        },
        {
          "ateUnidades": null,
          "preco": 8.4
        }
      ]
    },
    {
      "cod": "BF",
      "nome": "BATATA FRITA",
      "linhaOrcamento": 15,
      "linhaPrecos": 12,
      "qtdAdulto": 3.0,
      "qtdCrianca": 2.0,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 9.6
        },
        {
          "ateUnidades": 400,
          "preco": 9.6
        },
        {
          "ateUnidades": null,
          "preco": 9.6
        }
      ]
    },
    {
      "cod": "CP",
      "nome": "CREPE NO PALITO - 5 INGREDIENTES",
      "linhaOrcamento": 16,
      "linhaPrecos": 13,
      "qtdAdulto": 3.0,
      "qtdCrianca": 1.5,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 10.35
        },
        {
          "ateUnidades": 400,
          "preco": 9.775
        },
        {
          "ateUnidades": null,
          "preco": 9.775
        }
      ]
    },
    {
      "cod": "CF",
      "nome": "CREPE FRANCÊS - 5 INGREDIENTES",
      "linhaOrcamento": 17,
      "linhaPrecos": 14,
      "qtdAdulto": 2.0,
      "qtdCrianca": 1.0,
      "monitores": 2,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 13.2
        },
        {
          "ateUnidades": 400,
          "preco": 13.2
        },
        {
          "ateUnidades": null,
          "preco": 12.1
        }
      ]
    },
    {
      "cod": "CL",
      "nome": "CALDOS",
      "linhaOrcamento": 18,
      "linhaPrecos": 15,
      "qtdAdulto": 0.3,
      "qtdCrianca": 0.15,
      "monitores": 1,
      "pesoCarrinho": 1.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 50,
          "preco": 32.2
        },
        {
          "ateUnidades": 100,
          "preco": 28.75
        },
        {
          "ateUnidades": null,
          "preco": 28.75
        }
      ]
    },
    {
      "cod": "PA",
      "nome": "PASTELZINHO ARTESANAL - 5 SABORES",
      "linhaOrcamento": 19,
      "linhaPrecos": 16,
      "qtdAdulto": 8.5,
      "qtdCrianca": 4.0,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 300,
          "preco": 4.2
        },
        {
          "ateUnidades": 600,
          "preco": 4.2
        },
        {
          "ateUnidades": null,
          "preco": 4.2
        }
      ]
    },
    {
      "cod": "MA",
      "nome": "MASSAS (MACARRÃO)",
      "linhaOrcamento": 20,
      "linhaPrecos": 17,
      "qtdAdulto": 1.5,
      "qtdCrianca": 0.5,
      "monitores": 2,
      "pesoCarrinho": 1.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 100,
          "preco": 16.1
        },
        {
          "ateUnidades": 200,
          "preco": 16.1
        },
        {
          "ateUnidades": null,
          "preco": 16.1
        }
      ]
    },
    {
      "cod": "RS",
      "nome": "RISOTO",
      "linhaOrcamento": 21,
      "linhaPrecos": 35,
      "qtdAdulto": 1.5,
      "qtdCrianca": 0.5,
      "monitores": 2,
      "pesoCarrinho": 1.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 100,
          "preco": 40.0
        },
        {
          "ateUnidades": 200,
          "preco": 40.0
        },
        {
          "ateUnidades": null,
          "preco": 40.0
        }
      ]
    },
    {
      "cod": "ME",
      "nome": "MILHO NA ESPIGA",
      "linhaOrcamento": 22,
      "linhaPrecos": 18,
      "qtdAdulto": 1.5,
      "qtdCrianca": 1.0,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 100,
          "preco": 10.35
        },
        {
          "ateUnidades": 200,
          "preco": 10.35
        },
        {
          "ateUnidades": null,
          "preco": 10.35
        }
      ]
    },
    {
      "cod": "ML",
      "nome": "MILHO NO PRATINHO (4 INGREDIENTES)",
      "linhaOrcamento": 23,
      "linhaPrecos": 19,
      "qtdAdulto": 1.5,
      "qtdCrianca": 1.0,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 100,
          "preco": 13.8
        },
        {
          "ateUnidades": 200,
          "preco": 13.8
        },
        {
          "ateUnidades": null,
          "preco": 13.8
        }
      ]
    },
    {
      "cod": "CH",
      "nome": "CHURRASCO - ESPETINHOS",
      "linhaOrcamento": 24,
      "linhaPrecos": 23,
      "qtdAdulto": 3.0,
      "qtdCrianca": 1.5,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 16.8
        },
        {
          "ateUnidades": 300,
          "preco": 16.8
        },
        {
          "ateUnidades": null,
          "preco": 16.8
        }
      ]
    },
    {
      "cod": "CC",
      "nome": "CHURRASCO COMPLETO NA CHAPA",
      "linhaOrcamento": 25,
      "linhaPrecos": 24,
      "qtdAdulto": 3.0,
      "qtdCrianca": 1.5,
      "monitores": 2,
      "pesoCarrinho": 1.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 16.1
        },
        {
          "ateUnidades": 300,
          "preco": 16.1
        },
        {
          "ateUnidades": null,
          "preco": 16.1
        }
      ]
    },
    {
      "cod": "PR",
      "nome": "CHURRASCO NA PARRILLA",
      "linhaOrcamento": 26,
      "linhaPrecos": 37,
      "qtdAdulto": 0.45,
      "qtdCrianca": 0.25,
      "monitores": 2,
      "pesoCarrinho": 0.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 250,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 145.0
        },
        {
          "ateUnidades": 300,
          "preco": 135.0
        },
        {
          "ateUnidades": null,
          "preco": 125.0
        }
      ]
    },
    {
      "cod": "PQ",
      "nome": "PÃO DE QUEIJO SEU NINICO® RECHEADO",
      "linhaOrcamento": 27,
      "linhaPrecos": 40,
      "qtdAdulto": 3.0,
      "qtdCrianca": 2.0,
      "monitores": 2,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 9.5
        },
        {
          "ateUnidades": 400,
          "preco": 9.5
        },
        {
          "ateUnidades": null,
          "preco": 9.5
        }
      ]
    },
    {
      "cod": "CB",
      "nome": "COMIDA DE BUTECO",
      "linhaOrcamento": 28,
      "linhaPrecos": 43,
      "qtdAdulto": 2.5,
      "qtdCrianca": 1.5,
      "monitores": 2,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 10.5
        },
        {
          "ateUnidades": 400,
          "preco": 10.5
        },
        {
          "ateUnidades": null,
          "preco": 10.0
        }
      ]
    },
    {
      "cod": "AA",
      "nome": "AÇAÍ (1 FRUTA + 2 COBERTURAS + 3 RECHEIOS)",
      "linhaOrcamento": 32,
      "linhaPrecos": 22,
      "qtdAdulto": 2.0,
      "qtdCrianca": 1.0,
      "monitores": 1,
      "pesoCarrinho": 0.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 11.5
        },
        {
          "ateUnidades": 300,
          "preco": 11.5
        },
        {
          "ateUnidades": null,
          "preco": 10.35
        }
      ]
    },
    {
      "cod": "FE",
      "nome": "FELICIDADE",
      "linhaOrcamento": 33,
      "linhaPrecos": 36,
      "qtdAdulto": 1.5,
      "qtdCrianca": 1.0,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 300,
          "preco": 15.0
        },
        {
          "ateUnidades": 600,
          "preco": 15.0
        },
        {
          "ateUnidades": null,
          "preco": 15.0
        }
      ]
    },
    {
      "cod": "PC",
      "nome": "PICOLÉ",
      "linhaOrcamento": 34,
      "linhaPrecos": 20,
      "qtdAdulto": 2.5,
      "qtdCrianca": 2.5,
      "monitores": 1,
      "pesoCarrinho": 0.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 4.4
        },
        {
          "ateUnidades": 300,
          "preco": 4.4
        },
        {
          "ateUnidades": null,
          "preco": 4.4
        }
      ]
    },
    {
      "cod": "PT",
      "nome": "PICOLÉ GOURMET TRADICIONAL",
      "linhaOrcamento": 35,
      "linhaPrecos": 38,
      "qtdAdulto": 2.3,
      "qtdCrianca": 1.0,
      "monitores": 1,
      "pesoCarrinho": 0.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 9.0
        },
        {
          "ateUnidades": 300,
          "preco": 9.0
        },
        {
          "ateUnidades": null,
          "preco": 9.0
        }
      ]
    },
    {
      "cod": "PK",
      "nome": "PICOLÉ GOURMET KIBOM®",
      "linhaOrcamento": 36,
      "linhaPrecos": 39,
      "qtdAdulto": 2.3,
      "qtdCrianca": 1.0,
      "monitores": 1,
      "pesoCarrinho": 0.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 15.0
        },
        {
          "ateUnidades": 300,
          "preco": 15.0
        },
        {
          "ateUnidades": null,
          "preco": 15.0
        }
      ]
    },
    {
      "cod": "SV",
      "nome": "SORVETE (2 COBERTURAS + 3 RECHEIOS)",
      "linhaOrcamento": 37,
      "linhaPrecos": 21,
      "qtdAdulto": 2.0,
      "qtdCrianca": 2.0,
      "monitores": 1,
      "pesoCarrinho": 0.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 9.9
        },
        {
          "ateUnidades": 300,
          "preco": 9.9
        },
        {
          "ateUnidades": null,
          "preco": 9.35
        }
      ]
    },
    {
      "cod": "MC",
      "nome": "MINI CHURROS DOCE DE LEITE",
      "linhaOrcamento": 38,
      "linhaPrecos": 25,
      "qtdAdulto": 5.0,
      "qtdCrianca": 3.0,
      "monitores": 1,
      "pesoCarrinho": 1.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 300,
          "preco": 3.85
        },
        {
          "ateUnidades": 600,
          "preco": 3.85
        },
        {
          "ateUnidades": null,
          "preco": 3.85
        }
      ]
    },
    {
      "cod": "CG",
      "nome": "CHURROS GOURMET",
      "linhaOrcamento": 39,
      "linhaPrecos": 26,
      "qtdAdulto": 2.5,
      "qtdCrianca": 1.5,
      "monitores": 1,
      "pesoCarrinho": 0.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 11.0
        },
        {
          "ateUnidades": 400,
          "preco": 11.0
        },
        {
          "ateUnidades": null,
          "preco": 11.0
        }
      ]
    },
    {
      "cod": "FC",
      "nome": "FONDUE DE CHOCOLATE",
      "linhaOrcamento": 40,
      "linhaPrecos": 27,
      "qtdAdulto": 3.0,
      "qtdCrianca": 2.0,
      "monitores": 1,
      "pesoCarrinho": 0.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 6.5
        },
        {
          "ateUnidades": 400,
          "preco": 6.5
        },
        {
          "ateUnidades": null,
          "preco": 6.5
        }
      ]
    },
    {
      "cod": "MS",
      "nome": "MILK SHAKE TRADICIONAL",
      "linhaOrcamento": 41,
      "linhaPrecos": 28,
      "qtdAdulto": 2.0,
      "qtdCrianca": 2.0,
      "monitores": 1,
      "pesoCarrinho": 0.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 12.65
        },
        {
          "ateUnidades": 400,
          "preco": 12.65
        },
        {
          "ateUnidades": null,
          "preco": 11.55
        }
      ]
    },
    {
      "cod": "MK",
      "nome": "MILK SHAKE ESPECIAL",
      "linhaOrcamento": 42,
      "linhaPrecos": 29,
      "qtdAdulto": 2.0,
      "qtdCrianca": 2.0,
      "monitores": 1,
      "pesoCarrinho": 0.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 16.8
        },
        {
          "ateUnidades": 400,
          "preco": 16.8
        },
        {
          "ateUnidades": null,
          "preco": 16.8
        }
      ]
    },
    {
      "cod": "BG",
      "nome": "BRIGADEIRO GOURMET",
      "linhaOrcamento": 43,
      "linhaPrecos": 30,
      "qtdAdulto": 2.0,
      "qtdCrianca": 2.0,
      "monitores": 1,
      "pesoCarrinho": 0.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 6.25
        },
        {
          "ateUnidades": 300,
          "preco": 6.25
        },
        {
          "ateUnidades": null,
          "preco": 6.25
        }
      ]
    },
    {
      "cod": "OP",
      "nome": "OVOS DE PÁSCOA RECHEADOS",
      "linhaOrcamento": 44,
      "linhaPrecos": 42,
      "qtdAdulto": 1.5,
      "qtdCrianca": 1.0,
      "monitores": 1,
      "pesoCarrinho": 0.5,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 150,
          "preco": 11.0
        },
        {
          "ateUnidades": 300,
          "preco": 11.0
        },
        {
          "ateUnidades": null,
          "preco": 11.0
        }
      ]
    },
    {
      "cod": "GS",
      "nome": "DOCES E GULOSEIMAS (COM BALA FINI®)",
      "linhaOrcamento": 45,
      "linhaPrecos": 31,
      "qtdAdulto": 1.5,
      "qtdCrianca": 1.5,
      "monitores": 1,
      "pesoCarrinho": 0.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 11.0
        },
        {
          "ateUnidades": 400,
          "preco": 11.0
        },
        {
          "ateUnidades": null,
          "preco": 11.0
        }
      ]
    },
    {
      "cod": "FN",
      "nome": "BALAS FINI  ®",
      "linhaOrcamento": 51,
      "linhaPrecos": 34,
      "qtdAdulto": 1.5,
      "qtdCrianca": 2.0,
      "monitores": 1,
      "pesoCarrinho": 0.0,
      "fixos": [
        100,
        80
      ],
      "extraFixo": 0,
      "faixas": [
        {
          "ateUnidades": 200,
          "preco": 12.0
        },
        {
          "ateUnidades": 400,
          "preco": 12.0
        },
        {
          "ateUnidades": null,
          "preco": 12.0
        }
      ]
    }
  ],
  "ignorados": [
    {
      "cod": "EI",
      "nome": "EXPERIÊNCIA ITALIANA",
      "linha": 29,
      "motivo": "sem fórmula de preço na ORÇ. BUFFET (menu combo ou bebida com aba própria)"
    },
    {
      "cod": "EA",
      "nome": "EXPERIÊNCIA AMERICANA",
      "linha": 30,
      "motivo": "sem fórmula de preço na ORÇ. BUFFET (menu combo ou bebida com aba própria)"
    },
    {
      "cod": "EM",
      "nome": "EXPERIÊNCIA MINEIRA",
      "linha": 31,
      "motivo": "sem fórmula de preço na ORÇ. BUFFET (menu combo ou bebida com aba própria)"
    },
    {
      "cod": "AD",
      "nome": "ALGODÃO DOCE NO LED",
      "linha": 46,
      "motivo": "fórmula fora do padrão de buffet: 150"
    },
    {
      "cod": "CA",
      "nome": "CHOPP ARTESANAL ALELUIA BIER PURO MALTE",
      "linha": 47,
      "motivo": "sem fórmula de preço na ORÇ. BUFFET (menu combo ou bebida com aba própria)"
    },
    {
      "cod": "CV",
      "nome": "CERVEJA",
      "linha": 48,
      "motivo": "sem fórmula de preço na ORÇ. BUFFET (menu combo ou bebida com aba própria)"
    },
    {
      "cod": "BB",
      "nome": "BEBIDAS (NÃO ÁLCOOLICAS)                                                                QUANTIDADE INDICADA ->",
      "linha": 49,
      "motivo": "sem fórmula de preço na ORÇ. BUFFET (menu combo ou bebida com aba própria)"
    },
    {
      "cod": "DA",
      "nome": "DRINKS ALCOÓLICOS SIMPLES",
      "linha": 50,
      "motivo": "sem fórmula de preço na ORÇ. BUFFET (menu combo ou bebida com aba própria)"
    }
  ],
  "correcoes": [
    {
      "cod": "HD",
      "celula": "Y14",
      "original": "6",
      "corrigidoPara": "PREÇOS E QUANTIDADES!C11",
      "motivo": "Y14 continha o literal 6 em vez de apontar para a tabela. C11/G11/K11 valem todos 7×1,2 = 8,40, então o literal está defasado."
    },
    {
      "cod": "HD",
      "celula": "AC14",
      "original": "6",
      "corrigidoPara": "PREÇOS E QUANTIDADES!G11",
      "motivo": "AC14 continha o literal 6, mesmo caso de Y14."
    },
    {
      "cod": "ME",
      "celula": "AC22",
      "original": "='PREÇOS E QUANTIDADES'!G35",
      "corrigidoPara": "PREÇOS E QUANTIDADES!G18",
      "motivo": "AC22 apontava para G35, que é o preço do RISOTO (R$40), e não para G18, do MILHO NA ESPIGA (9×1,15 = 10,35). Erro de cópia."
    }
  ]
};
