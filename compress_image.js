const ImageFill = require("scenegraph").ImageFill;
const Group = require("scenegraph").Group;
const Artboard = require("scenegraph").Artboard;

async function compressImageCommand(selection,documentRoot) {
  console.log('compressImageCommand', selection,documentRoot);

  // 画像ノードの取得
  let imageNodes = getImageNodes(documentRoot.children);

}



function getImageNodes(nodes){
  let imageNodes = [];
  nodes.forEach(function(child,i){
    if(child.fill instanceof ImageFill){
      imageNodes.push(child);
    }else if(child instanceof Group || child instanceof Artboard){
      console.log(getImageNodes(child.children));
    }
  });
  return imageNodes;

}


module.exports = compressImageCommand;
