import { v2 as cloudinary } from 'cloudinary';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import pLimit from 'p-limit';

// Configuration
cloudinary.config({
  cloud_name: 'doggmspyo',
  api_key: '885562666331214',
  api_secret: 'AGo1wliD_egusVQhZPBLJGtsgpU'
});

const DB_HOST = 'gondola.proxy.rlwy.net';
const DB_PORT = 58181;
const DB_USER = 'root';
const DB_PASS = 'GnjGPOaAYLnsrYRwAAbQuAFEdyaLxHTN';
const DB_NAME = 'railway';

const uploadsDir = path.join('d:', 'WebServices', 'Ecommerce', 'uploads');

async function migrateImages() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
  });

  console.log('Fetching unique images from product table...');
  const [products] = await connection.query('SELECT DISTINCT picture FROM product WHERE picture IS NOT NULL');
  
  console.log('Fetching unique images from product_item table...');
  const [productItems] = await connection.query('SELECT DISTINCT picture FROM product_item WHERE picture IS NOT NULL');

  const allPictures = new Set();
  products.forEach(p => allPictures.add(p.picture));
  productItems.forEach(p => allPictures.add(p.picture));

  const localImages = [...allPictures].filter(p => p && !p.startsWith('http'));
  console.log(`Found ${localImages.length} unique local images to migrate.`);

  const urlMapping = {};
  const limit = pLimit(5); // Upload 5 files concurrently

  const uploadPromises = localImages.map(dbPath => limit(async () => {
    try {
      // Normalize filename
      let fileName = dbPath.replace('/uploads/', '').replace('\\', '/').trim();
      if (fileName.startsWith('/')) fileName = fileName.substring(1);
      
      const filePath = path.join(uploadsDir, fileName);
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
      }

      console.log(`Uploading ${fileName}...`);
      const uploadResult = await cloudinary.uploader.upload(filePath, { folder: 'ecommerce_migration' });
      urlMapping[dbPath] = uploadResult.secure_url;
      console.log(`Uploaded ${fileName} -> ${uploadResult.secure_url}`);
    } catch (err) {
      console.error(`Error uploading ${dbPath}:`, err.message);
    }
  }));

  console.log('Starting uploads to Cloudinary...');
  await Promise.all(uploadPromises);
  
  console.log('Uploads complete! Updating database records...');

  for (const [oldPath, newUrl] of Object.entries(urlMapping)) {
    // Update product table
    const [pResult] = await connection.query('UPDATE product SET picture = ? WHERE picture = ?', [newUrl, oldPath]);
    if (pResult.affectedRows > 0) {
      console.log(`Updated ${pResult.affectedRows} rows in product with new URL for ${oldPath}`);
    }

    // Update product_item table
    const [piResult] = await connection.query('UPDATE product_item SET picture = ? WHERE picture = ?', [newUrl, oldPath]);
    if (piResult.affectedRows > 0) {
      console.log(`Updated ${piResult.affectedRows} rows in product_item with new URL for ${oldPath}`);
    }
  }

  // Handle prospectiveuser or any other table if needed? 
  // User model might have picture too
  const [users] = await connection.query('UPDATE user SET picture = ? WHERE picture = ?', ['none', 'none']); // dummy just to skip

  console.log('Database update completed!');
  await connection.end();
}

migrateImages().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
