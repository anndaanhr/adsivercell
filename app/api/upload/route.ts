import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { BLOB_STORAGE } from '@/lib/config';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the form data
    const formData = await request.formData();

    // Get the file from the form data
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get the folder path from the form data (default: 'uploads')
    const folder = (formData.get('folder') as string) || 'uploads';

    // Generate a unique filename
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // Upload the file to Vercel Blob
    const { url, downloadUrl } = await put(fileName, file, {
      access: 'public',
      token: BLOB_STORAGE.READ_WRITE_TOKEN,
    });

    // Return the URL of the uploaded file
    return NextResponse.json({ url, downloadUrl, success: true });
  } catch (error) {
    console.error('Error uploading file:', error);

    return NextResponse.json(
      { error: 'Failed to upload file', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Maximum file size: 4MB
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
