import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, off } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDF7vIs7FPGo-aUHytZV_4iVX8oSzp7iJU",
  authDomain: "mundial2026jp.firebaseapp.com",
  databaseURL: "https://mundial2026jp-default-rtdb.firebaseio.com",
  projectId: "mundial2026jp",
  storageBucket: "mundial2026jp.firebasestorage.app",
  messagingSenderId: "1085151729323",
  appId: "1:1085151729323:web:43fcddc578967103e109ee",
  measurementId: "G-QM16KD2M3V"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function loadRoom(code) {
  try {
    const snapshot = await get(ref(db, `rooms/${code}`));
    if (!snapshot.exists()) return null;
    return snapshot.val();
  } catch { return null; }
}

export async function saveRoom(code, data) {
  try {
    await set(ref(db, `rooms/${code}`), data);
    return true;
  } catch { return false; }
}

export function subscribeRoom(code, callback) {
  const roomRef = ref(db, `rooms/${code}`);
  onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) callback(snapshot.val());
  });
  return () => off(roomRef);
}
