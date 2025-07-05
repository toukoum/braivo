# 🧠 ImageVault

**ImageVault** is a decentralised file storage app that lets anyone upload, store and prove ownership of files on-chain using [0G Labs Storage](https://0g.ai/).

With ImageVault, your files are:
- ✅ Uploaded to 0G’s distributed network
- 🔐 Anchored on-chain with a verifiable Merkle root hash
- 🌍 Accessible via IPFS from anywhere
- 📜 Backed by a transparent transaction for public proof

---

## ✨ Why it matters

In a world of fake content, shady platforms and censorship, creators and developers need:
- **true ownership**
- **open access**
- **provable integrity**

**ImageVault** gives you all that — in a few clicks, no crypto wallet required.

---

## 🚀 How it works

1. **Select a file**
2. **Upload it** directly to the 0G network (via IPFS)
3. We:
   - Generate a **Merkle Tree** of your file
   - Calculate the **root hash**
   - Send it to the 0G network with a **signed transaction**
4. You receive:
   - A public **IPFS URL**
   - The **Merkle root hash**
   - The **transaction hash** for proof

---

## 🔧 Tech Stack

| Layer        | Stack                                |
|--------------|--------------------------------------|
| Frontend     | Next.js 15 (App Router) + Tailwind CSS |
| Storage      | 0G Labs TypeScript SDK (`@0glabs/0g-ts-sdk`) |
| Blockchain   | 0G Chain (EVM-compatible)            |
| Backend (optional) | Next.js API Route (Node) + Ethers.js |
| Hosting      | Vercel / Railway / etc.             |

---

## 🧪 Example Output

```json
{
  "rootHash": "0x1234abc...",
  "transactionHash": "0x4567def...",
  "ipfsUrl": "https://storage.0g.ai/ipfs/QmSomeHash..."
}
