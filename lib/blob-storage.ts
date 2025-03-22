import { put, del, list, PutBlobResult } from '@vercel/blob';

// The token should be stored as an environment variable
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_Ul2z73ze8Tn6rM1L_7PEcXMOLGhryZ9cRBPgq9VRrEZ7fKD';

/**
 * Upload a file to Vercel Blob storage
 * @param file - The file to upload
 * @param folderPath - The folder path to store the file in (e.g., 'products', 'users')
 * @returns The URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  folderPath: string = 'uploads'
): Promise<string> {
  try {
    // Generate a unique filename
    const fileName = `${folderPath}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // Upload the file to Vercel Blob
    const { url } = await put(fileName, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    });

    return url;
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Upload a product image
 * @param image - The image file to upload
 * @param productId - The ID of the product to associate the image with
 * @returns The URL of the uploaded image
 */
export async function uploadProductImage(image: File, productId: string): Promise<string> {
  return uploadFile(image, `products/${productId}`);
}

/**
 * Delete a file from Vercel Blob storage
 * @param url - The URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url, {
      token: BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.error('Error deleting file from Vercel Blob:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * List all files in a folder
 * @param prefix - The folder path to list files from
 * @returns Array of file URLs
 */
export async function listFiles(prefix: string = ''): Promise<string[]> {
  try {
    const { blobs } = await list({
      prefix,
      token: BLOB_READ_WRITE_TOKEN,
    });

    return blobs.map(blob => blob.url);
  } catch (error) {
    console.error('Error listing files from Vercel Blob:', error);
    return [];
  }
}

/**
 * Upload a text file (e.g., for storing JSON data)
 * @param content - The content to upload
 * @param fileName - The name of the file
 * @returns The URL of the uploaded file
 */
export async function uploadTextFile(
  content: string,
  fileName: string
): Promise<string> {
  try {
    const { url } = await put(fileName, content, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    });

    return url;
  } catch (error) {
    console.error('Error uploading text file to Vercel Blob:', error);
    throw new Error('Failed to upload text file');
  }
}

/**
 * This function can be used to create an API route for file uploading
 * It handles the file upload and returns the URL
 */
export async function handleFileUpload(
  req: Request
): Promise<{ url: string }> {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      throw new Error('No file provided');
    }

    const url = await uploadFile(file, folder);
    return { url };
  } catch (error) {
    console.error('Error handling file upload:', error);
    throw error;
  }
}
