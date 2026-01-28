// IndexedDB wrapper for game saves
const DB_NAME = "ProgrammableBotsDB";
const DB_VERSION = 1;
const STORE_NAME = "saves";

let db = null;

// Initialize the database
export async function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            console.log("IndexedDB initialized");
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: "name" });
                console.log("Created object store:", STORE_NAME);
            }
        };
    });
}

// Save game to IndexedDB
export async function saveGameToDB(saveName, saveData) {
    if (!db) await initDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ name: saveName, ...saveData });

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            console.log(`Save "${saveName}" stored in IndexedDB`);
            resolve(request.result);
        };
    });
}

// Load game from IndexedDB
export async function loadGameFromDB(saveName) {
    if (!db) await initDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(saveName);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            if (request.result) {
                console.log(`Save "${saveName}" loaded from IndexedDB`);
                resolve(request.result);
            } else {
                resolve(null);
            }
        };
    });
}

// List all saves
export async function listAllSaves() {
    if (!db) await initDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const saves = request.result.map(save => ({
                name: save.name,
                timestamp: save.timestamp,
                lastPlayed: save.lastPlayed || new Date(save.timestamp).toLocaleDateString("fr-FR")
            }));
            resolve(saves);
        };
    });
}

// Delete save
export async function deleteGameFromDB(saveName) {
    if (!db) await initDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(saveName);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            console.log(`Save "${saveName}" deleted from IndexedDB`);
            resolve();
        };
    });
}

// Clear all saves
export async function clearAllSaves() {
    if (!db) await initDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            console.log("All saves cleared from IndexedDB");
            resolve();
        };
    });
}
