#!/usr/bin/env bash

mongoimport --db mee --collection changelog --file seed/changelog.json
mongoimport --db mee --collection users --file seed/users.json
mongoimport --db mee --collection products --file seed/products.json
mongoimport --db mee --collection orders --file seed/orders.json
mongoimport --db mee --collection customers --file seed/customers.json
mongoimport --db mee --collection suppliers --file seed/suppliers.json
mongoimport --db mee --collection inventory --file seed/inventory.json
mongoimport --db mee --collection invoices --file seed/invoices.json
mongoimport --db mee --collection purchases --file seed/purchases.json
mongoimport --db mee --collection usersProducts --file seed/usersProducts.json
