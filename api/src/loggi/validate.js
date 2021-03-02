import Joi from '@hapi/joi'

/*
  R. Minas Gerais, 236 - Higienópolis, São Paulo - SP, 01244-010, Brasil
  -   ----------   ---    ----------    -------   ---   -------    ----
  1       2         3         4            5       6       7         8

  Dica: se você usa o serviço de localização do Google Maps (geocoding),
  o campo formatted_address tende a ser uma ótima string de endereço.
 */

/*
   Sobre os métodos com ponto de retorno
   Quando o pagamento é feito com dinheiro sem troco,
   dinheiro com troco, pagamento com maquininha da loja ou cheque,
   um ponto de retorno é adicionado automaticamente ao pedido.
   Esse ponto de retorno pode gerar cobranças.
  */

const addressSchema = {
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  address: Joi.string().required(),
  complement: Joi.string()
}
const pickupSchema = Joi.object({
  address: Joi.object(addressSchema).required(),
  instructions: Joi.string()
})

const packageSchema = Joi.object({
  pickupIndex: Joi.number().required(),
  recipient: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required()
  }).required(),
  address: Joi.object(addressSchema).required(),
  dimensions: Joi.object({
    width: Joi.number().required(),
    height: Joi.number().required(),
    weight: Joi.number().required(),
    length: Joi.number().required()
  }).required(),
  charge: Joi.object({
    value: Joi.string().required(),
    method: Joi.number().valid(1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024),
    change: Joi.string().required()
  }).required(),
  instructions: Joi.string()
})

const schema = Joi.object({
  data: Joi.object({
    shopId: Joi.number().required(),
    pickups: Joi.array()
      .min(1)
      .items(pickupSchema)
      .required(),
    packages: Joi.array()
      .min(1)
      .items(packageSchema)
      .required()
  }).required()
})

export default {
  createOrder: (payload) => {
    const result = schema.validate(payload)

    if (result.error) throw new Error(JSON.stringify(result, null, 2))
  }
}
