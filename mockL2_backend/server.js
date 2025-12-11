// l2-mock/server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const { randomUUID } = require('crypto');

const PINATA_KEY = process.env.PINATA_KEY;
const PINATA_SECRET = process.env.PINATA_SECRET;
const PINATA_URL = process.env.PINATA_URL;

if (!PINATA_KEY || !PINATA_SECRET) {
    console.warn('Pinata keys not set. See .env.example');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const store = new Map(); // docId -> { doc, cid }

app.post('/store', async (req, res) => {
    try {
        const doc = req.body;
        // pin doc JSON to Pinata
        const pinRes = await fetch(PINATA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                pinata_api_key: PINATA_KEY,
                pinata_secret_api_key: PINATA_SECRET,
            },
            body: JSON.stringify({ pinataContent: doc }),
        });

        if (!pinRes.ok) {
            const t = await pinRes.text();
            console.error('Pinata error', t);
            return res.status(502).json({ error: 'Pinata pin failed', detail: t });
        }

        const pinJson = await pinRes.json(); // { IpfsHash, PinSize, Timestamp }
        const docId = randomUUID();
        store.set(docId, { doc, cid: pinJson.IpfsHash });
        return res.json({ docId, cid: pinJson.IpfsHash });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

app.get('/document/:id', async (req, res) => {
    const id = req.params.id;
    if (!store.has(id)) return res.status(404).json({ error: 'not found' });
    const { doc, cid } = store.get(id);
    return res.json({ doc, cid });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`L2 mock listening ${PORT}`));
