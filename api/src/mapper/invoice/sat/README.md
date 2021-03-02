# SAT & Taxes

## Taxes

### Glossary

- Fato gerador - Fatos que vinculam o nascimento da obrigação jurídica de pagar um tributo
- Base de cálculo - totalidade das receitas (faturamento) da empresa
- Contribuintes - pessoas jurídicas, com exceção daquelas de pequeno porte submetidos ao regime do Simples Nacional

### PIS & COFINS

**PIS**

Programa de Integração Social, possibilita o acesso do trabalhador a benefícios como o FGTS e o Seguro-Desemprego.

**COFINS**

Seguridade Social


PIS e COFINS devem ser recolhidos sempre que uma empresa gera receitas durante o mês. O pagamento deve ser feito até o dia 25 do mês seguinte ao fato gerador.

#### Calculo

Incidência cumulativa

- Estão enquadrados neste regime as organizações que apuram o Imposto de Renda com base no Lucro Presumido ou Lucro arbitrado.
  - PIS: 0.65%
  - COFINS: 3%
  - total a pagar  = faturamento bruto * alíquota (0.65% ou 3%)
    - faturamento bruto = 20.000,00
    - PIS = 130,00
    - COFINS = 600,00

Incidência não-cumulativa

- No regime de incidência não-cumulativa acontece a apropriação de créditos em relação a custos, despesas e encargos da empresa. As organizações enquadradas neste regime são aquelas que apuram o imposto de renda com base no Lucro Real - observadas algumas exceções
  - PIS: 1.65%
  - COFINS: 7.6%
  - Para fazer o calculo dos tributos no regime não-cumulativo é preciso considerar não só o faturamento, mas também o valor das compras do período. Confira a fórmula
    - PIS / COFINS = PIS / COFINS sobre as vendas - Crédito sobre as compras
    - Se uma empresa que obteve o faturamento de 20.000,00 e registrou 10.000,00 em compras no período, o cálculo que deve ser feito é:
      - PIS sobre a venda: 20.000,00 * 1.65% = 330,00
      - Crédito de PIS sobre a compra 10.000,00 * 1,65% = 165,00
      - PIS = 330 - 165 = 165
      - COFINS sobre a venda: 20.000,00 * 7.6% - 1.512,00
      - Crédito de COFINS sobre a compra: 10.000,00 * 7.6% = 760,00
      - COFINS = 1520 - 760 = 760


## Full documentation on Invoice XML (SAT)

