'use client'

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
    setRootHash('')
    setTransactionHash('')
    setIpfsUrl('')

    console.log('Uploading file:', file.name)

   
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
