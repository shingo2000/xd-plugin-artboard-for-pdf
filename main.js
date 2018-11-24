/*
 * Artboard for PDF for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */

const new_artboard = require("./new_artboard");
const compress_image = require("./compress_image");

module.exports = {
    commands: {
        newArtboardCommand: new_artboard,
        compressImageCommand: compress_image
    }
};
