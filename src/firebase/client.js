import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'
import { getAuth } from 'firebase/auth'
import '@firebase/auth'
import '@firebase/storage'
import 'firebase/firestore'

const firebaseKey = process.env.REACT_APP_FIREBASE_API_KEY
const firebaseProjectId = process.env.REACT_APP_FIREBASE_PROJECT_ID
const firebaseAuthDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
const firebaseStorageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET

const firebaseConfig = {
	apiKey: firebaseKey,
	authDomain: firebaseAuthDomain,
	projectId: firebaseProjectId,
	storageBucket: firebaseStorageBucket,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
