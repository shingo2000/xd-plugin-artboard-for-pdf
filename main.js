/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */

let { Artboard, Color} = require("scenegraph");
let application = require("application");
var dialog;


const printingSize = {
  a4:{width:842, height:595, name:'A4'},
  a3:{width:1191, height:842, name:'A3'},
  b5:{width:729, height:516, name:'B5'},
  b4:{width:1032, height:729, name:'B4'}
};

var defaultFormat = 'a4';
var defaultOrientation = 'landscape';
var defaultPageCount = 1;

const kArtboardMargin = 70;
const kMaxPageCount = 100;

function createDialog(){
  let createButton, cancelButton, formatSelect, orientationSelect, pageCountInput;
  if(!dialog){
    dialog = document.createElement("dialog");
    var html = '<style>form {width: 360px;}.h1 {align-items: center;justify-content: space-between;display: flex;flex-direction: row;}.icon {border-radius: 4px;width: 24px;height: 24px;overflow: hidden;}</style>';

    if(application.appLanguage == 'ja'){
      html += '<form method="dialog"><h1 class="h1"><span>PDF用アートボードの作成</span><img class="icon" src="./assets/icon.png" /></h1><hr /><label><span>用紙のサイズ</span><select id="formatSelect"><option value="a4" selected>A4</option><option value="a3">A3</option><option value="b5">B5</option><option value="b4">B4</option></select></label><label><span>用紙の向き</span><select id="orientationSelect"><option value="landscape">横向き</option><option value="portraito">縦向き</option></select></label><label><span>ページ数 (1 - ' + kMaxPageCount + ')</span><input type="number" min="1" max="100" value="1" id="pageCount" /></label><footer><button uxp-variant="primary" id="cancelButton">キャンセル</button><button type="submit" uxp-variant="cta" id="createButton">作成</button></footer></form>';
    }else{
      html += '<form method="dialog"><h1 class="h1"><span>New Artboard for PDF</span><img class="icon" src="./assets/icon.png" /></h1><hr /><label><span>Size</span><select id="formatSelect"><option value="a4" selected>A4</option><option value="a3">A3</option><option value="b5">B5</option><option value="b4">B4</option></select></label><label><span>Orientation</span><select id="orientationSelect"><option value="landscape">Landscape</option><option value="portraito">Portrait</option></select></label><label><span>Page Count (1 - ' + kMaxPageCount + ')</span><input type="number" min="1" max="100" value="1" id="pageCount" /></label><footer><button uxp-variant="primary" id="cancelButton">Cancel</button><button type="submit" uxp-variant="cta" id="createButton">Create</button></footer></form>';
    }
    dialog.innerHTML = html;

    document.body.appendChild(dialog);

    }

    createButton  = document.getElementById("createButton");
    cancelButton = document.getElementById("cancelButton");
    formatSelect = document.getElementById("formatSelect");
    orientationSelect = document.getElementById("orientationSelect");
    pageCountInput = document.getElementById("pageCount");

    createButton.addEventListener('click', function(e){
      dialog.close({format:formatSelect.value, orientation:orientationSelect.value, pageCount:pageCountInput.value });

      defaultFormat = formatSelect.value;
      defaultOrientation = orientationSelect.value;
      e.preventDefault();
    });
    cancelButton.addEventListener('click', function(e){
      dialog.close(false);
      e.preventDefault();
    });

  formatSelect.value = defaultFormat;
  orientationSelect.value = defaultOrientation;
  pageCountInput.value = defaultPageCount;

  return dialog;

}


async function newArtboardCommand(selection,documentRoot) {

  var result = await createDialog().showModal();
  var column = 10;

  if(result){
    var size = printingSize[result.format];
    var isLandscape = (result.orientation == 'landscape');
    var pageCount = checkPageCount(result.pageCount);

    var firstPositon;
    var positionDx, positionDy;
    if(isLandscape){
      positionDx = size.width + kArtboardMargin;
      positionDy = size.height + kArtboardMargin;
    }else{
      positionDx = size.height + kArtboardMargin;
      positionDy = size.width + kArtboardMargin;
    }

    for(var i = 0; i < pageCount; i++){
      var name = generateArtboadName(size.name, documentRoot);
      var artboard = createArtboard(size, isLandscape, name);
      documentRoot.addChild(artboard);

      var position;
      if(i == 0){
        position = getNewArtboardPosition(documentRoot);
        firstPositon = position;
      }else{
        position = {
          x: firstPositon.x + positionDx * (i % column),
          y: firstPositon.y + positionDy * Math.floor(i / column)
        };
      }
      artboard.placeInParentCoordinates({x:0, y:0}, {x:position.x, y:position.y});
    }
  }
}


function createArtboard(size,isLandscape,name){
  const artboard = new Artboard();
  if(isLandscape){
    artboard.width = size.width;
    artboard.height = size.height;
  }else{
    artboard.width = size.height;
    artboard.height = size.width;
  }
  artboard.name = name;
  artboard.fill = new Color('#FFFFFF');
  return artboard;

}



function getNewArtboardPosition(documentRoot){
  var result = {x:0, y:0};

  documentRoot.children.forEach(function(child,i){
    if(i == 0){
      result.x = child.globalBounds.x;
      result.y = child.globalBounds.y + child.height + kArtboardMargin;
    }else{
      var __y = child.globalBounds.y + child.height + kArtboardMargin;
      if(result.y < __y){
        result.y = __y;
      }
    }

  });
  return result;
}



function generateArtboadName(originalName, documentRoot){
  var name = originalName;
  var num = 0;
  documentRoot.children.forEach(function(child,i){
    var ary = child.name.split(' - ');
    if(ary[0] == originalName){
      if(ary.length > 1){
        var _num = (ary[1]-0);
        if(_num >= num){
          num = _num + 1;
        }
      }else{
        num = 1;
      }
    }
  });
  if(num == 0){
    return name;
  }else{
    return name + ' - ' + num;
  }
}


function checkPageCount(pageCount){
  var result;
  if(isNaN(pageCount)){
    result = 1;
  }else if(pageCount < 1){
    result = 1;
  }else if(pageCount > kMaxPageCount){
    result = kMaxPageCount;
  }else{
    result = pageCount;
  }
  return result;
}


module.exports = {
    commands: {
        newArtboardCommand: newArtboardCommand
    }
};
