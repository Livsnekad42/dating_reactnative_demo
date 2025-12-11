export type Doc = {
    type: string
    ownerId: string
    name: string
    bio: string
    avatarCid: string | null
    createdAt: number
    signature?: Uint8Array
}