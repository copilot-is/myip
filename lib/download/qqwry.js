const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const downloadQqwry = async () => {
  try {
    const url = 'https://unpkg.com/qqwry.ipdb/qqwry.ipdb';
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

downloadQqwry();
