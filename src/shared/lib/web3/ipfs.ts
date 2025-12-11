// src/web3/ipfs.js
// Minimal Pinata helper: pin JSON and file (avatar)
// @ts-ignore
export async function pinJSONToPinata(pinataKey, pinataSecret, content) {
    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            pinata_api_key: pinataKey,
            pinata_secret_api_key: pinataSecret,
        },
        body: JSON.stringify({ pinataContent: content }),
    });
    if (!res.ok) throw new Error('Pinata pinJSON failed: ' + (await res.text()));
    return res.json(); // { IpfsHash, PinSize, Timestamp }
}

export async function pinFileUrlToPinata(pinataKey: any, pinataSecret: any, fileBlob: { uri: any; type: any; }, fileName = 'avatar.jpg') {
    // fileBlob is a Blob or base64; for RN we'll use fetch(uri).blob() or FormData
    const form = new FormData();
    form.append('file', {
        uri: fileBlob.uri || fileBlob,
        type: fileBlob.type || 'image/jpeg',
        name: fileName,
    });

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
            pinata_api_key: pinataKey,
            pinata_secret_api_key: pinataSecret,
            // DO NOT set Content-Type; let fetch set multipart boundary
        },
        body: form,
    });
    if (!res.ok) throw new Error('Pinata pinFile failed: ' + (await res.text()));
    return res.json(); // { IpfsHash, PinSize, Timestamp }
}
