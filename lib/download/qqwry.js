const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadQQWry = async () => {
  try {
    const url = 'https://cdn.jsdelivr.net/npm/qqwry.ipdb/qqwry.ipdb';
    const filePath = path.resolve(__dirname, '../../db', 'qqwry.ipdb');
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('qqwry.ipdb downloaded successfully');
    });

    writer.on('error', err => {
      console.error('Error downloading qqwry.ipdb:', err);
    });
  } catch (err) {
    console.error('Error fetching qqwry.ipdb:', err);
  }
};

downloadQQWry();
