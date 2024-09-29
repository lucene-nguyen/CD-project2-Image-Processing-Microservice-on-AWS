import fs from "fs";
import Jimp from "jimp";
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const photoBuffer = await axios.get(inputURL, {
        responseType: 'arraybuffer',
      })
      const photo = await Jimp.read(Buffer.from(photoBuffer?.data, "binary"));
      const tmpDir = path.join(__dirname, 'tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
      }
      const outpath = path.join(tmpDir, 'filtered.' + Math.floor(Math.random() * 2000) + '.jpg');
      photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      console.log(error.message);
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

// check image url validity
export function isImageUrl(url) {
  // Regular expression to match common image file extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
  
  // Test the URL against the regular expression
  return imageExtensions.test(url);
}