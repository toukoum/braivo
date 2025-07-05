"use client"

import { Button } from "@/components/ui/button"
import { useFileUpload } from "@/hooks/use-file-upload"
import Iridescence from "@/src/blocks/Backgrounds/Iridescence/Iridescence"
import { AlertCircleIcon, ImageIcon, UploadIcon } from "lucide-react"
import { useState } from "react"

const maxSizeMB = 5
const maxSize = maxSizeMB * 1024 * 1024
const maxFiles = 1 // Allow only 1 file for 0G upload

export default function HomePage() {
  const [rootHash, setRootHash] = useState("")
  const [transactionHash, setTransactionHash] = useState("")
  const [ipfsUrl, setIpfsUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState("")

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
    multiple: false,
    maxFiles,
    initialFiles: [],
  })

  const handleUpload = async () => {
    if (files.length === 0) return
    const file = files[0].file

    setUploading(true)
    setStatus("Uploading...")
    setRootHash("")
    setTransactionHash("")
    setIpfsUrl("")

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: (() => {
          const fd = new FormData()
          fd.append("file", file)
          return fd
        })(),
      })

      const data = await res.json()
      setRootHash(data.rootHash)
      setTransactionHash(data.transactionHash)
      setIpfsUrl(`https://storage.0g.ai/ipfs/${data.cid}`)
      setStatus("✅ Upload successful!")
    } catch (err) {
      console.error(err)
      setStatus("❌ Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6 container h-screen flex flex-col justify-center">
      <div className="absolute inset-0 -z-2">
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
      </div>
      <h1 className="text-center text-3xl z-10 font-bold text-[#5600E8]">
        Braivo — Powered by 0G Storage
      </h1>




      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />

        {files.length > 0 ? (
          <div className="w-full flex flex-col items-center">
            <img
              src={files[0].preview}
              alt={files[0].file.name}
              className="max-h-64 rounded-lg object-contain border"
            />
            <Button
              onClick={() => removeFile(files[0].id)}
              size="sm"
              className="mt-2"
              variant="destructive"
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full border">
              <ImageIcon className="size-5 opacity-60" />
            </div>
            <p className="font-medium">Drop your image here</p>
            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)</p>
            <Button variant="outline" className="mt-3" onClick={openFileDialog}>
              <UploadIcon className="mr-2" /> Select an image
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="bg-[#5600E8] text-white hover:bg-[#4300b4]"
        >
          {uploading ? "Uploading..." : "Upload to 0G"}
        </Button>
      </div>

      {status && <p className="text-center text-sm text-muted-foreground">{status}</p>}

      {ipfsUrl && (
        <div className="rounded-md border bg-muted p-4 text-sm">
          <p><strong>📦 IPFS:</strong> <a href={ipfsUrl} className="underline text-blue-600" target="_blank">{ipfsUrl}</a></p>
          <p className="break-words mt-2"><strong>🔗 Root hash:</strong> {rootHash}</p>
          <p className="mt-2">
            <strong>🔍 Tx:</strong> <a href={`https://explorer.0g.ai/tx/${transactionHash}`} className="underline text-blue-600" target="_blank">{transactionHash}</a>
          </p>
          <img src={ipfsUrl} alt="Uploaded preview" className="mt-4 rounded border max-h-64" />
        </div>
      )}

      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
          <AlertCircleIcon className="size-4" />
          <span>{errors[0]}</span>
        </div>
      )}
    </main>
  )
}
