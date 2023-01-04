module.exports = {
  apps : [{
    name: "kairos-api",
    script: "dist/index.js",
    out_file: "./kairos-api.log",
    error_file: "./kairos-api.log",
    watch: true,
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}