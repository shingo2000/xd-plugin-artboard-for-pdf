const ImageFill = require("scenegraph").ImageFill;
const Group = require("scenegraph").Group;
const Artboard = require("scenegraph").Artboard;
const application = require("application");
const fs = require("uxp").storage.localFileSystem;
let count = 0;

async function compressImageCommand(selection,documentRoot) {
  count += 1;
  console.log('compressImageCommand', selection,documentRoot);

  // 画像ノードの取得
  let imageNodes = getImageNodes(documentRoot.children);

  // 画像ファイルの書き出し

  for (let i = 0; i < imageNodes.length; i++){
    await createReditions(imageNodes[i]);
  }


  // 画像ファイルの読み込み
}



function getImageNodes(nodes){
  let imageNodes = [];
  nodes.forEach(function(child,i){
    if(child.fill instanceof ImageFill){
      imageNodes.push(child);
    }else if(child instanceof Group || child instanceof Artboard){
      imageNodes.push(...getImageNodes(child.children));
    }
  });
  return imageNodes;
}

async function createReditions(node){
  const folder = await fs.getTemporaryFolder();
  const file = await folder.createFile(node.guid + "_" + count + ".jpg");
  let renditionSettings = [{
    node: node,
    outputFile: file,
    type: application.RenditionType.JPG,
    quality: 80,
    scale: 1
  }];
  await application.createRenditions(renditionSettings)    // [1]
    .then(results => {                             // [2]
        console.log(`JPG rendition has been saved at ${results[0].outputFile.nativePath}`);
    })
    .catch(error => {                              // [3]
        console.log(error);
    });
}



module.exports = compressImageCommand;
