$(function(){
    
    // 手写板对象
    var signaturePad;
    
// 初始化
window.Asc.plugin.init = function(sHtml){
    // 获取绘图元素
    var canvas = document.getElementById('signature-pad');

    // 调整大小
    function resizeCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    window.onresize = resizeCanvas;
    resizeCanvas();
    
    
    // 创建手写板对象
    signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)'  // 背景色
    });
    
    // 定位到手写板
    
}

// 按钮事件
window.Asc.plugin.button = function(id){
        if (id == 0){
            
            // 获取图片
            var data = signaturePad.toDataURL('image/png');
            
            
            var width = 600;
            var height = 300;
            var nEmuWidth = ((width / 96) * 914400 + 0.5) >> 0;
            var nEmuHeight = ((height / 96) * 914400 + 0.5) >> 0;
            // 组装执行命令
            var sScript = '';
            switch (window.Asc.plugin.info.editorType){
                case 'word': {
                    sScript += 'var oDocument = Api.GetDocument();';
                    sScript += '\nvar oParagraph, oRun, arrInsertResult = [], oImage;';
                    sScript += '\noParagraph = Api.CreateParagraph();';
                    sScript += '\narrInsertResult.push(oParagraph);';
                    sScript += '\n oImage = Api.CreateImage(\'' + data + '\', ' + nEmuWidth+ ', ' + nEmuHeight + ');';
                    sScript += '\noParagraph.AddDrawing(oImage);';
                    sScript += '\noDocument.InsertContent(arrInsertResult);';
                    break;
                }
                case 'cell':{
                    sScript += 'var oWorksheet = Api.GetActiveSheet();';
                    sScript += '\n oWorksheet.ReplaceCurrentImage(\'' + data + '\', ' +nEmuWidth + ', ' + nEmuHeight + ');';
                    break;
                }
                case 'slide':{
                    sScript += 'var oPresentation = Api.GetPresentation();';
                    sScript += '\n oPresentation.ReplaceCurrentImage(\'' + data + '\', ' + nEmuWidth + ', ' + nEmuHeight + ');'; 
                    break;
                }
           }
             
            
            
            // 执行命令，保存并关闭
            window.Asc.plugin.info.recalculate = true;
			window.Asc.plugin.executeCommand("close", sScript);
                
        }else if(id==1){
            // 关闭手写板
            this.executeCommand("close", "");
        }else if(id==2){
            // 撤销手写板
            var data = signaturePad.toData();
            if (data) {
                data.pop(); // remove the last dot or line
                signaturePad.fromData(data);
            }
        }
        else if(id==3){
            // 清空手写板
             signaturePad.clear();
        }else{
            // 关闭手写板
            this.executeCommand("close", "");
        }
    };

});