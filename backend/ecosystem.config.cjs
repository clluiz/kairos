module.exports = {
  apps: [
    {
      name: "kairos-api",
      script: "dist/index.js",
      out_file: "./kairos-api.log",
      error_file: "./kairos-api.log",
      watch: ["dist"],
      ignore_watch: ["node_modules"],
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        DATABASE_URL: "postgresql://kairos:kairos_development@localhost:6543/kairos_db?schema=main"
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
}
