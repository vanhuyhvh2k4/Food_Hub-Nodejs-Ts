import "dotenv/config";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY_FIREBASE!,
  authDomain: process.env.AUTH_DOMAIN_FIREBASE!,
  projectId: process.env.PROJECT_ID_FIREBASE!,
  storageBucket: process.env.STORAGE_BUCKET_FIREBASE!,
  messagingSenderId: process.env.MESSAGE_SENDER_ID_FIREBASE!,
  appId: process.env.APP_ID_FIREBASE!
};
  
  export default firebaseConfig;
  