import { put, del, list } from "@vercel/blob"

export async function uploadFile(file: File, folder = "uploads") {
  try {
    const filename = `${folder}/${Date.now()}-${file.name}`
    const { url } = await put(filename, file, { access: "public" })
    return { url, success: true }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { error: "Failed to upload file", success: false }
  }
}

export async function deleteFile(url: string) {
  try {
    await del(url)
    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { error: "Failed to delete file", success: false }
  }
}

export async function listFiles(prefix = "uploads") {
  try {
    const { blobs } = await list({ prefix })
    return { blobs, success: true }
  } catch (error) {
    console.error("Error listing files:", error)
    return { error: "Failed to list files", success: false }
  }
}

