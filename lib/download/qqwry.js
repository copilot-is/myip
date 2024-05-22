const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadQqwry = async () => {
  try {
    const url =
      'https://github.com/metowolf/qqwry.dat/releases/latest/download/qqwry.dat';
    const filePath = path.resolve(__dirname, '../../db', 'qqwry.dat');
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('qqwry.dat downloaded successfully');
    });

    writer.on('error', err => {
      console.error('Error downloading qqwry.dat:', err);
    });
  } catch (err) {
    console.error('Error fetching qqwry.dat:', err);
  }
};

downloadQqwry();
