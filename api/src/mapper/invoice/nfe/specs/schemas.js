export const schemaIssuer = {
  type: 'object',
  anyOf: [{ required: ['cnpj'] }, { required: ['cpf'] }],
  properties: {
    cnpj: { type: 'string', description: 'CNPJ do emitente' },
    cpf: { type: 'string', description: 'CPF do remetente' },
    razao_social: { type: 'string', description: 'Razão social' },
    nome_fantasia: { type: 'string', description: 'Nome Fantasia' },
    inscricao_estadual: { type: 'string', description: 'Inscrição Estadual do Emitent' },
    cnae_fiscal: { type: 'string', description: 'CNAE fiscal' }, // opcional
    codigo_de_regime_tributario: { type: 'string', description: 'CNAE fiscal' },
    // endereço
    endereco_logradouro: { type: 'string', description: 'Logradouro' },
    endereco_numero: { type: 'string', description: 'Número' },
    endereco_bairro: { type: 'string', description: 'Bairro' },
    endereco_complemento: { type: 'string', description: 'Complemento' },
    endereco_municipio: { type: 'string', description: 'Nome do município' },
    endereco_uf: { type: 'string', description: 'Sigla UF' },
    endereco_cep: { type: 'string', description: 'Código CEP' }
  },
  required: [
    'endereco_logradouro',
    'endereco_numero',
    'endereco_bairro',
    'endereco_municipio',
    'endereco_uf',
    'endereco_cep',
    'razao_social',
    'inscricao_estadual',
    'codigo_de_regime_tributario'
  ]
}

export const schemaClient = {
  type: 'object',
  properties: {
    tipo_documento: { type: 'string', enum: ['CPF', 'CNPJ'], description: 'CPF ou CNPJ' },
    numero_documento: { type: 'string', description: 'número do CPF ou CNPJ' },
    razao_social: { type: 'string', description: 'Razão Social ou nome do destinatário' },
    email: { type: 'string', description: 'email' },
    indicador_ie: { type: 'number', default: 9, description: '9=Não contribuinte' },
    // endereço é opcional
    endereco_logradouro: { type: 'string', description: 'Logradouro' },
    endereco_numero: { type: 'string', description: 'Número' },
    endereco_bairro: { type: 'string', description: 'Bairro' },
    endereco_complemento: { type: 'string', description: 'Complemento' },
    endereco_municipio: { type: 'string', description: 'Nome do município' },
    endereco_uf: { type: 'string', description: 'Sigla UF' },
    endereco_cep: { type: 'string', description: 'Código CEP' },
    endereco_telefone: { type: 'string', description: 'Telefone (opcional)' }
  },
  required: ['tipo_documento', 'numero_documento', 'indicador_ie']
}

export const schemaProducts = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      codigo: { type: 'string', description: 'Código do produto ou serviço' },
      ean: {
        type: 'string',
        description:
          'GTIN (Global Trade Item Number) do produto, antigo código EAN ou código de barras'
      },
      ean_tributavel: {
        type: 'string',
        description:
          'Preencher com o código GTIN-8, GTIN-12, GTIN-13 ou GTIN- 14 (antigos códigos EAN, UPC e DUN-14) da unidade tributável do produto, não informar o conteúdo da TAG em caso de o produto não possuir este código.'
      },
      descricao: { type: 'string', description: 'Descrição do produto ou serviço' },
      ncm: { type: 'string', description: 'Código NCM com 8 dígitos' }, // esse vai ser foda
      cfop: { type: 'string', description: 'Código Fiscal de Operações e Prestações' },
      unidade_comercial: { type: 'string', description: 'Unidade Comercial (UN)' },
      unidade_tributavel: { type: 'string', description: 'Unidade Tributável' },
      quantidade_comercial: { type: 'number', description: 'Quantidade Comercial' },
      quantidade_tributavel: { type: 'number', description: 'Quantidade Tributável' },
      valor_unitario_comercial: {
        type: 'number',
        description: 'Valor Unitário de Comercialização'
      },
      valor_unitario_tributavel: { type: 'number', description: 'Valor Unitário de tributação' },
      valor_total_bruto: {
        type: 'number',
        description: 'Valor Total Bruto dos Produtos ou Serviços'
      },
      ind_total: {
        type: 'integer',
        description:
          'Indica se valor do Item (vProd) entra no valor total da NF-e (vProd). 0=Valor do item (vProd) não compõe o valor total da NF-e 1=Valor do item (vProd) compõe o valor total da NF-e (vProd) (v2.0)'
      },
      // icms
      /**
        0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8;
        1 - Estrangeira - Importação direta, exceto a indicada no código 6;
        2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7;
        3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%;
        4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes;
        5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%;
        6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural;
        7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural.
        8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%;
      */
      icms_origem: { type: 'integer', default: 0, description: 'Origem da mercadoria' },
      // https://www.substituicaotributaria.com/SST/substituicao-tributaria/regra-geral/?id=77
      icms_modalidade: {
        type: 'string',
        default: '102',
        description: 'Modalidade de determinação da BC do ICMS'
      }, // 102 - simples nacional
      // https://atendimento.tecnospeed.com.br/hc/pt-br/articles/360012174394-Tabela-de-equival%C3%AAncia-CSOSN-x-CST-
      icms_csosn: {
        type: 'string',
        default: '400',
        description: 'Código de Situação da Operação – SIMPLES NACIONAL'
      },
      // https://sites.google.com/a/mestresistemas.com.br/portal/home/cadastros/gerais/tabelas-de-apoio/cst---pis-cofins
      pis_modalidade: { type: 'string', default: '07', description: 'Código tabela PIS' },
      cofins_modalidade: { type: 'string', default: '07', description: 'Código tabela COFINS' },
      // https://blog.contaazul.com/impostos-nfc-e#:~:text=A%20base%20de%20c%C3%A1lculo%20%C3%A9,ou%20n%C3%A3o%20cumulativo%2C%20respectivamente).
      valor_tributos_aprox: {
        type: 'number',
        description: 'Valor total dos tributos a serem pagos por essa venda'
      }
    },
    required: [
      'codigo',
      'descricao',
      'ncm',
      'cfop',
      'unidade_comercial',
      'unidade_tributavel',
      'quantidade_comercial',
      'quantidade_tributavel',
      'valor_unitario_comercial',
      'valor_unitario_tributavel',
      'valor_total_bruto',
      'ind_total',
      'icms_origem',
      'icms_modalidade',
      'icms_csosn',
      'pis_modalidade',
      'cofins_modalidade',
      'valor_tributos_aprox'
    ]
  }
}

