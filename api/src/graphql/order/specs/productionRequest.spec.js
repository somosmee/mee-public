import { serial as test } from 'ava'

test.todo('should not create production request if user dont have production lines')
test.todo(
  'should not create production request if item dont have productionLine set and user have productionLines'
)
test.todo('should create production request if user created order')
test.todo('should create production request if user increase order item quantity')
test.todo('should create production request if user updated order adding an item')
