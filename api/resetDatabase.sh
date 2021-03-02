#!/usr/bin/env mongo

const db = new Mongo().getDB("mee");

db.orders.deleteMany({});
db.users.deleteMany({});
db.customers.deleteMany({});
db.ifoodMarketplace.deleteMany({});
db.ifoodOrders.deleteMany({});
db.inventory.deleteMany({});
db.invoices.deleteMany({});
db.products.deleteMany({});
db.purchases.deleteMany({});
db.suppliers.deleteMany({});
db.userBill.deleteMany({});
db.usersProducts.deleteMany({});
