import { IfoodAvailability } from 'src/utils/enums'

const option = (option) => ({
  id: option.id,
  externalCode: option.externalCode,
  name: option.name,
  description: option.description,
  price: option.price.value,
  available: option.availability === IfoodAvailability.AVAILABLE,
  position: option.sequence
})

export { option as default }
