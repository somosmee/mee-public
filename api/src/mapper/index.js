import mapIfoodOrderToOrder from 'src/mapper/ifood'
import { mapOrderToNFe } from 'src/mapper/invoice/nfe'
import { mapOrderToInvoice } from 'src/mapper/invoice/sat'

export default {
  mapOrderToInvoice,
  mapIfoodOrderToOrder,
  mapOrderToNFe
}
