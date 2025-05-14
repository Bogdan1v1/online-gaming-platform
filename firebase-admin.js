const admin = require('firebase-admin');

let serviceAccount;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
} else {
  try {
    serviceAccount = require('./service-account-key.json');
  } catch (err) {
    console.error('Failed to load service account key:', err);
    throw err;
  }
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  console.error('Failed to initialize Firebase Admin:', err);
  throw err;
}

const db = admin.firestore();
module.exports = { db };