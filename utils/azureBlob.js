const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
require('dotenv').config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

// ✅ Initialize Azure Blob client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

// ✅ Resize + Compress then Upload
async function uploadToAzure(fileBuffer, originalName, mimeType) {
  const blobName = `${Date.now()}-${uuidv4()}-${originalName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // 🔧 Resize and compress image to max width 1080px (Instagram standard)
  let processedImage;

  try {
    const image = sharp(fileBuffer).rotate(); // auto-orient

    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      processedImage = await image
        .resize({ width: 1080, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
    } else if (mimeType === 'image/png') {
      processedImage = await image
        .resize({ width: 1080, withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toBuffer();
    } else {
      // Default: no compression
      processedImage = await image.toBuffer();
    }

    // ✅ Upload to Azure
    await blockBlobClient.uploadData(processedImage, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    return blockBlobClient.url;
  } catch (err) {
    console.error('Image processing failed:', err);
    throw new Error('Image compression failed');
  }
}

module.exports = uploadToAzure;

