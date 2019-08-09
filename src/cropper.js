/**
 *  由于canvas只支持IE9及其以上版本浏览器，所以本控件涉及到的js语法也不考虑兼容IE9以下浏览器
 */





var EventUtil = {
    addHandler: function(element, type, handler) { // 添加事件处理器
        if (element.addEventListener) {
            element.addEventListener(type, handler, false); // 冒泡阶段处理
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) { // 移除事件处理器
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false); // 冒泡阶段处理
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },
    getEvent: function(event) { // 获取事件对象
        return event ? event : window.event;
    },
    getTarget: function(event) { // 获取事件目标
        return event.target || event.srcElement;
    },
    preventDefault: function(event) { // 阻止默认事件
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event) { // 取消事件冒泡
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};
// 辅助函数, 将驼峰命名的样式名称转换成中横线
function styleNameHelper(key) {
    var _key = key.trim(), i;
    var upperCaseWord = _key.match(/[A-Z]/g);
    if (upperCaseWord && upperCaseWord.length > 0) {
        for(i = 0; i < upperCaseWord.length; i++) {
            _key.replace(/upperCaseWord[i]/g, '-' + upperCaseWord[i].toLowerCase())
        }
    }
    return _key;
}
Dom.prototype.css = function(obj) {
    for(var key in obj) {
        this.ele.style[styleNameHelper(key)] = obj[key];
    }
    return this;
};
Dom.prototype.attr = function(attributeObj) {
    for(var key in attributeObj) {
        this.ele.setAttribute(key, attributeObj[key]);
    }
    return this;
};
Dom.prototype.appendChild = function (dom) {
    if (dom instanceof Dom) {
        this.ele.appendChild(dom.ele);
    } else {
        this.ele.appendChild(dom);
    }
    return this;
};
Dom.prototype.text = function (txt) {
    this.ele.innerText = txt;
    return this;
};

/**
 *  addClass(className1, className2, className3)
 *  @param classes
 */
Dom.prototype.addClass = function (classes) {
    var oldClass = this.ele.className.replace(/\s+/g, " ").split(" "), i, len = oldClass.length, j, lenJ = arguments.length,
        newArr = [];
    for (j = 0; j < lenJ; j++) {
        var isExist = false;
        for (i = 0; i < len; i++) {
            if (oldClass[i].toLowerCase() === arguments[j].trim().toLowerCase()) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            newArr.push(arguments[j].trim().toLowerCase());
        }
    }
    this.ele.className = oldClass.concat(newArr).join(" ");
};

/**
 * removeClass(className1, className2, className3)
 * @param classes
 */
Dom.prototype.removeClass = function (classes) {
    var oldClass = this.ele.className.replace(/\s+/g, " ").split(" "), i, len = oldClass.length, j, lenJ = arguments.length;
    for (j = 0; j < lenJ; j++) {
        for (i = 0; i < len; i++) {
            if (oldClass[i].toLowerCase() === arguments[j].trim().toLowerCase()) {
                oldClass[i] = "";
                break;
            }
        }
    }
    this.ele.className = oldClass.filter(function (item) {
        return item !== "";
    }).join(" ");
};
function Dom(tagName) {
    this.ele = document.createElement(tagName);
    this.getElement = function () {
        return this.ele;
    };
    this.create = function() {
        document.createElement(tagName);
        return this;
    };
    this.create();
    this.rippling = false;
}
function createDom() {
    var mask = new Dom('div'),
        contentBox = new Dom('div'),
        layerBox = new Dom('div'),
        selectBox = new Dom('div'),
        showImg = new Dom('img'),
        canvas = new Dom('canvas'),
        cutBtn = new Dom('div'),
        cancelBtn = new Dom('div'),
        btnMask = new Dom('div'),
        rippleCircle = new Dom('div');

    btnMask.addClass('x-btn-mask');
    rippleCircle.addClass('ripple-circle');

    cutBtn.text('裁剪');
    cutBtn.addClass('x-c-cutbtn', 'x-c-btn');


    cancelBtn.text('取消');
    cancelBtn.addClass('x-c-cbtn', 'x-c-btn');

    showImg.css({
        minWidth: this.options.layerWidth + 'px',
        maxWidth: this.options.layerWidth + 'px'
    });

    canvas
        .attr({
            width: this.options.targetWidth,
            height: this.options.targetHeight,
        });
    canvas.addClass('x-c-canvas');

    contentBox.css({
        width: this.options.layerWidth + this.options.targetWidth + 'px',
    });
    contentBox.addClass('x-c-cbox');

    selectBox.css({
        width: this.options.cropperWidth + 'px',
        height: this.options.cropperWidth + 'px',
    });
    selectBox.addClass('x-c-sbox');

    layerBox.css({
        width: this.options.layerWidth + 'px',
        height: this.options.layerHeight + 'px',
    });
    layerBox.addClass('x-c-layer');

    mask.addClass('r-cropper-mask');

    cutBtn.appendChild(rippleCircle);
    cutBtn.appendChild(btnMask);
    layerBox.appendChild(selectBox);
    layerBox.appendChild(cutBtn);
    layerBox.appendChild(cancelBtn);
    layerBox.appendChild(showImg);
    contentBox.appendChild(layerBox);
    contentBox.appendChild(canvas);
    mask.appendChild(contentBox);
    document.body.appendChild(mask.getElement());

    this.mask = mask;
    this.layerBox = layerBox.getElement();
    this.selectBox = selectBox.getElement();
    this.showImg = showImg.getElement();
    this.canvas = canvas.getElement();
    this.cutBtn = cutBtn.getElement();
    this.btnMask = btnMask.getElement();
    this.btnMaskDom = btnMask;
    this.rippleCircle = rippleCircle;
    this.ctx = canvas.getElement().getContext('2d');
}
function initEvent(_this) {
    var _selectBox = _this.selectBox;
    function handler(event) {
        var e = EventUtil.getEvent(event);
        var left = _this.originLeft + e.clientX-_this.originX, top = _this.originTop + e.clientY-_this.originY;
        if(left <= 0){
            left = 0;
        }
        if(left >= _this.options.layerWidth - _this.options.cropperWidth){
            left = _this.options.layerWidth - _this.options.cropperWidth;
        }
        if(top <= 0){
            top = 0;
        }
        _this.selectBox.style.left = left +'px';
        _this.selectBox.style.top = top +'px';
    }
    EventUtil.addHandler(_selectBox, 'mousedown', function (ev) {
        EventUtil.addHandler(_selectBox, 'mousemove', handler);
        var e = EventUtil.getEvent(ev);
        _this.originX = e.clientX;
        _this.originY = e.clientY;
        _this.originLeft = parseInt(getComputedStyle(_selectBox, null).left);
        _this.originTop = parseInt(getComputedStyle(_selectBox, null).top);
    });
    EventUtil.addHandler(window, 'mouseup', function () {
        EventUtil.removeHandler(_selectBox, 'mousemove', handler)
    });
    var fileInput = document.getElementById(_this.options.el);
    EventUtil.addHandler(fileInput, 'change', function () {
        var file=fileInput.files[0], reader=new FileReader();
        _this.mask.css({
            display: 'block'
        });
        EventUtil.addHandler(reader, 'load', function (e) {
            var src = e.target.result, img = new Image();
            _this.showImg.setAttribute('src', src);
            EventUtil.addHandler(_this.showImg, 'load', function() {
                _this.showWidth =  _this.showImg.offsetWidth;
                _this.showHeight =  _this.showImg.offsetHeight;
                img.src = src;
                EventUtil.addHandler(img, 'load', function () {
                    _this.scaleY = img.naturalHeight/_this.showHeight;
                    _this.scaleX = img.naturalWidth/_this.showWidth;
                });
            });
        });
        reader.readAsDataURL(file);
    });
    EventUtil.addHandler(_this.cutBtn, 'click', function () {
        var o = _this.options;
        var newX = parseInt(getComputedStyle(_this.selectBox, null).left),
            newY = parseInt(getComputedStyle(_this.selectBox, null).top);
        _this.ctx.clearRect(0,0, _this.options.targetWidth, _this.options.targetHeight);
        _this.ctx.drawImage(_this.showImg, newX * _this.scaleX, newY * _this.scaleY, o.cropperWidth * _this.scaleX, o.cropperWidth * _this.scaleY, 0, 0, o.targetWidth, o.targetHeight);
    });
    EventUtil.addHandler(_this.btnMask, 'click', rippleHandler);
    function rippleHandler(ev) {
        if (_this.btnMaskDom.rippling) {
            return;
        }
        _this.btnMaskDom.rippling = true;
        var e = EventUtil.getEvent(ev),
        rightMargin = Math.max(Math.abs(_this.options.layerWidth / 2 - e.offsetX), e.offsetX);
        _this.rippleCircle.css({
            left: e.offsetX + 'px',
            top: e.offsetY + 'px',
            width: rightMargin * 2 + 'px',
            height: rightMargin * 2 + 'px',
            opacity: 0.2,
            transition: 'transform 200ms cubic-bezier(.25, 0.46, .45, 0.94), opacity 280ms',
            transform: 'translate(-50%, -50%) scale(1, 1)'
        });
        setTimeout(function () {
            _this.rippleCircle.css({
                opacity: 0,
                transition: 'transform opacity 60ms'
            });
        }, 280);
        setTimeout(function () {
            _this.rippleCircle.css({
                transform: 'translate(-50%, -50%) scale(0, 0)',
                transition: ''
            });
            _this.btnMaskDom.rippling = false;
        },400)
    }
}
function initParams() {
    this.originX = 0;
    this.originY = 0;
    this.originLeft = 0;
    this.originTop = 0;
    this.showWidth = 0;
    this.showHeight = 0;
    this.scaleY = 0;
    this.scaleY = 0;
    // TO_DO 完成图片预览,裁剪
}
function Cropper(option) {
    this.options = {
        cropperWidth: option.cropperWidth || 150, // 裁剪框宽高(当前版本只支持正方形裁剪)
        layerWidth: option.layerWidth || 400,
        layerHeight: 600,
        targetWidth: option.targetWidth || 150,
        targetHeight: option.targetHeight || 150,
        el: option.el || 'crop-file-select'
    };
    this.initParams = initParams.call(this);
    this.createDom = createDom.call(this);

    this.initEvents = initEvent;
    this.initEvents(this);

}


/*
var can=document.getElementById('myCan'),
btn=document.getElementById('btn'),
ctx=can.getContext('2d'),
imgFile = document.getElementById('imgFile'),
demoImg = document.getElementById('demoImg'),
chooseBox = document.getElementById('chooseBox'),
cutBtn = document.getElementById('cut'),
scaleY = 1, scaleX = 1,
originX = 0, originY = 0, originLeft = 0, originTop = 0,
croperWidth = 150;

EventUtil.addHandler(imgFile, 'change', function () {
    var file=imgFile.files[0], reader=new FileReader(), showWidth = 0, showHeight = 0;
    EventUtil.addHandler(reader, 'load', function (e) {
        var src = e.target.result, img = new Image();
        demoImg.setAttribute('src', src);
        EventUtil.addHandler(demoImg, 'load', function() {
            showWidth =  demoImg.offsetWidth;
            showHeight =  demoImg.offsetHeight;
            img.src = src;
            EventUtil.addHandler(img, 'load', function () {
                scaleY = img.naturalHeight/showHeight;
                scaleX = img.naturalWidth/showWidth;
            });
        });
    });
    reader.readAsDataURL(file);
});

EventUtil.addHandler(window, 'mouseup', function () {
    EventUtil.removeHandler(chooseBox, 'mousemove', mouseMoveHandler)
});
EventUtil.addHandler(chooseBox, 'mousedown', function (ev) {
    EventUtil.addHandler(chooseBox, 'mousemove', mouseMoveHandler);
    var e = EventUtil.getEvent(ev);
    originX = e.clientX;
    originY = e.clientY;
    originLeft = parseInt(getComputedStyle(chooseBox, null).left);
    originTop = parseInt(getComputedStyle(chooseBox, null).top);

});

EventUtil.addHandler(cutBtn, 'click', function () {
    var newX = parseInt(getComputedStyle(chooseBox, null).left),
    newY = parseInt(getComputedStyle(chooseBox, null).top);
    ctx.clearRect(0,0,600,600);
    ctx.drawImage(demoImg, newX*scaleX, newY*scaleY, croperWidth*scaleX, croperWidth*scaleY, 0, 0, 150, 150);
});
btn.onclick=function () {
    console.log(1111);
    var data=can.toDataURL();
    console.log(data);
    return;
    data=data.split(',')[1];
    data=window.atob(data);

    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    }
    var blob=new Blob([ia],{type:'image/png',endings:'transparent'});
    var fd=new FormData();
    console.log(blob);
    fd.append('avatarFile',blob,'image.png');
    var httprequest=new XMLHttpRequest();
    httprequest.open('POST','/guest/avatar',true);
    httprequest.send(fd);
    httprequest.onreadystatechange= function () {
        if(httprequest.status==200 && httprequest.readyState==4){
            console.log(httprequest.responseText);
            $('#returnImg').attr('src','/images/'+JSON.parse(httprequest.responseText).json);
        }
    };
};
*/
