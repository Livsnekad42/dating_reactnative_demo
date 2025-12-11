// src/hooks/useWeb3Profile.js
import {useState} from 'react';
import {getKeypair, signMessageHex} from "@/shared/lib/web3/wallet";
import {pinFileUrlToPinata} from "@/shared/lib/web3/ipfs";
import {storeDocument} from "@/shared/lib/web3/l2Client";
import {Doc} from "@/shared/lib/types/web3";

// @ts-ignore
export default function useWeb3Profile({ pinataKey, pinataSecret }) {
    const [loading, setLoading] = useState(false);

    // @ts-ignore
    async function saveProfile({ name, bio, avatarUri }) {
        setLoading(true);
        try {
            const kp = await getKeypair();
            if (!kp) throw new Error('Wallet not connected');

            // 1) upload avatar to pinata if provided
            let avatarCid = null;
            if (avatarUri) {
                const pinFileRes = await pinFileUrlToPinata(pinataKey, pinataSecret, { uri: avatarUri, type: 'image/jpeg' });
                avatarCid = pinFileRes.IpfsHash;
            }

            const doc: Doc = {
                type: 'profile',
                ownerId: kp.publicKeyHex,
                name,
                bio,
                avatarCid: avatarCid ? `ipfs://${avatarCid}` : null,
                createdAt: Date.now(),
            };

            // 2) signature over compact string
            doc.signature = signMessageHex(JSON.stringify({name, bio, avatarCid}), kp.privateKeyHex);

            // 3) send to L2 mock
            const { docId, cid } = await storeDocument(doc);
            setLoading(false);
            return { docId, cid, doc };
        } catch (e) {
            setLoading(false);
            throw e;
        }
    }

    return { saveProfile, loading };
}
