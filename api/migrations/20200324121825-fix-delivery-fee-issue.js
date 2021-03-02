module.exports = {
  async up(db) {
    await db.collection('orders').updateMany(
      { 'delivery.fee': { $exists: false } },
      { $set: { 'delivery.fee': 0.0 } }
    )
  },

  async down(db) {
    await db.collection('orders').updateMany(
      { 'delivery.fee': { $exists: true } },
      { $unset: { 'delivery.fee': '' } }
    )
  }
}