```xml
<!-- Required -->
<?xml version="1.0" encoding="UTF-8"?>
  <!-- Required -->
  <CFe>
    <!-- Required -->
    <infCFe versaoDadosEnt="0.02">
      <!-- Required - Identificação do CF-e -->
      <ide>
        <!-- Required - CNPJ Software House (no caso de teste fim a fim completar com 0) -->
        <CNPJ>00000000000000</CNPJ>
        <!-- Required - Assinatura do aplicativo comercial (nationalIds assinado com chave privado do Software house) (teste fim a fim completar com 344 "0") -->
        <signAC></signAC>
        <!-- Required - Número de 0 a 999 referente ao caixa em que o SAT está conectado -->
        <numeroCaixa>0</numeroCaixa>
      </ide>
      <!-- Required - Grupo de identificação do emitente do CF-e -->
      <emit>
        <!-- Required - CNPJ DO EMITENTE -->
        <CNPJ>11111111111111</CNPJ>
        <!-- Required - Inscrição Estadual (fdp não fala então estou deduzindo) -->
        <IE></IE>
        <!-- Conditional - Inscrição Municipal - Este campo deve ser informado, quando ocorrer a emissão de CF-e conjugada, com prestação de serviços sujeitos ao ISSQN e fornecimento de peças sujeitos ao ICMS. -->
        <IM></IM>
        <!-- Optional - Regime Especial de tributação do ISSQN (1 - Microempresa Municipal; 2 - Estimativa; 3 - Sociedade de Profissionais; 4 - Cooperativa; 5 - Microempresário Individual (MEI);) -->
        <cRegTribISSQN>1</cRegTribISSQN>
        <!--
          - Required
          - Indicador de rateio do Desconto sobre subtotal entre itens sujeitos à tributação pelo ISSQN
          - Informa se o Desconto sobre subtotal deve ser rateado entre os itens sujeitos à tributação pelo ISSQN.
           - 'S' - Desconto sobre subtotal será rateado entre os itens sujeitos ao ISSQN.
           - 'N' - Desconto sobre subtotal não será rateado entre os itens sujeitos ao ISSQN.
          - Os itens sujeitos à tributação pelo ICMS sempre participarão do rateio, independente da participação dos itens sujeitos ao ISSQN.
        -->
        <indRatISSQN="dRatISSQN">N</indRatISSQN>
      </emit>
      <!-- Required - Grupo de identificação do Destinatário do CF-e -->
      <dest>
        <!-- Optional - CNPJ do destinatário -->
        <CNPJ></CNPJ>
        <!-- Optional - CPF do destinatário -->
        <CPF></CPF>
        <!-- Optional - Razão Social ou Nome do destinatário -->
        <xNome>Guilherme Kenji Kodama</xNome>
      </dest>
      <!-- Optional - Grupo de identificação do Local de entrega -->
      <entrega>
        <!-- Required - Logradouro -->
        <xLgr></xLgr>
        <!-- Required - Numero -->
        <nro></nro>
        <!-- Optional - Complemento -->
        <xCpl></xCpl>
        <!-- Required - Bairro -->
        <xBairro></xBairro>
        <!-- Required - Nome do município -->
        <xMun></xMun>
        <!-- Required - Sigla da UF -->
        <UF></UF>
      </entrega>
      <!-- Required - Grupo do detalhamento de Produtos e Serviços do CF-e -->
      <det nItem="1">
        <!-- Required - TAG de grupo do detalhamento de Produtos e Serviços do CF-e -->
        <prod>
          <!-- Required - Código do produto ou serviço, interno do contribuinte -->
          <cProd></cProd>
          <!--
            - Optional
            - GTIN (Global EI01C Trade Item Number) do produto, antigo código EAN ou código de barras
            - Preencher com o código GTIN-8, GTIN-12, GTIN-13 ou GTIN-14 (antigos códigos EAN, UPC e DUN-14), não informar o conteúdo da TAG em caso de o produto não possuir este código.
          -->
          <cEAN></cEAN>
          <!-- Required - Descrição detalhada do produto para possibilitar a sua perfeita identificação -->
          <xProd></xProd>
          <!--
            - Optional
            - Código NCM com 8 dígitos ou 2 dígitos (gênero)
            - Código NCM (8 posições), informar o gênero (posição do capítulo do NCM) quando a operação não for de comércio exterior (importação/ exportação) ou o produto não seja tributado pelo IPI. Em caso de serviço informar o código 99
          -->
          <NCM></NCM>
          <!--
            - Optional
            - CEST - Código Especificador da Substituição Tributária
            - Código CEST que identifica a mercadoria sujeita aos regimes de substituição tributária e de antecipação do recolhimento do imposto.
          -->
          <CEST></CEST>
          <!-- Required - Código Fiscal de Operações e Prestações (Ex: 0001) -->
          <CFOP></CFOP>
          <!-- Required - Unidade Comercial (Ex: kg, un) -->
          <uCom></uCom>
          <!-- Required - Quantidade Comercial (Ex: 1.0000) -->
          <qCom></qCom>
          <!-- Required - Valor Unitário de Comercialização (Ex: 1.00) -->
          <vUnCom></vUnCom>
          <!--
            - Required
            - Regra de cálculo
            - Indicador da regra de cálculo utilizada para Valor Bruto dos Produtos e Serviços:
              - A - Arredondamento
              - T - Truncamento
            - Valor deve ser arredondado, com exceção de operação com combustíveis, quando deve ser truncado (Convenio ICMS 85/01 e Resolução ANP no 41/2013)
          -->
          <indRegra>A</indRegra>
          <!-- Optional - Valor do Desconto sobre item (Ex: 2.00) -->
          <vDesc></vDesc>
          <!--
            - Optional
            - Outras despesas acessórias sobre item (Ex: 2.00)
            - Valor de acréscimos sobre valor do item
          -->
          <vOutro></vOutro>
          <!--
            - Optional
            - Grupo do campo de uso livre do Fisco
            - Campo de uso livre do Fisco Informar o nome do campo no atributo xCampo e o conteúdo do campo no xTexto
          -->
          <obsFiscoDet>
            <!--
              - Required
              - Identificação do campo
              - Identificação do campo. No caso de combustíveis, preencher com “Cod. Produto ANP”
            -->
            <xCampoDet></xCampoDet>
            <!--
              - Required
              - Conteúdo do campo
              - Conteúdo do campo. No caso de combustíveis e/ou lubrificantes, quando informado “CFOP 5656 – Venda de combustível ou lubrificante adquirido ou recebido de terceiros destinado a consumidor ou usuário final”, informar código de produto do Sistema de Informações de Movimentação de produtos - SIMP (http://www.anp.gov.br/simp).
                - Informar 999999999 se o produto não possuir código de produto ANP.
                - Apenas para o layout 0.07:
                  - No caso de produtos sujeitos à substituição tributária, informar o Código CEST., conforme definido no Convênio ICMS 92,
            -->
            <xTextoDet></xTextoDet>
          </obsFiscoDet>
        </prod>
        <!--
          - Required
          - Grupo de Tributos incidentes no Produto ou Serviço
          - O grupo ISSQN é mutuamente exclusivo com o grupo ICMS, isto é se ISSQN for informado o grupo ICMS não será informado e vice-versa.
        -->
        <imposto>
          <!--
            - Optional
            - Grupo do ICMS da Operação própria e ST
            - Informar apenas um dos grupos N02, N03, N04, N05 com base no conteúdo informado na TAG Tributação do ICMS.
          -->
          <ICMS>
            <!--
              - Optional
              - Campo cRegTrib=3 – Regime Normal / Grupo de Tributação do ICMS= 00, 20, 90
              - Tributação do ICMS:
                - 00 – Tributada integralmente
                - 20 - Com redução de base de cálculo
                  - Essa é uma regra de diminuição de tributação que beneficia operações e prestações específicas, reduzindo em determinado percentual o valor que serve para base de cálculo do ICMS.
                  - ICMS Fazendo documentação artigos: https://legislacao.fazenda.sp.gov.br/Paginas/ind_temas.aspx
                  - Documentação da redução base de cálculo: https://legislacao.fazenda.sp.gov.br/Paginas/ind_art_an2.aspx
                - 90 - Outros
            -->
            <ICMS00>
              <!--
                - Required
                - Origem da mercadoria
                - Origem da mercadoria:
                  - 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8;
                  - 1 - Estrangeira - Importação direta, exceto a indicada no código 6;
                  - 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7;
                  - 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% (quarenta por cento) e inferior ou igual a 70% (setenta por cento);
                  - 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes; 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%;
                  - 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX;
                  - 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista da CAMEX;
                  - 8 – Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70% (setenta por cento).
              -->
              <Orig>0</Orig>
              <!--
                - Required
                - Tributação do ICMS = 00, 20, 90
                - Tributação do ICMS:
                  - 00 – Tributada integralmente
                  - 20 - Com redução de base de cálculo
                  - 90 - Outros
              -->
              <CST>00</CST>
              <!--
                - Required
                - Alíquota efetiva do imposto
              -->
              <pICMS>1.00</pICMS>
            </ICMS00>
            <!--
              - Optional
              - Campo cRegTrib=3 – Regime Normal / Grupo de Tributação do ICMS = 40, 41, 60
              - Tributação do ICMS –
                - 40 - Isenta
                - 41 - Não tributada
                - 60 - ICMS cobrado anteriormente por substituição tributária
            -->
            <ICMS40>
              <!-- Required - Origem da mercadoria -->
              <Orig>0</Orig>
              <!--
                - Required
                - Tributação do ICMS = 40, 41, 60
                - Tributação do ICMS –
                  - 40 - Isenta
                  - 41 - Não tributada
                  - 60 - ICMS cobrado anteriormente por substituição tributária
              -->
              <CST></CST>
            </ICMS40>
            <!--
              - Optional
              - Campo cRegTrib=1 – Simples Nacional e CSOSN=102, 300, 400, 500
              - Tributação do ICMS: pelo SIMPLES NACIONAL e CSOSN=102, 300, 400, 500
              -
            -->
            <ICMSSN102>
              <!-- Required - Origem da mercadoria -->
              <Orig>0</Orig>
              <!--
                - Required
                - Código de Situação da Operação – Simples Nacional
                - 102 - Tributada pelo Simples Nacional sem permissão de crédito.
                - 300 – Imune
                - 400 – Não tributada
                - 500 – ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação
              -->
              <CSOSN></CSOSN>
            </ICMSSN102>
            <!--
              - Optional
              - Campo cRegTrib=1 – Simples Nacional e CSOSN=900
              - Tributação do ICMS: pelo SIMPLES NACIONAL e CSOSN=900
            -->
            <ICMSSN900>
              <!-- Required - Origem da mercadoria -->
              <Orig>0</Orig>
              <!--
                - Required
                - Código de Situação da Operação – SIMPLES NACIONAL
                - Tributação pelo ICMS 900 - Outros
              -->
              <CSOSN></CSOSN>
              <!--
                - Required
                - Alíquota efetiva do imposto
                - Alíquota efetiva
                - Ex: 1.00
              -->
              <pICMS></pICMS>
            </ICMSSN900>
          </ICMS>
          <!--
            - Required
            - Grupo do PIS
            - Informar apenas um dos grupos Q02, Q03, Q04, Q05 ou Q06 com base valor atribuído ao campo Q07 – CST do PIS
          -->
          <PIS>
            <!--
              - Optional
              - Grupo de PIS tributado pela alíquota
              - CST = 01, 02 e 05
            -->
            <PISAliq>
              <!--
                - Required
                - Código de Situação Tributária do PIS
                - 01 – Operação Tributável (base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo));
                - 02 - Operação Tributável (base de cálculo = valor da operação (alíquota diferenciada));
                - 05 - Operação Tributável por Substituição Tributária;
              -->
              <CST>01</CST>
              <!--
                - Required
                - Valor da Base de Cálculo do PIS
                - CST = 01, 02 e 05
              -->
              <vBC>1.00</vBC>
              <!--
                - Required
                - Alíquota do PIS (em percentual)
                - Ex. Se a alíquota for 0,65% informar 0.0065
              -->
              <pPIS>0.0065</pPIS>
            </PISAliq>
            <!--
              - Optional
              - Grupo de PIS tributado por Qtde
              - CST = 03
            -->
            <PISQtde>
              <!--
                - Required
                - Código de Situação Tributária do PIS
                - 03 - Operação Tributável (base de cálculo = quantidade vendida x alíquota por unidade de produto);
              -->
              <CST>03</CST>
              <!--
                - Required
                - Quantidade Vendida
              -->
              <qBCProd>12.0000</qBCProd>
              <!--
                - Required
                - Alíquota do PIS (em reais)
              -->
              <vAliqProd>20.0000</vAliqProd>
            </PISQtde>
            <!--
              - Optional
              - Grupo de PIS não tributado
              - CST = 04, 06, 07, 08 ou 09
            -->
            <PISNT>
              <!--
                - Required
                - Código de Situação Tributária do PIS
                - 04 - Operação Tributável (tributação monofásica (alíquota zero));
                - 06 - Operação Tributável (alíquota zero);
                - 07 - Operação Isenta da Contribuição;
                - 08 - Operação Sem Incidência da Contribuição;
                - 09 - Operação com Suspensão da Contribuição;
              -->
              <CST>04</CST>
            </PISNT>
            <!--
              - Optional
              - Grupo de PIS para contribuinte do SIMPLES NACIONAL
              - CST = 49
            -->
            <PISSN>
              <!--
                - Required
                - Código de Situação Tributária do PIS
                - 49 - Outras Operações de saída;
              -->
              <CST>49</CST>
            </PISSN>
            <!--
              - Optional
              - Grupo de PIS Outras Operações
              - CST = 99 Informar campos para cálculo do PIS com aliquota em percentual (Q08 e Q09) ou campos para PIS com aliquota em valor (Q11 e Q12).
            -->
            <PISOutr>
              <!--
                - Required
                - Código de Situação Tributária do PIS
                - 99 - Outras Operações;
              -->
              <CST>99</CST>
              <!-- Optional - Valor da Base de Cálculo do PIS -->
              <vBC></vBC>
              <!-- Optional - Alíquota do PIS (em percentual) -->
              <pPIS></pPIS>
              <!-- Optional - Quantidade Vendida -->
              <qBCProd></qBCProd>
              <!-- Optional - Alíquota do PIS (em reais) -->
              <vAliqProd></vAliqProd>
            </PISOutr>
          </PIS>
          <!--
            - Optional
            - Grupo de PIS Substituição Tributária
            - Informar campos para cálculo do PIS com aliquota em percentual (R02 e R03) ou campos para PIS com aliquota em valor (R04 e R05).
          -->
          <PISST>
            <!-- Optional - Valor da Base de Cálculo do PIS -->
            <vBC></vBC>
            <!-- Optional - Alíquota do PIS (em percentual) -->
            <pPIS></pPIS>
            <!-- Optional - Quantidade Vendida -->
            <qBCProd></qBCProd>
            <!-- Optional - Alíquota do PIS (em reais) -->
            <vAliqProd></vAliqProd>
          </PISST>
          <!--
            - Required
            - Grupo do COFINS
            - Informar apenas um dos grupos S02, S03, S04, S05 ou S06 com base valor atribuído ao campo S07 – CST do COFINS
          -->
          <COFINS>
            <!--
              - Optional
              - Grupo de COFINS tributado pela alíquota
              - CST = 01, 02 e 05
            -->
            <COFINSAliq>
              <!--
                - Required
                - Código de Situação Tributária da COFINS
                - 01 – Operação Tributável (base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo));
                - 02 - Operação Tributável (base de cálculo = valor da operação (alíquota diferenciada));
                - 05 - Operação Tributável por Substituição Tributária;
              -->
              <CST>01</CST>
              <!--
                - Required
                - Valor da Base de Cálculo da COFINS
              -->
              <vBC></vBC>
              <!-- Required - Alíquotada COFINS (em percentual) -->
              <pCOFINS>0.0065</pCOFINS>
            </COFINSAliq>
            <!-- Optional - Grupo de COFINS tributado por Qtde - CST = 03 -->
            <COFINSQtde>
              <!--
                - Required
                - Código de Situação Tributária da COFINS
                - 03 - Operação Tributável (base de cálculo = quantidade vendida x alíquota por unidade de produto);
              -->
              <CST></CST>
              <!--
                - Required
                - Quantidade Vendida
              -->
              <qBCProd></qBCProd>
              <!--
                - Required
                - Alíquota da COFINS (em reais)
              -->
              <vAliqProd></vAliqProd>
            </COFINSQtde>
            <!-- Optional - Grupo de COFINS não tributado - CST = 04, 06, 07, 08 ou 09 -->
            <COFINSNT>
              <!--
                - Required
                - Código de Situação Tributária da COFINS
                - 04 - Operação Tributável (tributação monofásica (alíquota zero));
                - 06 - Operação Tributável (alíquota zero);
                - 07 - Operação Isenta da Contribuição;
                - 08 - Operação Sem Incidência da Contribuição;
                - 09 - Operação com Suspensão da Contribuição;
              -->
              <CST></CST>
            </COFINSNT>
            <!-- Optional - Grupo de COFINS para contribuinte do SIMPLES - CST = 49 -->
            <COFINSSN>
              <!--
                - Required
                - Código de Situação Tributária da COFINS
                - 49 - Outras Operações de saída;
              -->
              <CST></CST>
            </COFINSSN>
            <!-- Optional - Grupo de COFINS Outras Operações - CST = 99 Informar campos para cálculo da COFINS com aliquota em percentual (S08 e S09) ou campos para COFINS com aliquota em valor (S11 e S12). -->
            <COFINSOutr>
              <!--
                - Required
                - Código de Situação Tributária da COFINS
                - 99 - Outras Operações;
              -->
              <CST></CST>
              <!--
                - Required
                - Valor da Base de Cálculo da COFINS
              -->
              <vBC></vBC>
              <!--
                - Required
                - Alíquota da COFINS (em percentual)
                - Ex. Se a alíquota for 0,65% informar 0,0065
              -->
              <pCOFINS></pCOFINS>
              <!--
                - Required
                - Quantidade Vendida
              -->
              <qBCProd></qBCProd>
              <!--
                - Required
                - Alíquota da COFINS (em reais)
              -->
              <vAliqProd></vAliqProd>
            </COFINSOutr>
          </COFINS>
          <!--
            - Optional
            - Grupo de COFINS Substituição Tributária
            - Informar campos para cálculo do COFINS Substituição Tributária com aliquota em percentual (T02 e T03) ou campos para COFINS com aliquota em valor (T04 e T05).
          -->
          <COFINSST>
            <!--
              - Optional
              - Valor da Base de Cálculo da COFINS
            -->
            <vBC></vBC>
            <!--
              - Optional
              - Alíquota da COFINS (em percentual)
            -->
            <pCOFINS></pCOFINS>
            <!--
              - Optional
              - Quantidade Vendida
            -->
            <qBCProd></qBCProd>
            <!--
              - Optional
              - Alíquota da COFINS (em reais)
            -->
            <vAliqProd></vAliqProd>
          </COFINSST>
          <!--
            - Optional
            - Grupo do ISSQN
          -->
          <ISSQN>
            <!--
              - Required
              - Valor das deduções para ISSQN
            -->
            <vDeducISSQN></vDeducISSQN>
            <!--
              - Required
              - Alíquota do ISSQN
            -->
            <vAliq></vAliq>
            <!--
              - Optional
              - Código município de ocorrência do fato gerador do ISSQN
            -->
            <cMunFG></cMunFG>
            <!--
              - Optional
              - Item da lista de Serviços
            -->
            <cListServer></cListServer>
            <!--
              - Optional
              - Codigo de tributação pelo ISSQN do município
            -->
            <cServTribMun></cServTribMun>
            <!--
              - Required
              - Natureza da Operação de ISSQN
            -->
            <cNatOp></cNatOp>
            <!--
              - Required
              - Indicador de Incentivo Fiscal do ISSQN
            -->
            <indIncFisc></indIncFisc>
          </ISSQN>
        </imposto>
        <!-- Optional -->
        <infAdProd></infAdProd>
      </det>
      <!-- Required - Grupo de informações sobre Pagamento do CF- e -->
      <pgto>
        <!-- Required - Grupo de informações dos Meios de Pagamento empregados na quitação do CF-e -->
        <MP>
          <!--
            - Required
            - Código do Meio de Pagamento empregado para quitação do CF-e
            - 01 - Dinheiro
            - 02 - Cheque
            - 03 - Cartão de Crédito
            - 04 - Cartão de Débito
            - 05 - Crédito Loja
            - 10 - Vale Alimentação
            - 11 - Vale Refeição
            - 12 - Vale Presente
            - 13 - Vale Combustível
            - 99 - Outros
          -->
          <cMP>01</cMP>
          <!--
            - Required
            - Valor do Meio de Pagamento empregado para quitação do CF-e
          -->
          <vMP>1.00</vMP>
          <!-- Optional - Credenciadora de cartão de débito ou crédito -->
          <cAdmC></cAdmC>
        </MP>
      </pgto>
      <!-- Required - Grupo de Valores Totais do CF-e (o SAT popula essa tag) -->
      <total></total>
    </infCFe>
  </CFe>
</xml>
```

