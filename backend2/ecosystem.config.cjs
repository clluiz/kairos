module.exports = {
  apps : [{
    name: "kairos-api",
    script: "dist/main.js",
    watch: true,
    igore_watch: ["node_modules"],
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}