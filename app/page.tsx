'use client'

import { Indexer, ZgFile } from '@0glabs/0g-ts-sdk'
import { ethers } from 'ethers'
import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [rootHash, setRootHash] = useState('')
  const [transactionHash, setTransactionHash] = useState('')
  const [status, setStatus] = useState('')
  const [ipfsUrl, setIpfsUrl] = useState('')

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus('Uploading...')

    try {
      // 1. Setup RPC & wallet (attention à la clé privée !)
      const RPC_URL = 'https://evmrpc-testnet.0g.ai/'
      const INDEXER_RPC = 'https://indexer-storage-testnet-turbo.0g.ai'
      const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY as string

      const provider = new ethers.JsonRpcProvider(RPC_URL)
      const signer = new ethers.Wallet(PRIVATE_KEY, provider)
      const indexer = new Indexer(INDEXER_RPC)

      // 2. Convert file into ZgFile
      const zgFile = await ZgFile.fromFilePath(file.name)

      // 3. Generate Merkle tree
      const [tree, treeErr] = await zgFile.merkleTree()
      if (treeErr) throw new Error('Merkle tree error: ' + treeErr)

      const root = tree?.rootHash() ?? ''
      setRootHash(root)

      // 4. Upload to 0G
      const [txHash, uploadErr] = await indexer.upload(zgFile, RPC_URL, signer)
      if (uploadErr) throw new Error('Upload error: ' + uploadErr)

      setTransactionHash(txHash)
      setIpfsUrl(`https://storage.0g.ai/ipfs/${zgFile.cid}`)
      setStatus('✅ Upload successful!')
      await zgFile.close()
    } catch (err: any) {
      console.error(err)
      setStatus('❌ Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧠 Upload to 0G Storage (No Backend)</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {uploading ? 'Uploading...' : 'Upload to 0G'}
      </button>

      <p className="mt-4 text-sm text-gray-600">{status}</p>

      {ipfsUrl && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">✅ Upload result</h2>
          <p><strong>IPFS:</strong> <a href={ipfsUrl} className="underline text-blue-600" target="_blank">{ipfsUrl}</a></p>
          <p className="break-words mt-2"><strong>Root hash:</strong> {rootHash}</p>
          <p className="break-all mt-2">
            <strong>Tx:</strong>{' '}
            <a href={`https://explorer.0g.ai/tx/${transactionHash}`} target="_blank" className="underline text-blue-600">
              {transactionHash}
            </a>
          </p>
          <img src={ipfsUrl} alt="Uploaded file" className="mt-4 max-w-xs rounded border" />
        </div>
      )}
    </main>
  )
}
