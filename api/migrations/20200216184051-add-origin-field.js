module.exports = {
  async up(db) {
    await db.collection('orders').updateMany({ origin: null }, { $set: { origin: 'mee' } })
  },

  async down(db) {
    await db.collection('orders').updateMany({ origin: 'mee' }, { $unset: { origin: 1 } })
  }
}
