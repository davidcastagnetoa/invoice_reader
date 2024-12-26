import dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env
dotenv.config();

export const config = {
  // Server
  port: process.env.PORT,
  environment: process.env.ENVIRONMENT,

  // AWS
  awsRegion: process.env.AWS_REGION,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  // AWS S3
  s3BucketName: process.env.S3_BUCKET_NAME,
  s3BucketUrl: process.env.S3_BUCKET_URL,

  // JWT
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,

  // OpenAI API Key
  openaiApiKey: process.env.OPENAI_API_KEY,

  // Github OAuth
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubRedirectUri: process.env.GITHUB_REDIRECT_URI,

  // Database Dialect
  databaseDialect: process.env.DATABASE_DIALECT,

  // Database Username
  databaseDevelopmentUser: process.env.DATABASE_USER_DEV,
  databaseProductionUser: process.env.DATABASE_USER_PROD,

  // Database Password
  databaseDevelopmentPassword: process.env.DATABASE_PASSWORD_DEV,
  databaseProductionPassword: process.env.DATABASE_PASSWORD_PROD,

  // Database Host
  databaseDevelopmentHost: process.env.DATABASE_HOST_DEV,
  databaseProductionHost: process.env.DATABASE_HOST_PROD,

  // Database Port
  databasePort: process.env.DATABASE_PORT,

  // Database name
  databaseName: process.env.DATABASE_NAME,
};

// Control de credenciales y errores para debug
if (!config.port) {
  console.log("Port environment variable not set. Please add PORT to .env file.");
}
if (!config.environment) {
  console.log("Environment environment variable not set. Please add ENVIRONMENT to .env file.");
}
if (!config.awsRegion) {
  console.log("AWS Region environment variable not set. Please add AWS_REGION to .env file.");
}
if (!config.awsAccessKeyId) {
  console.log("AWS Access Key ID environment variable not set. Please add AWS_ACCESS_KEY_ID to .env file.");
}
if (!config.awsSecretAccessKey) {
  console.log("AWS Secret Access Key environment variable not set. Please add AWS_SECRET_ACCESS_KEY to .env file.");
}
if (!config.s3BucketName) {
  console.log("S3 Bucket Name environment variable not set. Please add S3_BUCKET_NAME to .env file.");
}
if (!config.s3BucketUrl) {
  console.log("S3 Bucket URL environment variable not set. Please add S3_BUCKET_URL to .env file.");
}
if (!config.accessTokenSecret) {
  console.log("Access Token Secret environment variable not set. Please add ACCESS_TOKEN_SECRET to .env file.");
}
if (!config.refreshTokenSecret) {
  console.log("Refresh Token Secret environment variable not set. Please add REFRESH_TOKEN_SECRET to .env file.");
}
if (!config.googleClientId) {
  console.log("Google client ID environment variable not set. Please add GOOGLE_CLIENT_ID to .env file.");
}
if (!config.googleClientSecret) {
  console.log("Google Secret environment variable not set. Please add GOOGLE_CLIENT_SECRET to .env file.");
}
if (!config.googleRedirectUri) {
  console.log("Google Redirect URI environment variable not set. Please add GOOGLE_REDIRECT_URI to .env file.");
}
if (!config.openaiApiKey) {
  console.log("OpenAI API Key environment variable not set. Please add OPENAI_API_KEY to .env file.");
}
if (!config.githubClientId) {
  console.log("Github client ID environment variable not set. Please add GITHUB_CLIENT_ID to .env file.");
}
if (!config.githubClientSecret) {
  console.log("Github Secret environment variable not set. Please add GITHUB_CLIENT_SECRET to .env file.");
}
if (!config.githubRedirectUri) {
  console.log("Github Redirect URI environment variable not set. Please add GITHUB_REDIRECT_URI to .env file.");
}
if (!config.databaseDialect) {
  console.log("Database Dialect environment variable not set. Please add DATABASE_DIALECT to .env file.");
}
if (!config.databaseDevelopmentUser) {
  console.log("Database User environment variable not set. Please add DATABASE_USER_DEV to .env file.");
}
if (!config.databaseProductionUser) {
  console.log("Database User environment variable not set. Please add DATABASE_USER_PROD to .env file.");
}
if (!config.databaseDevelopmentPassword) {
  console.log("Database Password environment variable not set. Please add DATABASE_PASSWORD_DEV to .env file.");
}
if (!config.databaseProductionPassword) {
  console.log("Database Password environment variable not set. Please add DATABASE_PASSWORD_PROD to .env file.");
}
if (!config.databaseDevelopmentHost) {
  console.log("Database Host environment variable not set. Please add DATABASE_HOST_DEV to .env file.");
}
if (!config.databaseProductionHost) {
  console.log("Database Host environment variable not set. Please add DATABASE_HOST_PROD to .env file.");
}
if (!config.databasePort) {
  console.log("Database Port environment variable not set. Please add DATABASE_PORT to .env file.");
}
if (!config.databaseName) {
  console.log("Database Name environment variable not set. Please add DATABASE_NAME to .env file.");
}