### Example of valid XML run on production for a client

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CFe>
    <infCFe versaoDadosEnt="0.07">
      <ide>
        <CNPJ>35725558000119</CNPJ>
        <signAC>q+Jz6HnJWL0Kdsf8nCPtD6jcIFDqkBPPoOt3rD+ez/u8JFE8wUof9tA9wLZdK2HqXeVGXCmG0UUBueGPwB1hzGjLMnIuaEOTIhngPhDtLWaZ5wsCeo9O26h94Al6kptlABC5BW5l7HcWnXtQbJxLuEyUrLzqV8FBrDmG4tjCQ61ppOQ7s2adFxkAJduUMq2fXIcKI5KyMtpMk0Gw+ziqJCwgXo029xepQeTtKtdTF03chEjIMqy2qesME5PhbiiKbSN1LE5rWT3DNtCfftjiBWubmYLgBCBJXoR0jaC6eQIoI0HTmVRuB8fZenmd/MC4MxzeUIfxpKtNXXfBar1n7w==</signAC>
        <numeroCaixa>001</numeroCaixa>
      </ide>
      <emit>
        <CNPJ>27412532000192</CNPJ>
        <IE>141895573117</IE>
        <cRegTribISSQN>5</cRegTribISSQN>
        <indRatISSQN>N</indRatISSQN>
      </emit>
      <dest>
        <CNPJ>03015395000194</CNPJ>
        <xNome>PlanMetal</xNome>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>6969</cProd>
          <xProd>Refeição</xProd>
          <NCM>21069090</NCM>
          <CFOP>5101</CFOP>
          <uCom>un</uCom>
          <qCom>23.0000</qCom>
          <vUnCom>17.90</vUnCom>
          <indRegra>A</indRegra>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <Orig>0</Orig>
              <CST>00</CST>
              <pICMS>12.00</pICMS>
            </ICMS00>
          </ICMS>
          <PIS>
            <PISAliq>
              <CST>01</CST>
              <vBC>411.70</vBC>
              <pPIS>0.0275</pPIS>
            </PISAliq>
          </PIS>
          <COFINS>
            <COFINSAliq>
              <CST>01</CST>
              <vBC>411.70</vBC>
              <pCOFINS>0.0760</pCOFINS>
            </COFINSAliq>
          </COFINS>
        </imposto>
      </det>
      <total></total>
      <pgto>
        <MP>
          <cMP>01</cMP>
          <vMP>411.70</vMP>
        </MP>
      </pgto>
    </infCFe>
  </CFe>
