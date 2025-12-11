// src/web3/wallet.js

import * as SecureStore from 'expo-secure-store';
import * as Random from 'expo-random';
import * as secp from '@noble/secp256k1';
import {KEY_STORAGE} from "@/shared/lib/constants";
import 'react-native-get-random-values';
import {hmac} from '@noble/hashes/hmac.js';
import {sha256} from '@noble/hashes/sha2.js';


secp.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);
secp.hashes.sha256 = sha256;
secp.hashes.hmacSha256Async = async (key, msg) => hmac(sha256, key, msg);
secp.hashes.sha256Async = async (msg) => sha256(msg);
// Helpers for keypair generation and signing using noble-secp256k1


export async function generateKeypairIfNeeded() {
    let pk = await SecureStore.getItemAsync(KEY_STORAGE);
    if (pk) return { privateKeyHex: pk, publicKeyHex: secp.etc.bytesToHex(secp.getPublicKey(Buffer.from(pk, 'hex'))) };
    const rand = await Random.getRandomBytesAsync(32);
    const privateKeyHex = Buffer.from(rand).toString('hex');
    const publicKeyHex = secp.etc.bytesToHex(secp.getPublicKey(Buffer.from(privateKeyHex, 'hex')));
    await SecureStore.setItemAsync(KEY_STORAGE, privateKeyHex);
    return { privateKeyHex, publicKeyHex };
}

export async function getKeypair() {
    const pk = await SecureStore.getItemAsync(KEY_STORAGE);
    if (!pk) return null;
    const publicKeyHex = secp.etc.bytesToHex(secp.getPublicKey(Buffer.from(pk, 'hex')));
    return { privateKeyHex: pk, publicKeyHex };
}

// message - string
// @ts-ignore
export function signMessageHex(message, privateKeyHex) {
    const messageHash = sha256(Buffer.from(message, 'utf8'));
    return secp.sign(messageHash, privateKeyHex); // hex
}
