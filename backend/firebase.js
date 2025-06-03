import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

import serviceAccount from './permissions.json' with { type: 'json' };

const app = initializeApp(serviceAccount);
const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage};