// In this file you can configure migrate-mongo

const config = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: process.env.MONGODB_HOST,
    databaseName: process.env.MONGODB_DATABASE,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'changelog'
}

if (process.env.NODE_ENV === 'development') config.mongodb.options.replicaSet = 'rs0'

//Return the config as a promise
module.exports = config
