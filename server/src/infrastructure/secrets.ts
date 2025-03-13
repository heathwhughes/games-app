// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env
const isLocal = process.env.NODE_ENV !== "prod";

if (isLocal) {
  console.log("Running locally. Skipping AWS Secrets Manager.");
}
  
export async function getSecret() {
  if (isLocal) {
    console.log(`Local db secret: ${process.env.LOCAL_DB_SECRET}`)
    return process.env.LOCAL_DB_SECRET; // Use local secret
  }

  const secret_name = process.env.AWS_SECRET_NAME;

  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
  });
  
  let response;

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );

    return response.SecretString;
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
}
