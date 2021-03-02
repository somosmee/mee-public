import mapIfoodSku from 'src/mapper/ifood/sku'

import { IfoodAvailability } from 'src/utils/enums'

const category = (category) => ({
  id: category.id,
  externalCode: category.externalCode,
  name: category.name,
  description: category.description,
  available: category.availability === IfoodAvailability.AVAILABLE,
  position: category.order,
  items: category.skus?.map(mapIfoodSku) ?? []
})

export { category as default }
