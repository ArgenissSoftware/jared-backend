const config = {
  development: {
    jaredDB: {
      username: "jared",
      password: "jared",
      database: "jaredDB",
      port: "27017",
      host: "mongodb://mongo/jaredDB",
    },
    listenHost: "0.0.0.0",
    listenPort: "3000",
  },
  production: {
    jaredDB: {
      username: "jared",
      password: "Jared123",
      database: "jaredDB",
      port: "55695",
      host: "mongodb://jared:Jared123@ds155695.mlab.com:55695/heroku_hs0vhjv0",
    },
    listenHost: "0.0.0.0",
    listenPort: "3000",
  },
};

export default config;
