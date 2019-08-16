/**
 *  由于canvas只支持IE9及其以上版本浏览器，所以本控件涉及到的js语法也不考虑兼容IE9以下浏览器
 */


// TODO 存在大量事件重复监听，需要处理
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
// 只支持通过类名或者ID进行元素选择
function $(idOrClassOrTagName) {
    return new Dom(idOrClassOrTagName);
}
// 辅助函数, 将驼峰命名的样式名称转换成中横线
function styleNameHelper(key) {
    var _key = key.trim(), i, upperCaseWord = _key.match(/[A-Z]/g), len;
    if (upperCaseWord && upperCaseWord.length > 0) {
        for(i = 0, len = upperCaseWord.length; i < len; i++) {
            _key.replace(/upperCaseWord[i]/g, '-' + upperCaseWord[i].toLowerCase())
        }
    }
    return _key;
}
Dom.prototype.hide = function(display) {
    var i, len = this.ele.length;
    if (len > 0) {
        for (i = 0; i < len; i++) {
            this.ele[i].style.display = 'none';
        }
    } else {
        this.ele.style.display = display || 'none';
    }
    return this;
};
Dom.prototype.show = function(display) {
    var i, len = this.ele.length;
    if (len > 0) {
        for (i = 0; i < len; i++) {
            this.ele[i].style.display = display || 'block';
        }
    } else {
        this.ele.style.display = display || 'block';
    }
    return this;
};
Dom.prototype.css = function(obj) {
    var i, len = this.ele.length;
    if (len > 0) {
        for (i = 0; i < len; i++) {
            for(var key in obj) {
                this.ele[i].style[styleNameHelper(key)] = obj[key];
            }
        }
    } else {
        for(var key in obj) {
            this.ele.style[styleNameHelper(key)] = obj[key];
        }
    }
    return this;
};
Dom.prototype.attr = function(attributeObj) {
    var i, len = this.ele.length;
    if (len > 0) {
        for (i = 0; i < len; i++) {
            for(var key in attributeObj) {
                this.ele[i].setAttribute(key, attributeObj[key]);
            }
        }
    } else {
        for(var key in attributeObj) {
            this.ele.setAttribute(key, attributeObj[key]);
        }
    }
    return this;
};
Dom.prototype.appendChild = function () {

    var i, len = this.ele.length, argLen = arguments.length, j, dom;
    for (j = 0; j < argLen; j++) {
        dom = arguments[j];
        if (len > 0) {
            for (i = 0; i < len; i++) {
                if (dom instanceof Dom) {
                    this.ele[i].appendChild(dom.ele);
                } else {
                    this.ele[i].appendChild(dom);
                }
            }
        } else {
            if (dom instanceof Dom) {
                this.ele.appendChild(dom.ele);
            } else {
                this.ele.appendChild(dom);
            }
        }
    }
    return this;
};
Dom.prototype.text = function (txt) {
    var i, len = this.ele.length;
    if (len > 0) {
        for (i = 0; i < len; i++) {
            this.ele[i].innerText = txt;
        }
    } else {
        this.ele.innerText = txt;
    }
    return this;
};

/**
 *  addClass(className1, className2, className3)
 *  @param classes
 */
