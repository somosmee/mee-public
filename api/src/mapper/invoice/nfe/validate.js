/**
 * INPUT VALIDATION FOR NFe MAPPING
 */
import Joi from '@hapi/joi'

const schema = Joi.object({
  subtotal: Joi.number().required(),
  company: Joi.object({
    nationalId: Joi.string().required(),
    name: Joi.string().required(),
    stateId: Joi.string().required(),
    tax: Joi.object({
      regime: Joi.string().required(),
      icmsOrigin: Joi.string().required(),
      icmsTaxGroup: Joi.string().required(),
      icmsCSOSN: Joi.string().required(),
      pisCofinsTaxGroup: Joi.string().required(),
      ibgeCityCode: Joi.string().required()
    }).required(),
    address: Joi.object({
      street: Joi.string().required(),
      number: Joi.string().required(),
      complement: Joi.string().allow(null),
      district: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required()
    }).required()
  }).required(),
  customer: Joi.object({
    nationalId: Joi.string(),
    business: Joi.object({
      nationalId: Joi.string()
    })
  }),
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.object({
          _id: Joi.any().required(),
          name: Joi.string().required(),
          ncm: Joi.string().required()
        }).required(),
        measurement: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        subtotal: Joi.number().required()
      })
    )
    .required()
})

export default {
  orderInput: (payload) => {
    const result = schema.validate(payload, { allowUnknown: true })

    if (result.error) throw new Error(JSON.stringify(result, null, 2))
  }
}
