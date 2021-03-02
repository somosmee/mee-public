export const order = {
  _id: '5f7f0f9962d58900402edff5',
  requireConfirmation: false,
  status: 'closed',
  origin: 'mee',
  shouldGenerateInvoice: true,
  items: [
    {
      modifiers: [],
      product: {
        _id: '5f7f0f4962d58900402edfd3',
        name: 'Bauru',
        ncm: '21069090'
      },
      gtin: '2000001000014',
      name: 'bauru',
      description: null,
      price: 4.5,
      measurement: 'unit',
      quantity: 2,
      note: '',
      subtotal: 9
    },
    {
      modifiers: [],
      product: {
        _id: '5f7f0f7d62d58900402edfdb',
        name: 'água mineral sem gás crystal 500 ml',
        ncm: '22011000'
      },
      gtin: '7894900530001',
      name: 'água mineral sem gás crystal 500 ml',
      description: null,
      price: 2.49,
      measurement: 'unit',
      quantity: 4,
      note: '',
      subtotal: 9.96
    }
  ],
  company: {
    _id: '5f7f0d4762d58900402edfcb',
    ifood: {
      marketAnalysisStatus: 'unstarted',
      open: false
    },
    onboarding: {},
    proxies: [],
    tax: {
      regime: '1',
      icmsCSOSN: '102',
      icmsOrigin: '0',
      icmsTaxGroup: '102',
      incidenceRegime: 'cumulative',
      pisCofinsTaxGroup: '01',
      ibgeCityCode: '3550308'
    },
    billableItems: [],
    settings: {
      priceRules: []
    },
    number: 1,
    createdAt: '2020-10-08T12:59:51.289Z',
    updatedAt: '2020-10-08T13:04:34.239Z',
    address: {
      _id: '5f7f0d7462d58900402edfcc',
      street: 'Rua Benedito Caim',
      number: '92',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '04121-070',
      lat: -23.59873,
      lng: -46.62438
    },
    nationalId: '35725558000119',
    name: 'MEE TECNOLOGIA DA INFORMACAO LTDA',
    stateId: '128236301110'
  },
  shortID: '1188',
  payments: [
    {
      prepaid: false,
      pending: true,
      method: 'cash',
      received: 100,
      value: 18.96,
      createdAt: null
    },
    {
      prepaid: false,
      pending: false,
      method: 'cash',
      value: 18.96,
      received: 100,
      createdAt: {
        $date: '2020-10-08T13:11:42.089Z'
      }
    }
  ],
  subtotal: 18.96,
  total: 18.96,
  totalPaid: 18.96,
  createdAt: {
    $date: '2020-10-08T13:09:45.813Z'
  },
  updatedAt: {
    $date: '2020-10-08T13:11:42.669Z'
  },
  customer: {
    _id: '5f7f0fbc62d58900402ee006',
    nationalId: '01719550212'
  },
  customerName: 'guilherme kodama',
  delivery: {
    fee: 0,
    _id: {
      $oid: '5f7f0ff462d58900402ee01a'
    },
    address: {
      _id: {
        $oid: '5f7f0ff362d58900402ee016'
      },
      street: 'Rua Benedito Caim',
      number: '250',
      complement: null,
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '04121-070'
    }
  },
  closedAt: {
    $date: '2020-10-08T13:11:42.093Z'
  },
  invoice: {
    retries: 0,
    status: 'pending',
    dataJS: {
      CFe: {
        infCFe: {
          _attributes: {
            versaoDadosEnt: '0.07'
          },
          ide: {
            CNPJ: '35725558000119',
            signAC:
              'hwZWFqGkcNHP5UsKDeecs55F1EiKkQYaHLtGEbtkJZoxBJ4CbZembeCBdgmIzyT9vcmLmjD33aBJFiyST5YIWHlQr+HkjdWspXeEw+Xtu0auSx4/OavEhiOEWb9iFzYpN+GRCAEwYaTWSjwJNrnt3R03WKQEnp40uyVLeLaps5Wo6OpVis1fX+gOMxHsYkoS2arYK6CdvkFHumfLytNWLrLw0/L8HbEZ3GBVv4AiXH82a8cs6dpXawoO0vw/Nr2Lb33+sOYWBrywsL2Aez529wbpJhtuMrs5hNBe9iUgry1hdgiKA8Qy/aFIA5OoDBE/cZx5hs/7PVZzQSrsbhVz6w==',
            numeroCaixa: '001'
          },
          emit: {
            CNPJ: '35725558000119',
            IE: '128236301110',
            indRatISSQN: 'N'
          },
          dest: {
            CPF: '01719550212',
            xNome: 'GuilhermeKodama'
          },
          entrega: {
            xLgr: 'Rua Benedito Caim',
            nro: '250',
            xBairro: 'Vila Mariana',
            xMun: 'São Paulo',
            UF: 'SP'
          },
          det: [
            {
              _attributes: {
                nItem: '1'
              },
              prod: {
                cProd: '2000001000014',
                xProd: 'bauru',
                CFOP: '5102',
                uCom: 'un',
                qCom: '2.0000',
                vUnCom: '4.50',
                indRegra: 'A'
              },
              imposto: {
                ICMS: {
                  ICMS00: {
                    Orig: '0',
                    CST: '00',
                    pICMS: '1.25'
                  }
                },
                PIS: {
                  PISAliq: {
                    CST: '01',
                    vBC: '18.96',
                    pPIS: '0.0065'
                  }
                },
                COFINS: {
                  COFINSAliq: {
                    CST: '01',
                    vBC: '18.96',
                    pCOFINS: '0.0300'
                  }
                }
              }
            },
            {
              _attributes: {
                nItem: '2'
              },
              prod: {
                cProd: '7894900530001',
                xProd: 'água mineral sem gás crystal 500 ml',
                CFOP: '5102',
                uCom: 'un',
                qCom: '4.0000',
                vUnCom: '2.49',
                indRegra: 'A'
              },
              imposto: {
                ICMS: {
                  ICMS00: {
                    Orig: '0',
                    CST: '00',
                    pICMS: '1.25'
                  }
                },
                PIS: {
                  PISAliq: {
                    CST: '01',
                    vBC: '18.96',
                    pPIS: '0.0065'
                  }
                },
                COFINS: {
                  COFINSAliq: {
                    CST: '01',
                    vBC: '18.96',
                    pCOFINS: '0.0300'
                  }
                }
              }
            }
          ],
          total: ' ',
          pgto: {
            MP: [
              {
                cMP: '01',
                vMP: '18.96'
              },
              {
                cMP: '01',
                vMP: '18.96'
              }
            ]
          }
        }
      }
    },
    dataXML:
      '<CFe>\n    <infCFe versaoDadosEnt="0.07">\n        <ide>\n            <CNPJ>35725558000119</CNPJ>\n            <signAC>hwZWFqGkcNHP5UsKDeecs55F1EiKkQYaHLtGEbtkJZoxBJ4CbZembeCBdgmIzyT9vcmLmjD33aBJFiyST5YIWHlQr+HkjdWspXeEw+Xtu0auSx4/OavEhiOEWb9iFzYpN+GRCAEwYaTWSjwJNrnt3R03WKQEnp40uyVLeLaps5Wo6OpVis1fX+gOMxHsYkoS2arYK6CdvkFHumfLytNWLrLw0/L8HbEZ3GBVv4AiXH82a8cs6dpXawoO0vw/Nr2Lb33+sOYWBrywsL2Aez529wbpJhtuMrs5hNBe9iUgry1hdgiKA8Qy/aFIA5OoDBE/cZx5hs/7PVZzQSrsbhVz6w==</signAC>\n            <numeroCaixa>001</numeroCaixa>\n        </ide>\n        <emit>\n            <CNPJ>35725558000119</CNPJ>\n            <IE>128236301110</IE>\n            <indRatISSQN>N</indRatISSQN>\n        </emit>\n        <dest>\n            <CPF>01719550212</CPF>\n            <xNome>GuilhermeKodama</xNome>\n        </dest>\n        <entrega>\n            <xLgr>Rua Benedito Caim</xLgr>\n            <nro>250</nro>\n            <xBairro>Vila Mariana</xBairro>\n            <xMun>São Paulo</xMun>\n            <UF>SP</UF>\n        </entrega>\n        <det nItem="1">\n            <prod>\n                <cProd>2000001000014</cProd>\n                <xProd>bauru</xProd>\n                <CFOP>5101</CFOP>\n                <uCom>un</uCom>\n                <qCom>2.0000</qCom>\n                <vUnCom>4.50</vUnCom>\n                <indRegra>A</indRegra>\n            </prod>\n            <imposto>\n                <ICMS>\n                    <ICMS00>\n                        <Orig>0</Orig>\n                        <CST>00</CST>\n                        <pICMS>1.25</pICMS>\n                    </ICMS00>\n                </ICMS>\n                <PIS>\n                    <PISAliq>\n                        <CST>01</CST>\n                        <vBC>18.96</vBC>\n                        <pPIS>0.0065</pPIS>\n                    </PISAliq>\n                </PIS>\n                <COFINS>\n                    <COFINSAliq>\n                        <CST>01</CST>\n                        <vBC>18.96</vBC>\n                        <pCOFINS>0.0300</pCOFINS>\n                    </COFINSAliq>\n                </COFINS>\n            </imposto>\n        </det>\n        <det nItem="2">\n            <prod>\n                <cProd>7894900530001</cProd>\n                <xProd>água mineral sem gás crystal 500 ml</xProd>\n                <CFOP>5101</CFOP>\n                <uCom>un</uCom>\n                <qCom>4.0000</qCom>\n                <vUnCom>2.49</vUnCom>\n                <indRegra>A</indRegra>\n            </prod>\n            <imposto>\n                <ICMS>\n                    <ICMS00>\n                        <Orig>0</Orig>\n                        <CST>00</CST>\n                        <pICMS>1.25</pICMS>\n                    </ICMS00>\n                </ICMS>\n                <PIS>\n                    <PISAliq>\n                        <CST>01</CST>\n                        <vBC>18.96</vBC>\n                        <pPIS>0.0065</pPIS>\n                    </PISAliq>\n                </PIS>\n                <COFINS>\n                    <COFINSAliq>\n                        <CST>01</CST>\n                        <vBC>18.96</vBC>\n                        <pCOFINS>0.0300</pCOFINS>\n                    </COFINSAliq>\n                </COFINS>\n            </imposto>\n        </det>\n        <total> </total>\n        <pgto>\n            <MP>\n                <cMP>01</cMP>\n                <vMP>18.96</vMP>\n            </MP>\n            <MP>\n                <cMP>01</cMP>\n                <vMP>18.96</vMP>\n            </MP>\n        </pgto>\n    </infCFe>\n</CFe>'
  }
}