Dom.prototype.addClass = function (classes) {
    var oldClass = this.ele.className.replace(/\s+/g, " ").split(" "), i, len = oldClass.length, j, lenJ = arguments.length,
        newArr = [], isExist = false;
    for (j = 0; j < lenJ; j++) {
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
    this.ele.className = oldClass.concat(newArr).join(" ").trim();
    return this;
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
    return this;
};
function Dom(tagName) {
    this.create = function() {
        document.createElement(tagName);
        return this;
    };
    this.getElement = function () {
        return this.ele;
    };

    if (tagName.indexOf('.') === -1 && tagName.indexOf('#') === -1) {
        this.ele = document.createElement(tagName);
        this.create();
    } else {
        if (tagName.indexOf('#') > -1) {
            this.ele = document.getElementById(tagName.slice(1));
        } else if(tagName.indexOf('.') > -1) {
            this.ele = document.getElementsByClassName(tagName.slice(1));
        }
    }
}
// 按钮的波纹效果应该属于按钮自身,在按钮创建时就配置好
ButtonDom.prototype = Dom.prototype;
ButtonDom.prototype.constructor = ButtonDom;
function ButtonDom(tagName, text, width) {
    var btnMask = $('div'),
        rippleCircle = $('div'),
        btn = $(tagName),
        fragment = document.createDocumentFragment(),
        _this = this;

    btnMask.addClass('x-btn-mask');
    rippleCircle.addClass('ripple-circle');

    btn.css({
        width: width + 'px'
    })
    .text(text)
    .appendChild(btnMask, rippleCircle);

    fragment.appendChild(btn.getElement());

    this.rippling = false;
    this.ele = fragment;
    this.btn = btn;
    this.btnMask = btnMask;
    EventUtil.addHandler(btnMask.getElement(), 'click', rippleHandler);
    function rippleHandler(ev) {
        if (_this.rippling) {
            return;
        }
        _this.rippling = true;
        var e = EventUtil.getEvent(ev),
            rightMargin = Math.max(Math.abs(_this.btn.getElement().offsetWidth - e.offsetX), e.offsetX),
            topMargin = Math.max(Math.abs(_this.btn.getElement().offsetHeight - e.offsetY), e.offsetY),
            finalCircleRadius = Math.sqrt(Math.pow(rightMargin, 2) + Math.pow(topMargin, 2));
        rippleCircle.css({
            left: e.offsetX + 'px',
            top: e.offsetY + 'px',
            width: finalCircleRadius * 2 + 'px',
            height: finalCircleRadius * 2 + 'px',
            opacity: 0.3,
            transition: 'transform 200ms cubic-bezier(.25, 0.46, .45, 0.94), opacity 160ms cubic-bezier(.25, 0.46, .45, 0.94)',
            transform: 'translate(-50%, -50%) scale(1, 1)'
        });
        setTimeout(function () {
            rippleCircle.css({
                opacity: 0,
                transition: 'transform opacity 100ms'
            });
        }, 200);
        setTimeout(function () {
            rippleCircle.css({
                transform: 'translate(-50%, -50%) scale(0, 0)',
                transition: 'none'
            });
            _this.rippling = false;
        },300)
    }
}
function createDom() {
    var mask = $('div'),
        contentBox = $('div'),
        layerBox = $('div'),
        layerBoxInner = $('div'),
        selectBox = $('div'),
        showImg = $('img'),
        canvas = $('canvas'),
        cutBtn = new ButtonDom('div', this.options.okText, this.options.btnWidth),
        cancelBtn = new ButtonDom('div', this.options.cancelText, this.options.btnWidth),
        originInputBtn = document.getElementById(this.options.el),
        previewMask = new Dom('div'),
        previewImg = new Dom('img'),
        layerMask = new Dom('div'),
        duplicateImg = new Dom('img'),
        zoomCircleTopLeft = new Dom('div').addClass('xc-zoomnode xc-circle xc-zm-tl').attr({'data-direction': 'tl'}),
        zoomCircleTopCenter = new Dom('div').addClass('xc-zoomnode xc-circle xc-zm-tc').attr({'data-direction': 'tc'}),
        zoomCircleTopRight = new Dom('div').addClass('xc-zoomnode xc-circle xc-zm-tr').attr({'data-direction': 'tr'}),
        zoomCircleRightCenter = new Dom('div').addClass('xc-zoomnode xc-circle xc-zm-rc').attr({'data-direction': 'rc'}),
        zoomCircleRightBottom = new Dom('div').addClass('xc-zoomnode xc-circle xc-zm-rb').attr({'data-direction': 'rb'}),
        zoomCircleBottomCenter = new Dom('div').addClass('xc-zoomnode xc-circle xc-zm-bc').attr({'data-direction': 'bc'}),
        zoomCircleBottomLeft = new Dom('div').addClass('xc-zoomnode xc-circle xc-zm-bl').attr({'data-direction': 'bl'}),
        zoomCircleLeftCenter = new Dom('div').addClass('xc-zoomnode xc-circle xc-zm-lc').attr({'data-direction': 'lc'});
        // zoomLayer = new Dom('div').addClass('xc-layernode xc-circle xc-zm-rc').attr({'data-direction': 'layer-right'}).css({right: '-20px'});

    previewImg.addClass('xc-preview-img').css({
        height: this.options.cropperWidth + 'px',
        width: this.options.cropperWidth + 'px'
    });
    previewMask.addClass('xc-preview-mask').appendChild(previewImg).hide();

    cutBtn.btn.addClass('xc-cutbtn', 'xc-btn');
    cancelBtn.btn.addClass('xc-cbtn', 'xc-btn');

    showImg.css({
        Width: this.options.layerWidth + 'px'
    }).addClass('xc-showimg');

    canvas
        .attr({
            // width: this.options.cropperWidth,
            // height: this.options.cropperWidth
        }).addClass('xc-canvas');

    contentBox.css({
        width: this.options.layerWidth + this.options.cropperWidth + 'px',
    }).addClass('xc-cbox');

    // 需要给裁剪框添加缩放的节点
    selectBox.css({
        width: this.options.cropperWidth + 'px',
        height: this.options.cropperWidth + 'px',
    }).addClass('xc-sbox').appendChild(zoomCircleTopLeft, zoomCircleTopCenter, zoomCircleTopRight, zoomCircleRightCenter,
        zoomCircleRightBottom, zoomCircleBottomCenter, zoomCircleBottomLeft, zoomCircleLeftCenter,
        duplicateImg);
    layerBox.appendChild(layerBoxInner, cutBtn, cancelBtn).addClass('xc-layer').css({
        width: this.options.layerWidth + 'px',
        height: this.options.layerHeight + 'px',
    });
    layerBoxInner.addClass('xc-layer-inner').appendChild(selectBox, showImg, layerMask);
    layerMask.addClass('xc-layermask');

    contentBox.appendChild(layerBox, canvas);
    mask.addClass('r-cropper-mask').appendChild(contentBox);
    document.body.appendChild(mask.getElement());
    document.body.appendChild(previewMask.getElement());

    var newDom = $('div').addClass('outer-dom'),
        inputMask = $('div').css({
            width: this.options.imgFileDimension + 'px',
            height: this.options.imgFileDimension + 'px',
        }).addClass('xc-inputmask'),
        inputImg = $('i').addClass('xc-upload'),
        inputFile = new Dom('input').attr({
            type: 'file'
        }).addClass('xc-input');

    inputMask.appendChild(inputImg, inputFile);
    newDom.appendChild(inputMask);
    originInputBtn.appendChild(newDom.getElement());

    this.mask = mask;
    this.layerBox = layerBox.getElement();
    this.layerBoxInner = layerBoxInner.getElement();
    this.contentBox = contentBox;
    this.selectBox = selectBox.getElement();
    this.showImg = showImg.getElement();
    this.canvas = canvas.getElement();
    this.okBtn = cutBtn.btnMask.getElement();
    this.cancelBtn = cancelBtn.btnMask.getElement();
    this.ctx = canvas.getElement().getContext('2d');
    this.inputMask = inputMask.getElement();
    this.inputFileButton = inputFile.getElement();
    this.previewMask = previewMask;
    this.previewImg = previewImg;
    this.originImg = new Image();
}
function isTarget(target, className) {
    return target.className.indexOf(className) > -1;
}

function initEvent(_this) {
    var _selectBox = _this.selectBox, fileInput = _this.inputFileButton;

    function handler(event) {
        var cropperWidth = _selectBox.offsetWidth, cropperHeight = _selectBox.offsetHeight;
        var e = EventUtil.getEvent(event), target = EventUtil.getTarget(event);

        EventUtil.stopPropagation(e);
        EventUtil.preventDefault(e);
        if (_this.moveEventType !== 'move' && _this.moveEventType !== 'zoom' &&
            _this.moveEventType !== 'bg' && _this.moveEventType !== 'layer') {
            return;
        }
        if (_this.moveEventType === 'move') {
            var left = _this.originLeft + e.clientX-_this.originX, top = _this.originTop + e.clientY-_this.originY;
            if(left <= 0) {
                left = 0;
            }
            if(left >= _this.originShowImgWidth - cropperWidth) {
                left = _this.originShowImgWidth - cropperWidth;
            }
            if(top <= 0) {
                top = 0;
            }
            if (top >= _this.originShowImgHeight - cropperHeight) {
                top = _this.originShowImgHeight - cropperHeight;
            }
            _this.selectBox.style.left = left +'px';
            _this.selectBox.style.top = top +'px';

        } else if (_this.moveEventType === 'zoom') {
            $('.xc-zoomnode').hide();
            var heightIncrement = e.clientY - _this.originY,
            dx = e.clientX - _this.originX, dy = dx * _this.currentCropperHeight / _this.currentCropperWidth;
            _this.moveTarget.style.display = 'block';

            switch(_this.zoomDirection) {
                case 'rc':
                    if ((_this.showWidth >= _this.currentCropperWidth + dx + parseInt(getComputedStyle(_this.selectBox, null).left)) &&
                        (_this.minCropperWidth <= _this.currentCropperWidth + dx)
                    ) {
                        _selectBox.style.width = _this.currentCropperWidth + dx + 'px';
                    }
                    break;
                case 'lc':
                    if ((_this.originLeft + dx >= 0) && (_this.minCropperWidth <= _this.currentCropperWidth - dx)) {
                        _selectBox.style.width = _this.currentCropperWidth - dx + 'px';
                        _selectBox.style.left = _this.originLeft + dx + 'px';
                    }
                    break;
                case 'tc':
                    if ((_this.originTop + heightIncrement >= 0) && (_this.minCropperHeight <= _this.currentCropperHeight - heightIncrement)) {
                        _selectBox.style.height = _this.currentCropperHeight - heightIncrement + 'px';
                        _selectBox.style.top = _this.originTop + heightIncrement + 'px';
                    }
                    break;
                case 'bc':
                    if (_this.showHeight >= (_this.currentCropperHeight + heightIncrement + parseInt(getComputedStyle(_this.selectBox, null).top)) &&
                        (_this.minCropperHeight <= _this.currentCropperHeight + heightIncrement)) {
                        _selectBox.style.height = _this.currentCropperHeight + heightIncrement + 'px';
                    }
                    break;
                case 'rb':
                    if ((_this.currentCropperWidth + dx + _this.originLeft > _this.showWidth) ||
                        _this.currentCropperHeight + dy + _this.originTop > _this.showHeight ||
                        _this.currentCropperWidth + dx < _this.minCropperWidth ||
                        _this.currentCropperHeight + dy < _this.minCropperHeight) {
                        return;
                    }
                    _selectBox.style.width = _this.currentCropperWidth + dx + 'px';
                    _selectBox.style.height = _this.currentCropperHeight + dy + 'px';
                    break;
                case 'tr':
                    if ((_this.currentCropperWidth + dx + _this.originLeft > _this.showWidth) ||
                        _this.originTop - dy < 0 ||
                        _this.currentCropperWidth + dx < _this.minCropperWidth ||
                        _this.currentCropperHeight + dy < _this.minCropperHeight) {
                        return;
                    }
                    _selectBox.style.width = _this.currentCropperWidth + dx + 'px';
                    _selectBox.style.height = _this.currentCropperHeight + dy + 'px';
                    _selectBox.style.top = _this.originTop - dy + 'px';
                    break;
                case 'tl':
                    if ((_this.originTop + dy < 0) ||
                        (_this.originLeft + dx < 0) ||
                        _this.currentCropperWidth - dx < _this.minCropperWidth ||
                        _this.currentCropperHeight - dy < _this.minCropperHeight) {
                        return;
                    }
                    _selectBox.style.width = _this.currentCropperWidth - dx + 'px';
                    _selectBox.style.height = _this.currentCropperHeight - dy + 'px';
                    _selectBox.style.top = _this.originTop + dy + 'px';
                    _selectBox.style.left = _this.originLeft + dx + 'px';
                    break;
                case 'bl':
                    if ((_this.currentCropperHeight - dy + _this.originTop > _this.showHeight) ||
                        (_this.originLeft + dx < 0) ||
                        _this.currentCropperWidth - dx < _this.minCropperWidth ||
                        _this.currentCropperHeight - dy < _this.minCropperHeight) {
                        return;
                    }
                    _selectBox.style.width = _this.currentCropperWidth - dx + 'px';
                    _selectBox.style.height = _this.currentCropperHeight - dy + 'px';
                    _selectBox.style.left = _this.originLeft + dx + 'px';
                    break;
            }
        } else if (_this.moveEventType === 'bg') {
            return;
            if (_this.originBgTop + e.clientY - _this.originY <= 0) {
                _this.showImg.style.top = _this.originBgTop + e.clientY - _this.originY + 'px'
            } else {
                _this.showImg.style.top = '0';
            }
        } else if (_this.moveEventType === 'layer') {
            return;
            if (_this.originLayerWidth + e.clientX - _this.originX > _this.naturalImgWidth) {
                console.log('图片最宽为'+  _this.naturalImgWidth + 'px');
                return;
            }
            _this.layerBox.style.width = _this.originLayerWidth + e.clientX - _this.originX + 'px';
            _this.showImg.style.width = _this.originLayerWidth + e.clientX - _this.originX + 'px';
            _this.contentBox.css({
                width: _this.originLayerWidth + e.clientX - _this.originX + 'px'
            });
        }

    }
    function inputChangeHandler(isRevise) {
        var file=fileInput.files[0], reader=new FileReader();
        if (!isRevise) {
            if (!file) {
                return;
            }
            reader.readAsDataURL(file);
            EventUtil.addHandler(reader, 'load', readerHandler);
        } else {
            readerHandler(isRevise);
            console.log(isRevise);
            _selectBox.style.left = isRevise.left;
            _selectBox.style.top = isRevise.top;
            _selectBox.style.height = isRevise.height + 'px';
            _selectBox.style.width = isRevise.width + 'px';
        }

        _this.mask.css({
            display: 'block'
        });
    }
    function readerHandler(e) {
        var src = e.target ? e.target.result : e;
        _this.isCropping = true;
        _this.showImg.setAttribute('src', src.originUrl || src);
        _this.currentImgUrl = src.originUrl || src;
        if (!_this.isRevise) {
            _this.originImg.src = src.originUrl || src;
        } else {
            _this.showWidth = _this.reviseObj.showWidth;
            _this.showHeight = _this.reviseObj.showHeight;
            _this.canvas.width = _this.reviseObj.width;
            _this.canvas.height = _this.reviseObj.height;
            _this.contentBox.css({
                width: _this.options.layerWidth + _this.reviseObj.width + 'px'
            });
            _this.ctx.drawImage(_this.showImg, parseInt(_this.reviseObj.left) * _this.scaleX, parseInt(_this.reviseObj.top) * _this.scaleY, _this.reviseObj.width * _this.scaleX, _this.reviseObj.height * _this.scaleY, 0, 0, _this.reviseObj.width, _this.reviseObj.height);
        }
    }
    EventUtil.addHandler(_this.showImg, 'load', function() {
        console.log("show img load==============");
        if (_this.isRevise) {
            return;
        }
        _this.showWidth =  _this.showImg.offsetWidth;
        _this.showHeight =  _this.showImg.offsetHeight;
        EventUtil.addHandler(_this.originImg, 'load', function () {
            console.log("origin img load==============");
            _this.scaleY = _this.originImg.naturalHeight / _this.showHeight;
            _this.scaleX = _this.originImg.naturalWidth / _this.showWidth;
            _this.naturalImgHeight = _this.originImg.naturalHeight;
            _this.naturalImgWidth = _this.originImg.naturalWidth;
            console.log(_this.naturalImgWidth);
            if (_this.options.layerWidth > _this.naturalImgWidth) {
                _this.showImg.style.width = _this.naturalImgWidth + 'px';
            } else {
                _this.layerBox.style.width = _this.options.layerWidth + 'px';
                _this.showImg.style.width = _this.naturalImgWidth + 'px';
            }
            var o = _this.options, newX = parseInt(getComputedStyle(_this.selectBox, null).left),
                newY = parseInt(getComputedStyle(_this.selectBox, null).top);

            _this.ctx.clearRect(0,0, o.cropperWidth, o.cropperWidth);
            _this.canvas.width = o.cropperWidth;
            _this.canvas.height = o.cropperWidth;

            _this.ctx.drawImage(_this.showImg, newX * _this.scaleX, newY * _this.scaleY, o.cropperWidth * _this.scaleX, o.cropperWidth * _this.scaleY, 0, 0, o.cropperWidth, o.cropperWidth);
        });
    });

    EventUtil.addHandler(window, 'mousemove', handler);
    EventUtil.addHandler(window, 'mousedown', function (ev) {
        var e = EventUtil.getEvent(ev), target = EventUtil.getTarget(ev),
            isZoom = isTarget(target, 'xc-zoomnode'),
            isBoxMove = isTarget(target, 'xc-sbox'),
            isBgMove = isTarget(target, 'xc-layermask'),
            isLayerZoom = isTarget(target, 'xc-layernode');
        if (!isZoom && !isBoxMove && !isBgMove && !isLayerZoom) {
            return;
        }
        EventUtil.stopPropagation(ev);
        EventUtil.preventDefault(ev);
        if (isZoom) {
            // 裁剪框缩放
            _this.moveEventType = 'zoom';
            _this.moveTarget = EventUtil.getTarget(ev);
            _this.currentCropperWidth = _this.selectBox.offsetWidth;
            _this.currentCropperHeight = _this.selectBox.offsetHeight;
            _this.zoomDirection = target.getAttribute('data-direction')
        } else if (isBoxMove) {
            // 裁剪框移动
            _this.moveEventType = 'move';
        } else if (isBgMove) {
            console.log('bg==============================');
            _this.moveEventType = 'bg';
        } else if (isLayerZoom) {
            _this.moveEventType = 'layer';
            _this.originLayerWidth = _this.layerBox.offsetWidth;
        }
        _this.originX = e.clientX;
        _this.originY = e.clientY;
        _this.originLeft = parseInt(getComputedStyle(_selectBox, null).left);
        _this.originTop = parseInt(getComputedStyle(_selectBox, null).top);
        _this.originBgTop = parseInt(getComputedStyle(_this.showImg, null).top);
        _this.originShowImgWidth = _this.showImg.offsetWidth;
        _this.originShowImgHeight = _this.showImg.offsetHeight;
    });
    EventUtil.addHandler(window, 'mouseup', function (e) {
        EventUtil.stopPropagation(e);
        EventUtil.preventDefault(e);
        // 有可能鼠标会移动到裁剪框外面，需要处理exception
        _this.moveEventType = '';
        if (_this.isCropping) {
            var newX = parseInt(getComputedStyle(_selectBox, null).left),
                newY = parseInt(getComputedStyle(_selectBox, null).top),
                selectBoxWidth = _selectBox.offsetWidth,
                selectBoxHeight = _selectBox.offsetHeight,
                canvasWidth = selectBoxWidth,
                canvasHeight = selectBoxHeight;
            _this.canvas.setAttribute('width', canvasWidth.toString());
            _this.canvas.setAttribute('height', canvasHeight.toString());
            _this.ctx.clearRect(0,0, canvasWidth, canvasHeight);
            _this.ctx.drawImage(_this.showImg, newX * _this.scaleX, newY * _this.scaleY, selectBoxWidth * _this.scaleX, selectBoxHeight * _this.scaleY, 0, 0, canvasWidth, canvasHeight);
            $('.xc-zoomnode').show();
            _this.moveTarget = null;
            // _this.contentBox.css({
            //     width: _this.options.layerWidth + _selectBox.offsetWidth + 'px'
            // })
        }
    });
    EventUtil.addHandler(fileInput, 'click', function (e) {
        if (_this.options.maxFileNumber > 1) {
            if (_this.fileList.length >= _this.options.maxFileNumber) {
                var imgListDom = document.getElementById('r-c-imglist');
                if (document.getElementById('xc-error')) {
                    $('#xc-error').show();
                } else {
                    var errorRemind = $('div')
                        .attr({
                            id: 'xc-error'
                        })
                        .addClass('xc-error')
                        .text('最多只能上传' + _this.options.maxFileNumber + '张图片');
                    imgListDom.appendChild(errorRemind.getElement());
                }
                EventUtil.preventDefault(e);
            }
        }

    });
    EventUtil.addHandler(fileInput, 'input', function () {
        inputChangeHandler();
    });

    // 裁剪图片
    EventUtil.addHandler(_this.okBtn, 'click', function () {
        var fragment = document.createDocumentFragment(), parentNode = fileInput.parentNode.parentNode,
            imgListDom = document.getElementById('r-c-imglist'), imgOuter,
            canWidth = _selectBox.offsetWidth, canHeight = _selectBox.offsetHeight;
        // maxFileNumber
        if (_this.options.maxFileNumber > 1) {
            // currentImgUrl
            if (_this.isRevise) {
                _this.fileList[_this.reviseObj.index].newUrl = _this.canvas.toDataURL('base64');
                _this.fileList[_this.reviseObj.index].width = canWidth;
                _this.fileList[_this.reviseObj.index].height = canHeight;
                _this.fileList[_this.reviseObj.index].left = _this.selectBox.style.left;
                _this.fileList[_this.reviseObj.index].top = _this.selectBox.style.top;
            } else {
                _this.fileList.push({
                    originUrl: _this.currentImgUrl,
                    newUrl: _this.canvas.toDataURL('base64'),
                    left: _this.selectBox.style.left,
                    top: _this.selectBox.style.top,
                    width: canWidth,
                    height: canHeight,
                    naturalImgHeight: _this.naturalImgHeight,
                    naturalImgWidth: _this.naturalImgWidth,
                    scaleY: _this.scaleY,
                    scaleX: _this.scaleX,
                    showWidth: _this.showWidth,
                    showHeight: _this.showHeight
                });
            }

        } else {
            _this.fileList = [{
                originUrl: _this.currentImgUrl,
                newUrl: _this.canvas.toDataURL('base64'),
                left: _this.selectBox.style.left,
                top: _this.selectBox.style.top,
                width: canWidth,
                height: canHeight,
                naturalImgHeight: _this.naturalImgHeight,
                naturalImgWidth: _this.naturalImgWidth,
                scaleY: _this.scaleY,
                scaleX: _this.scaleX,
                showWidth: _this.showWidth,
                showHeight: _this.showHeight
            }];
        }


        if (_this.fileList.length > 0) {
            if (!_this.isRevise) {
                var i = _this.fileList.length - 1,
                    img = $('img'),
                    showImg = $('div'),
                    showImgMask = $('div'),
                    deleteImgIcon = $('i'),
                    zoomImgIcon = $('i'),
                    reviseImgIcon = $('i');

                deleteImgIcon.addClass('xc-delteicon xc-icon').attr({title: '删除', 'data-index': i, 'data-type': 'delete'});
                reviseImgIcon.addClass('xc-reviseicon xc-icon').attr({title: '修改', 'data-index': i, 'data-type': 'revise'});
                zoomImgIcon.addClass('xc-zoomicon xc-icon').attr({title: '查看', 'data-index': i, 'data-type': 'preview'});
                showImg.css({
                    width: _this.options.imgFileDimension + 'px',
                    height: _this.options.imgFileDimension + 'px',
                }).addClass('xc-simg');
                showImgMask.addClass('xc-imgmask').appendChild(zoomImgIcon).appendChild(reviseImgIcon).appendChild(deleteImgIcon);
                img.css({
                    width: '100%',
                    height: '100%',
                }).attr({
                    src: _this.fileList[i].newUrl
                });
                showImg.appendChild(showImgMask).appendChild(img);
                fragment.appendChild(showImg.getElement());
            } else {
                document.getElementsByClassName('xc-simg')[_this.reviseObj.index].src = _this.fileList[_this.reviseObj.index].newUrl;
            }

            if (imgListDom && !_this.isRevise) {
                imgListDom.appendChild(fragment);
            }
            if (!imgListDom) {
                imgOuter = $('div')
                    .addClass('r-c-imgs')
                    .attr({
                        id: 'r-c-imglist'
                    })
                    .css({
                        height: _this.options.imgFileDimension + 'px'
                    }).appendChild(fragment);
                parentNode.insertBefore(imgOuter.getElement(), _this.inputMask);

                // 处理图片修改、删除、查看事件
                EventUtil.addHandler(imgOuter.getElement(), 'click', function (e) {
                    var target = EventUtil.getTarget(e);
                    if (target.tagName.toUpperCase() === 'I') {
                        var index = target.getAttribute('data-index');
                        switch (target.getAttribute('data-type').toUpperCase()) {
                            case 'REVISE':
                                _this.reviseObj = {
                                    index: index,
                                    originUrl: _this.fileList[index].originUrl,
                                    newUrl: _this.fileList[index].newUrl,
                                    left: _this.fileList[index].left,
                                    top: _this.fileList[index].top,
                                    width: _this.fileList[index].width,
                                    height: _this.fileList[index].height,
                                    scaleY: _this.fileList[index].scaleY,
                                    scaleX: _this.fileList[index].scaleX,
                                    showWidth: _this.fileList[index].showWidth,
                                    showHeight: _this.fileList[index].showHeight
                                };
                                _this.naturalImgHeight = _this.fileList[index].naturalImgHeight;
                                _this.naturalImgWidth = _this.fileList[index].naturalImgWidth;
                                _this.isRevise = true;
                                inputChangeHandler(_this.reviseObj);
                                break;
                            case 'DELETE':
                                _this.fileList.splice(index, 1);
                                document.getElementById('r-c-imglist').removeChild(document.getElementsByClassName('xc-simg')[index]);
                                break;
                            case 'PREVIEW':
                                _this.previewIndex = index;
                                _this.preview();
                                break;
                            default:
                                break;
                        }
                    }
                })
            }
        }
        _this.resetState();

    });
    EventUtil.addHandler(_this.cancelBtn, 'click', function () {
        _this.resetState();
    });
    EventUtil.addHandler(_this.inputMask, 'click', function () {
        _this.inputFileButton.click();
    });
    EventUtil.addHandler(_this.previewMask.getElement(), 'click', function (e) {
        var target = EventUtil.getTarget(e);
        if (target.className.indexOf('xc-preview-mask') > -1) {
            _this.previewMask.hide();
        }
    });

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
    this.fileList = [];
    this.currentImgUrl = '';
    this.isRevise = false;
    this.reviseObj = null;
    this.previewIndex = 0;
    this.moveEventType = '';
    this.zoomDirection = '';
    this.isCropping = false;
    this.moveTarget = null;
    this.minCropperWidth = 10;
    this.minCropperHeight = 10;
}
function initMethods() {
    this.getFiles = function() {
        return this.fileList.map(function (item) {
           return {height: item.height, width: item.width, base64: item.newUrl}
        });
    };
    this.preview = function () {
        this.previewMask.show();
        this.previewImg.attr({
            src: this.fileList[this.previewIndex].newUrl
        }).css({
            height: this.fileList[this.previewIndex].height + 'px',
            width: this.fileList[this.previewIndex].width + 'px'
        })
    };
    this.resetState = function () {
        this.isRevise = false;
        this.reviseObj = null;
        this.moveEventType = '';
        this.selectBox.style.left = '0';
        this.selectBox.style.top = '0';
        this.selectBox.style.width = this.options.cropperWidth + 'px';
        this.selectBox.style.height = this.options.cropperWidth + 'px';
        this.canvas.width = this.options.cropperWidth;
        this.canvas.height = this.options.cropperWidth;
        this.ctx.clearRect(0, 0, this.options.cropperWidth, this.options.cropperWidth);
        this.isCropping = false;
        this.inputFileButton.value = '';
        this.mask.css({
            display: 'none'
        });
    }
}
function Cropper(option) {
    this.options = {
        cropperWidth: option.cropperWidth || 150, 
        layerWidth: option.layerWidth || 750,
        layerHeight: 800,
        btnWidth: option.layerWidth / 2 || 375,
        el: option.el || 'crop-file-select',
        okText: option.okText || '确定',
        cancelText: option.cancelText || '取消',
        maxFileNumber: option.maxFileNumber || 1,
        imgFileDimension: option.imgFileDimension || 80
    };
    this.initParams = initParams;
    this.createDom = createDom;
    this.initEvents = initEvent;
    this.initMethods = initMethods;

    this.initParams();
    this.createDom();
    this.initMethods();
    this.initEvents(this);

}
