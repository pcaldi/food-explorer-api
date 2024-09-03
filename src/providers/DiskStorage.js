const path = require('path');
const uploadConfig = require('../configs/upload')
const fs = require('fs')


class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    )
    return file;
  }

  async removeFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath)
    } catch (error) {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
