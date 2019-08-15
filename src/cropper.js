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
// 只支持通过类名或者ID进行元素选择
function $(idOrClassOrTagName) {
    return new Dom(idOrClassOrTagName);
}
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
Dom.prototype.hide = function(display) {
    if (this.ele.length > 0) {
        for (var i = 0; i < this.ele.length; i++) {
            this.ele[i].style.display = 'none';
        }
    } else {
        this.ele.style.display = display || 'none';
    }
    return this;
};
Dom.prototype.show = function(display) {
    if (this.ele.length > 0) {
        for (var i = 0; i < this.ele.length; i++) {
            this.ele[i].style.display = display || 'block';
        }
    } else {
        this.ele.style.display = display || 'block';
    }
    return this;
};
Dom.prototype.css = function(obj) {
    if (this.ele.length > 0) {
        for (var i = 0; i < this.ele.length; i++) {
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
    if (this.ele.length > 0) {
        for (var i = 0; i < this.ele.length; i++) {
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
Dom.prototype.appendChild = function (dom) {
    if (this.ele.length > 0) {
        for (var i = 0; i < this.ele.length; i++) {
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
    return this;
};
Dom.prototype.text = function (txt) {
    if (this.ele.length > 0) {
        for (var i = 0; i < this.ele.length; i++) {
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
        fragment = document.createDocumentFragment();


    btnMask.addClass('x-btn-mask');
    rippleCircle.addClass('ripple-circle');
    var _this = this;
    btn.css({
        width: width + 'px'
    });
    btn.text(text);

    btn.appendChild(btnMask);
    btn.appendChild(rippleCircle);
    // fragment.appendChild(this.getElement());
    // return fragment;
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
        selectBox = $('div'),
        showImg = $('img'),
        canvas = $('canvas'),
        cutBtn = new ButtonDom('div', this.options.okText, this.options.btnWidth),
        cancelBtn = new ButtonDom('div', this.options.cancelText, this.options.btnWidth),
        originInputBtn = document.getElementById(this.options.el),
        previewMask = new Dom('div'),
        previewImg = new Dom('img'),
        layerMask = new Dom('div'),
        zoomCircleTopLeft = new Dom('div').addClass('xc-zoomnode xc-zm-tl').attr({'data-direction': 'tl'}),
        zoomCircleTopCenter = new Dom('div').addClass('xc-zoomnode xc-zm-tc').attr({'data-direction': 'tc'}),
        zoomCircleTopRight = new Dom('div').addClass('xc-zoomnode xc-zm-tr').attr({'data-direction': 'tr'}),
        zoomCircleRightCenter = new Dom('div').addClass('xc-zoomnode xc-zm-rc').attr({'data-direction': 'rc'}),
        zoomCircleRightBottom = new Dom('div').addClass('xc-zoomnode xc-zm-rb').attr({'data-direction': 'rb'}),
        zoomCircleBottomCenter = new Dom('div').addClass('xc-zoomnode xc-zm-bc').attr({'data-direction': 'bc'}),
        zoomCircleBottomLeft = new Dom('div').addClass('xc-zoomnode xc-zm-bl').attr({'data-direction': 'bl'}),
        zoomCircleLeftCenter = new Dom('div').addClass('xc-zoomnode xc-zm-lc').attr({'data-direction': 'lc'});

    previewImg.addClass('xc-preview-img').css({
        height: this.options.targetHeight * this.options.zoomScale + 'px',
        width: this.options.targetWidth * this.options.zoomScale + 'px'
    });
    previewMask.addClass('xc-preview-mask').appendChild(previewImg).hide();

    cutBtn.btn.addClass('xc-cutbtn', 'xc-btn');
    cancelBtn.btn.addClass('xc-cbtn', 'xc-btn');

    showImg.css({
        minWidth: this.options.layerWidth + 'px',
        maxWidth: this.options.layerWidth + 'px'
    }).addClass('xc-showimg');

    canvas
        .attr({
            width: this.options.targetWidth * this.options.zoomScale,
            height: this.options.targetHeight * this.options.zoomScale,
        }).addClass('xc-canvas');

    contentBox.css({
        width: this.options.layerWidth + this.options.targetWidth * this.options.zoomScale + 'px',
    }).addClass('xc-cbox');

    // 需要给裁剪框添加缩放的节点
    selectBox.css({
        width: this.options.cropperWidth + 'px',
        height: this.options.cropperWidth + 'px',
    }).addClass('xc-sbox').appendChild(zoomCircleTopLeft).appendChild(zoomCircleTopCenter)
        .appendChild(zoomCircleTopRight).appendChild(zoomCircleRightCenter).appendChild(zoomCircleRightBottom)
        .appendChild(zoomCircleBottomCenter).appendChild(zoomCircleBottomLeft).appendChild(zoomCircleLeftCenter);

    layerBox.css({
        width: this.options.layerWidth + 'px',
        height: this.options.layerHeight + 'px',
    }).addClass('xc-layer');
    layerMask.addClass('xc-layermask');
    mask.addClass('r-cropper-mask');

    layerBox.appendChild(selectBox);
    layerBox.appendChild(cutBtn);
    layerBox.appendChild(cancelBtn);
    layerBox.appendChild(showImg);
    layerBox.appendChild(layerMask);
    contentBox.appendChild(layerBox);
    contentBox.appendChild(canvas);
    mask.appendChild(contentBox);
    document.body.appendChild(mask.getElement());
    document.body.appendChild(previewMask.getElement());
    var newDom = $('div').addClass('outer-dom'),
        inputMask = $('div').css({
            width: this.options.targetWidth + 'px',
            height: this.options.targetHeight + 'px',
        }).addClass('xc-inputmask'),
        inputImg = $('i').addClass('xc-upload'),
        inputFile = new Dom('input').attr({
            type: 'file'
        }).addClass('xc-input');
    inputMask.appendChild(inputImg);
    inputMask.appendChild(inputFile);
    newDom.appendChild(inputMask);
    // originInputBtn.parentNode.replaceChild(newDom.getElement(), originInputBtn);
    originInputBtn.appendChild(newDom.getElement());

    this.mask = mask;
    this.layerBox = layerBox.getElement();
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
}
function initEvent(_this) {
    var _selectBox = _this.selectBox;
    function handler(event) {
        var cropperWidth = _this.selectBox.offsetWidth, cropperHeight = _this.selectBox.offsetHeight;
        var e = EventUtil.getEvent(event);
        EventUtil.stopPropagation(e);
        EventUtil.preventDefault(e);
        if (_this.moveEventType === 'move') {
            var left = _this.originLeft + e.clientX-_this.originX, top = _this.originTop + e.clientY-_this.originY;
            if(left <= 0) {
                left = 0;
            }
            if(left >= _this.options.layerWidth - cropperWidth) {
                left = _this.options.layerWidth - cropperWidth;
            }
            if(top <= 0) {
                top = 0;
            }
            if (top >= _this.showHeight - cropperHeight) {
                top = _this.showHeight - cropperHeight;
            }
            _this.selectBox.style.left = left +'px';
            _this.selectBox.style.top = top +'px';

        } else if (_this.moveEventType === 'zoom') {
            $('.xc-zoomnode').hide();
            var widthIncrement = e.clientX - _this.originX;
            var heightIncrement = e.clientY - _this.originY;
            var dx = e.clientX - _this.originX, dy = dx * _this.currentCropperHeight / _this.currentCropperWidth;
            _this.moveTarget.style.display = 'block';
            switch(_this.zoomDirection) {
                case 'rc':
                    if (_this.showWidth >= _this.currentCropperWidth + widthIncrement + parseInt(getComputedStyle(_this.selectBox, null).left)) {
                        _selectBox.style.width = _this.currentCropperWidth + widthIncrement + 'px';
                    }
                    break;
                case 'lc':
                    if (_this.originLeft + widthIncrement >= 0) {
                        _selectBox.style.width = _this.currentCropperWidth - widthIncrement + 'px';
                        _selectBox.style.left = _this.originLeft + widthIncrement + 'px';
                    }
                    break;
                case 'tc':
                    if (_this.originTop + heightIncrement >= 0) {
                        _selectBox.style.height = _this.currentCropperHeight - heightIncrement + 'px';
                        _selectBox.style.top = _this.originTop + heightIncrement + 'px';
                    }
                    break;
                case 'bc':
                    if (_this.showHeight >= (_this.currentCropperHeight + heightIncrement + parseInt(getComputedStyle(_this.selectBox, null).top))) {
                        _selectBox.style.height = _this.currentCropperHeight + heightIncrement + 'px';
                    }
                    break;
                case 'rb':
                    _selectBox.style.width = _this.currentCropperWidth + dx + 'px';
                    _selectBox.style.height = _this.currentCropperHeight + dy + 'px';
                    break;
                case 'tr':
                    _selectBox.style.width = _this.currentCropperWidth + dx + 'px';
                    _selectBox.style.height = _this.currentCropperHeight + dy + 'px';
                    _selectBox.style.top = _this.originTop - dy + 'px';
                    break;
                case 'tl':
                    _selectBox.style.width = _this.currentCropperWidth - dx + 'px';
                    _selectBox.style.height = _this.currentCropperHeight - dy + 'px';
                    _selectBox.style.top = _this.originTop + dy + 'px';
                    _selectBox.style.left = _this.originLeft + dx + 'px';
                    break;
                case 'bl':
                    _selectBox.style.width = _this.currentCropperWidth - dx + 'px';
                    _selectBox.style.height = _this.currentCropperHeight - dy + 'px';
                    _selectBox.style.left = _this.originLeft + dx + 'px';
                    break;
            }

        }

    }
    EventUtil.addHandler(_selectBox, 'mousedown', function (ev) {
        EventUtil.stopPropagation(ev);
        EventUtil.preventDefault(ev);
        EventUtil.addHandler(window, 'mousemove', handler);
        var e = EventUtil.getEvent(ev), target = EventUtil.getTarget(ev);
        if (target.className.indexOf('xc-zoomnode') > -1) {
            // 裁剪框缩放
            _this.moveEventType = 'zoom';
            _this.moveTarget = EventUtil.getTarget(ev);
            _this.currentCropperWidth = _this.selectBox.offsetWidth;
            _this.currentCropperHeight = _this.selectBox.offsetHeight;
            _this.zoomDirection = target.getAttribute('data-direction')
        } else {
            // 裁剪框移动

            _this.moveEventType = 'move';
        }
        _this.originX = e.clientX;
        _this.originY = e.clientY;
        _this.originLeft = parseInt(getComputedStyle(_selectBox, null).left);
        _this.originTop = parseInt(getComputedStyle(_selectBox, null).top);
    });
    EventUtil.addHandler(window, 'mouseup', function (e) {
        EventUtil.stopPropagation(e);
        EventUtil.preventDefault(e);
        // 有可能鼠标会移动到裁剪框外面，需要处理exception
        EventUtil.removeHandler(window, 'mousemove', handler);
        if (_this.isCropping) {
            var o = _this.options;
            var newX = parseInt(getComputedStyle(_this.selectBox, null).left),
                newY = parseInt(getComputedStyle(_this.selectBox, null).top),
                selectBoxWidth = _this.selectBox.offsetWidth,
                selectBoxHeight = _this.selectBox.offsetHeight,
                canvasWidth = selectBoxWidth * o.zoomScale,
                canvasHeight = selectBoxHeight * o.zoomScale;
            _this.canvas.setAttribute('width', canvasWidth.toString());
            _this.canvas.setAttribute('height', canvasHeight.toString());
            _this.ctx.clearRect(0,0, canvasWidth, canvasHeight);
            _this.ctx.drawImage(_this.showImg, newX * _this.scaleX, newY * _this.scaleY, selectBoxWidth * _this.scaleX, selectBoxHeight * _this.scaleY, 0, 0, canvasWidth, canvasHeight);
            $('.xc-zoomnode').show();
            _this.moveTarget = null;
        }
    });

    var fileInput = _this.inputFileButton;

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
            _this.selectBox.style.left = isRevise.left;
            _this.selectBox.style.top = isRevise.top;
        }

        _this.mask.css({
            display: 'block'
        });
    }

    function readerHandler(e) {
        var src = e.target ? e.target.result : e, img = new Image();
        _this.isCropping = true;
        _this.showImg.setAttribute('src', src.originUrl || src);
        _this.currentImgUrl = src.originUrl || src;
        EventUtil.addHandler(_this.showImg, 'load', function() {
            _this.showWidth =  _this.showImg.offsetWidth;
            _this.showHeight =  _this.showImg.offsetHeight;
            img.src = src.originUrl || src;
            EventUtil.addHandler(img, 'load', function () {
                _this.scaleY = img.naturalHeight/_this.showHeight;
                _this.scaleX = img.naturalWidth/_this.showWidth;

                var o = _this.options;
                var newX = parseInt(getComputedStyle(_this.selectBox, null).left),
                    newY = parseInt(getComputedStyle(_this.selectBox, null).top);
                _this.ctx.clearRect(0,0, _this.options.targetWidth, _this.options.targetHeight);
                _this.ctx.drawImage(_this.showImg, newX * _this.scaleX, newY * _this.scaleY, o.cropperWidth * _this.scaleX, o.cropperWidth * _this.scaleY, 0, 0, o.targetWidth * o.zoomScale, o.targetHeight * o.zoomScale);
            });
        });
    }

    // 裁剪图片
    EventUtil.addHandler(_this.okBtn, 'click', function () {
        var fragment = document.createDocumentFragment(), parentNode = _this.inputFileButton.parentNode.parentNode,
            imgListDom = document.getElementById('r-c-imglist'), imgOuter,
            canWidth = _this.selectBox.offsetWidth, canHeight = _this.selectBox.offsetHeight;
        fileInput.value = '';
        _this.mask.css({
            display: 'none'
        });
        // maxFileNumber
        if (_this.options.maxFileNumber > 1) {
            // currentImgUrl
            if (_this.isRevise) {
                _this.fileList[_this.reviseObj.index].newUrl = _this.canvas.toDataURL('base64');
                _this.fileList[_this.reviseObj.index].width = canWidth;
                _this.fileList[_this.reviseObj.index].height = canHeight;
            } else {
                _this.fileList.push({
                    originUrl: _this.currentImgUrl,
                    newUrl: _this.canvas.toDataURL('base64'),
                    left: _this.selectBox.style.left,
                    top: _this.selectBox.style.top,
                    width: canWidth,
                    height: canHeight
                });
            }

        } else {
            _this.fileList = [{
                originUrl: _this.currentImgUrl,
                newUrl: _this.canvas.toDataURL('base64'),
                left: _this.selectBox.style.left,
                top: _this.selectBox.style.top,
                width: canWidth,
                height: canHeight
            }];
        }

        // TO_DO 此处的逻辑需要再精简一下，减少一些不必要的DOM重复渲染， 没必要每次都重复把fileList的元素全部渲染

        if (_this.fileList.length > 0) {
            if (!_this.isRevise) {
                var i = _this.fileList.length - 1;
                var img = $('img'),
                    showImg = $('div'),
                    showImgMask = $('div'),
                    deleteImgIcon = $('i'),
                    zoomImgIcon = $('i'),
                    reviseImgIcon = $('i');
                deleteImgIcon.addClass('xc-delteicon xc-icon').attr({title: '删除', 'data-index': i, 'data-type': 'delete'});
                reviseImgIcon.addClass('xc-reviseicon xc-icon').attr({title: '修改', 'data-index': i, 'data-type': 'revise'});
                zoomImgIcon.addClass('xc-zoomicon xc-icon').attr({title: '查看', 'data-index': i, 'data-type': 'preview'});
                showImg.css({
                    width: _this.options.targetWidth + 'px',
                    height: _this.options.targetWidth + 'px',
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
                        height: _this.options.targetHeight + 'px'
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
                                    top: _this.fileList[index].top
                                };
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
        _this.isRevise = false;
        _this.reviseObj = null;
        _this.selectBox.style.left = '0';
        _this.selectBox.style.top = '0';
        _this.ctx.clearRect(0, 0, _this.options.targetWidth, _this.options.targetHeight);
        _this.isCropping = false;

    });
    EventUtil.addHandler(_this.cancelBtn, 'click', function () {
        fileInput.value = '';
        _this.isRevise = false;
        _this.reviseObj = null;
        _this.selectBox.style.left = '0';
        _this.selectBox.style.top = '0';
        _this.ctx.clearRect(0, 0, _this.options.targetWidth * _this.options.zoomScale, _this.options.targetHeight * _this.options.zoomScale);
        _this.mask.css({
            display: 'none'
        });
        _this.isCropping = false;
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
    this.moveEventType = 'move';
    this.zoomDirection = '';
    this.isCropping = false;
    this.moveTarget = null;
}
function initMethods() {
    this.getFiles = function() {
        return this.fileList;
    };
    this.preview = function () {
        this.previewMask.show();
        this.previewImg.attr({
            src: this.fileList[this.previewIndex].newUrl
        }).css({
            height: this.fileList[this.previewIndex].height + 'px',
            width: this.fileList[this.previewIndex].width + 'px'
        })
    }
}
function Cropper(option) {
    this.options = {
        cropperWidth: option.targetWidth || 150, // 裁剪框宽高(当前版本只支持正方形裁剪)
        layerWidth: option.layerWidth || 400,
        layerHeight: 600,
        targetWidth: option.targetWidth || 150,
        targetHeight: option.targetHeight || 150,
        btnWidth: option.btnWidth || 200,
        el: option.el || 'crop-file-select',
        okText: option.okText || '确定',
        cancelText: option.cancelText || '取消',
        maxFileNumber: option.maxFileNumber || 1,
        zoomScale: option.zoomScale || 3
    };
    this.initParams = initParams.call(this);
    this.createDom = createDom.call(this);
    this.initEvents = initEvent;
    this.initMethods = initMethods.call(this);
    this.initEvents(this);

}