export const schemaNFe = {
  type: 'object',
  properties: {
    emitente: schemaIssuer,
    cliente: schemaClient,
    produtos: schemaProducts,
    responsavel_tecnico: {
      type: 'object',
      properties: {
        nationalId: { type: 'string', default: '35725558000119' },
        contato: { type: 'string', default: 'Mee' },
        email: { type: 'string', default: 'oi@somosmee.com' },
        fone: { type: 'string', default: '11987762113' }
      }
    },
    natureza_operacao: { type: 'string', default: 'VENDA' }, // venda, compra, transferência, devolução, etc
    forma_pagamento: { type: 'integer' }, // 0=Pagamento à vista; 1=Pagamento a prazo; 2=Outros.
    /*
    01=Dinheiro 02=Cheque 03=Cartão de Crédito 04=Cartão de Débito 05=Crédito Loja 10=Vale Alimentação 11=Vale Refeição 12=Vale Presente 13=Vale Combustível 99=Outros
    */
    tipo_pagamento: { type: 'integer', default: 1 },
    /*
      O tamanho do campo cNF - código numérico da NF-e foi reduzido para oito posições para não alterar o tamanho da chave de acesso da NF-e de 44 posições, que passa a ser composta pelos seguintes campos que se encontram dispersos na NF-e :
       cUF - Código da UF do emitente do Documento Fiscal
       AAMM - Ano e Mês de emissão da NF-e
       CNPJ - CNPJ do emitente
       mod - Modelo do Documento Fiscal
       serie - Série do Documento Fiscal
       nNF - Número do Documento Fiscal
       tpEmis – forma de emissão da NF-e
       cNF - Código Numérico que compõe a Chave de Acesso
       cDV - Dígito Verificador da Chave de Acesso
    */
    modelo: { type: 'integer', default: 65 }, // 55=NF-e; 65=NFC-e
    serie: { type: 'string', default: '1' },
    numero_nf: { type: 'string', default: '1' }, // Número do Documento Fiscal. Faixa: 1–999999999
    tipo_documento: { type: 'number', default: 1 }, // 0=entrada; 1=saida
    municipio: { type: 'string' }, // Código IBGE do Município
    tipo_impressao_danfe: { type: 'integer', default: 4 }, // 0=Sem geração de DANFE;1=DANFE normal, Retrato;2=DANFE normal Paisagem;3=DANFE Simplificado;4=DANFE NFC-e;
    forma_emissao: { type: 'string', default: '1' }, // 1=Emissão normal (não em contingência);
    cliente_final: { type: 'integer', default: '1' }, // 0=Normal;1=Consumidor final;
    indicador_destino: { type: 'integer', default: 1 },
    indicador_presencial: { type: 'integer', default: 1 },
    finalidade_emissao: { type: 'string', default: '1' }, // 1=NF-e normal;2=NF-e complementar;3=NF-e de ajuste;4=Devolução de mercadoria.
    processo_emissao: { type: 'string', default: '0' }, // 0=Emissão de NF-e com aplicativo do contribuinte;
    transporte_modalidade_frete: { type: 'integer', default: 9 }, // 9=Sem Ocorrência de Transporte.
    informacoes_adicionais_interesse_fisco: {
      type: 'string',
      default: 'venda para consumidor final'
    },
    totais_tributos_aproximado: {
      type: 'number',
      description: 'Valor somado do produtos.valor_tributos_aprox'
    }
  },
  required: [
    'emitente',
    'produtos',
    'responsavel_tecnico',
    'natureza_operacao',
    'forma_pagamento',
    'tipo_pagamento',
    'modelo',
    'serie',
    'numero_nf',
    'tipo_documento',
    'municipio',
    'tipo_impressao_danfe',
    'forma_emissao',
    'cliente_final',
    'indicador_destino',
    'indicador_presencial',
    'finalidade_emissao',
    'processo_emissao',
    'transporte_modalidade_frete',
    'informacoes_adicionais_interesse_fisco',
    'totais_tributos_aproximado'
  ]
}
