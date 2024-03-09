import Jimp from "jimp";

export const helperUpload = async (path) => {
  return await Jimp.read(path)
    .then((image) => {
      return image.resize(250, 250).writeAsync(path);
    })
    .catch((err) => {
      console.error(err);
    });
};
