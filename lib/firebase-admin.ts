import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

function stripWrappingQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function resolveServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!rawJson) {
    return null;
  }

  const parsed = JSON.parse(stripWrappingQuotes(rawJson));

  return {
    projectId: parsed.project_id as string | undefined,
    clientEmail: parsed.client_email as string | undefined,
    privateKey: typeof parsed.private_key === "string" ? parsed.private_key : undefined,
  };
}

function resolvePrivateKey() {
  if (process.env.FIREBASE_PRIVATE_KEY_BASE64) {
    return Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString(
      "utf8",
    );
  }

  if (process.env.FIREBASE_PRIVATE_KEY) {
    return stripWrappingQuotes(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n");
  }

  return undefined;
}

function getFirebaseAdminApp(): App {
  const serviceAccount = resolveServiceAccount();
  const projectId =
    serviceAccount?.projectId ??
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = serviceAccount?.clientEmail ?? process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = serviceAccount?.privateKey ?? resolvePrivateKey();
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

  if (!projectId || !clientEmail || !privateKey || !databaseURL) {
    throw new Error("Firebase Admin environment variables are missing.");
  }

  return getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL,
      });
}

export async function createFirebaseCustomToken(userId: string) {
  return getAuth(getFirebaseAdminApp()).createCustomToken(userId);
}

export function getFirebaseAdminDatabase() {
  return getDatabase(getFirebaseAdminApp());
}
