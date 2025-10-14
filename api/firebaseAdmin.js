// firebaseAdmin.js
import admin from "firebase-admin";

// Prevent reinitialization (important for Next.js/Vercel)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: import.meta.env.VITE_FIREBASE_CLIENT_EMAIL,
      privateKey: import.meta.env.VITE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export const dbAdmin = admin.firestore();
export const authAdmin = admin.auth();
