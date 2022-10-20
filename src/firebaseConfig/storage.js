import { getStorage, ref } from 'firebase/storage';

export const storage = getStorage();
export const adminRef = ref(storage, 'Admin');
export const rootRef = adminRef.root;