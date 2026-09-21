import { openDB, DBSchema } from 'idb';

interface DhruvDB extends DBSchema {
  drafts: {
    key: string;
    value: { id: string; type: string; data: any; created_at: string; synced: boolean };
    indexes: { 'by-type': string };
  };
  syncQueue: {
    key: string;
    value: { id: string; entity_type: string; operation: string; payload: any; status: string; created_at: string };
  };
  cachedLocations: {
    key: string;
    value: any;
  };
  cachedTemplates: {
    key: string;
    value: any;
  };
}

export async function getDB() {
  return openDB<DhruvDB>('dhruv-track-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('drafts')) {
        const draftStore = db.createObjectStore('drafts', { keyPath: 'id' });
        draftStore.createIndex('by-type', 'type');
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cachedLocations')) {
        db.createObjectStore('cachedLocations', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cachedTemplates')) {
        db.createObjectStore('cachedTemplates', { keyPath: 'id' });
      }
    },
  });
}
