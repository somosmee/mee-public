#!/usr/bin/env bash

mongoexport --db mee --collection changelog --out ./seed/changelog.json
mongoexport --db mee --collection users --out ./seed/users.json
mongoexport --db mee --collection products --out ./seed/products.json
mongoexport --db mee --collection customers --out ./seed/customers.json
mongoexport --db mee --collection suppliers --out ./seed/suppliers.json
mongoexport --db mee --collection usersProducts --out ./seed/usersProducts.json
mongoexport --db mee --collection purchases --out ./seed/purchases.json
mongoexport --db mee --collection inventory --out ./seed/inventory.json
mongoexport --db mee --collection invoices --out ./seed/invoices.json
mongoexport --db mee --collection orders --out ./seed/orders.json
