const fs = require('fs-extra');
const path = require('path');
const tar = require('tar');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const licenseKey = process.env.MAXMIND_LICENSE_KEY;
if (!licenseKey) {
  console.error('Error: MaxMind License key is required.');
  process.exit(1);
}

const downloadGeoLite2 = async editionId => {
  if (!editionId) {
    console.error(
      'Error: Edition ID (GeoLite2-City or GeoLite2-ASN) is required.'
    );
    process.exit(1);
  }

  const url = `https://download.maxmind.com/app/geoip_download?edition_id=${editionId}&license_key=${licenseKey}&suffix=tar.gz`;
  const filePath = path.resolve(__dirname, '../../db', `${editionId}.tar.gz`);
  const extractPath = path.resolve(__dirname, '../../db');

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on('finish', async () => {
      console.log(`${editionId}.tar.gz downloaded successfully`);
      try {
        await tar.x({ file: filePath, cwd: extractPath });
        console.log(`${editionId} extracted successfully`);

        // Move the .mmdb file to the parent db directory
        const extractedDir = fs
          .readdirSync(extractPath)
          .find(dir => dir.startsWith(editionId + '_'));
        if (extractedDir) {
          const mmdbFile = path.join(
            extractPath,
            extractedDir,
            `${editionId}.mmdb`
          );
          const destination = path.join(extractPath, `${editionId}.mmdb`);
          await fs.move(mmdbFile, destination, { overwrite: true });
          console.log(`${editionId}.mmdb moved successfully`);

          // Delete the extracted directory and the .tar.gz file
          await fs.remove(path.join(extractPath, extractedDir));
          await fs.unlink(filePath);
          console.log(
            `${extractedDir} and ${editionId}.tar.gz deleted successfully`
          );
        } else {
          console.error(`Extracted directory for ${editionId} not found`);
        }
      } catch (err) {
        console.error(`Error processing ${editionId}: `, err);
      }
    });

    writer.on('error', err => {
      console.error(`Error downloading ${editionId}: `, err);
    });
  } catch (err) {
    console.error(`Error fetching ${editionId}: `, err);
  }
};

downloadGeoLite2('GeoLite2-ASN');
downloadGeoLite2('GeoLite2-City');
