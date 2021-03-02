import mapIfoodComplement from 'src/mapper/ifood/complement'

import { IfoodAvailability } from 'src/utils/enums'

const sku = (sku) => ({
  id: sku.id,
  externalCode: sku.externalCode,
  name: sku.name,
  description: sku.description,
  price: sku.price.value,
  available: sku.availability === IfoodAvailability.AVAILABLE,
  position: sku.sequence,
  modifiers: sku.complements?.map(mapIfoodComplement) ?? []
})

export { sku as default }
