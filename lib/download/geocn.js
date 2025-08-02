const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const downloadGeoCN = async () => {
  try {
    const url =
      'https://github.com/ljxi/GeoCN/releases/download/Latest/GeoCN.mmdb';
    const filePath = path.resolve(__dirname, '../../db', 'GeoCN.mmdb');
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('GeoCN.mmdb downloaded successfully');
    });

    writer.on('error', err => {
      console.error('Error downloading GeoCN.mmdb:', err);
    });
  } catch (err) {
    console.error('Error fetching GeoCN.mmdb:', err);
  }
};

downloadGeoCN();
