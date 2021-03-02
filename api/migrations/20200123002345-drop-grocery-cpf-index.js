module.exports = {
  async up(db) {
    try {
      await db.collection('customers').dropIndex('grocery_1_cpf_1')
    } catch (e) {
      console.log('Index grocery_1_cpf_1 dont exist. Dont worry we will create it')
    }
    await db.collection('customers').createIndex({ grocery: 1, mobile: 1 }, { unique: true, background: true })
  },

  async down(db) {
    await db.collection('customers').dropIndex('grocery_1_mobile_1')
    await db.collection('customers').createIndex({ grocery: 1, cpf: 1 }, { unique: true, background: true })
  }
}
