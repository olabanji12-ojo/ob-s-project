import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

function getServiceAccount() {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT env var');
  const json = JSON.parse(sa);
  // Fix private key newlines if needed
  if (json.private_key && json.private_key.includes('\\n')) {
    json.private_key = json.private_key.replace(/\\n/g, '\n');
  }
  return json;
}

export function getAdminApp() {
  if (!getApps().length) {
    initializeApp({ credential: cert(getServiceAccount()) });
  }
  return getApps()[0];
}

export function getDb() {
  return getFirestore(getAdminApp());
}

export function getAdmin() {
  // convenience bundle
  return { db: getDb(), auth: getAdminAuth(getAdminApp()) };
}
