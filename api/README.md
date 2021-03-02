[![Build Status](https://travis-ci.com/kayroncabral/mee.svg?token=ibFoUs4Eey7Bsz93pLds&branch=master)](https://travis-ci.com/kayroncabral/mee)

# Mee

A POS app for small grocery stores.

### Run backend

`npm start`

### Run backend tests

`npm test`

### Run frontend

`cd app`

`npm start`

### Run frontend tests

`cd app`

`npm test`

### Migrations

https://www.npmjs.com/package/migrate-mongo

```
# create migration
docker exec api npx migrate-mongo create your-migration-title-here

# check migrations status
docker exec api npx migrate-mongo status

# apply pending migrations
docker exec api npx migrate-mongo up

# revert the last applied migration
docker exec api npx migrate-mongo down

# !MOST IMPORTANTS FOR TESTING! run migrate inside docker
docker exec api yarn migrate:up

docker exec api yarn migrate:down

```

### Seeds

Mongo tools dependencies
```
brew install mongodb-community@4.2
brew link --overwrite mongodb-community
```

Update seeds from local database

```
npm run seed:update
```

Populate database with seed

```
npm run seed
```

### Stripe

listen local webhooks
```
stripe listen --forward-to localhost:4000/api/stripe/notify
```
