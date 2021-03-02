import mapIfoodOption from 'src/mapper/ifood/option'

import { IfoodAvailability } from 'src/utils/enums'

const complement = (complement) => ({
  id: complement.id,
  externalCode: complement.externalCode,
  name: complement.name,
  minimum: complement.minQuantity,
  maximum: complement.maxQuantity,
  available: complement.availability === IfoodAvailability.AVAILABLE,
  position: complement.sequence,
  options: complement.options?.map(mapIfoodOption) ?? []
})

export { complement as default }