```

### Example of XML generated by GOV software

```xml
<CFe>
  <infCFe versaoDadosEnt="0.02">
    <ide>
      <CNPJ>12345678909123</CNPJ>
      <signAC>5xsN0GMILHWnf3P6UC1sfTMeIW1WHL1pVmXayslFGoGd0ht1XP2rEqRHJRt7iNflobwxKM9z4EsJG187l3D9MNrCQbULIgfagL4fTdVYUTEge11BeL0p2CmTHb6F4G4fHMoD0tkxf4OsY5cEPt1JOMEU0eLmWWGAMPWyFBP5l9FAiN86QnforoUtTkTeomHtpfj9AK0feLvbTWNuuDi9MEOaFnepccD0fLFjVbYF5H2TzNQQdGC0jAcc9Ri0QxrH8iSwGFwybnusr6WCQOYa76QRpvZM9MELyybqofdQuY3lCZfQ5gzFPlMJ7NSOhmcDcZ9KSsZHLhDj3C0OsnP54wp0</signAC>
      <numeroCaixa></numeroCaixa>
    </ide>
    <emit>
      <CNPJ>11111111111111</CNPJ>
      <IE>111111111111</IE>
      <IM>123123</IM>
      <cRegTribISSQN>1</cRegTribISSQN>
      <indRatISSQN="dRatISSQN">N</indRatISSQN>
    </emit>
    <dest></dest>
    <det nItem="1">
      <prod>
        <cProd>01</cProd>
        <xProd>Mega Alcool 92,8</xProd>
        <CFOP>0001</CFOP>
        <uCom>un</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>2.10</vUnCom>
        <indRegra>A</indRegra>
    </prod>
    <imposto>
      <ICMS>
        <ICMS00>
          <Orig>0</Orig>
          <CST>00</CST>
          <pICMS>5.00</pICMS>
        </ICMS00>
      </ICMS>
      <PIS>
        <PISAliq>
          <CST>01</CST>
          <vBC>1.10</vBC>
          <pPIS>1.0000</pPIS>
        </PISAliq>
      </PIS>
      <PISST>
        <vBC>1.00</vBC>
        <pPIS>1.0000</pPIS>
      </PISST>
      <COFINS>
        <COFINSAliq>
          <CST>01</CST>
          <vBC>1.00</vBC>
          <pCOFINS>1.0000</pCOFINS>
        </COFINSAliq>
      </COFINS>
    </imposto>
  </det>
  <pgto>
    <MP>
      <cMP>01</cMP>
      <vMP>33.00</vMP>
    </MP>
  </pgto>
  <total></total>
</infCFe>
</CFe>
```
