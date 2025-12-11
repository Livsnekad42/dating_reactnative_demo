// src/web3/l2Client.js
// Small client wrapper for mock L2 backend
const BASE_URL = (process.env.__DEV__ && process.env.L2_MOCK_HOST) ? process.env.L2_MOCK_HOST : 'http://10.0.2.2:3000'; // emulator default
// @ts-ignore
export async function storeDocument(document: any) {
    const res = await fetch(`${BASE_URL}/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document),
    });
    if (!res.ok) {
        const t = await res.text();
        throw new Error('L2 store failed: ' + t);
    }
    return res.json(); // { docId, cid }
}

export async function getDocument(docId: any) {
    const res = await fetch(`${BASE_URL}/document/${docId}`);
    if (!res.ok) throw new Error('L2 getDocument failed');
    return res.json();
}
