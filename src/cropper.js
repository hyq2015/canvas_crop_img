/**
 *  由于canvas只支持IE9及其以上版本浏览器，所以本控件涉及到的js语法也不考虑兼容IE9以下浏览器
 */


/**
 * @desc create dom for cropper
 */
function createDom() {
    var mask = $('div'),
        contentBox = $('div'),
        layerBox = $('div'),
        layerBoxInner = $('div'),
        selectBox = $('div'),
        showImg = $('img'),
        canvas = $('canvas'),
        cutBtn = new ButtonDom('div', this.options.okText),
        cancelBtn = new ButtonDom('div', this.options.cancelText),
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
        zoomCircleLeftCenter = new Dom('div').addClass('xc-zoomnode xc-circle xc-zm-lc').attr({'data-direction': 'lc'}),
        imgsOuterDom = $('div').addClass('outer-dom'),
        inputMask = $('div').css({
            width: this.options.imgFileDimension + 'px',
            height: this.options.imgFileDimension + 'px',
        }).addClass('xc-inputmask'),
        inputImg = $('i').addClass('xc-upload'),
        inputFile = new Dom('input').attr({
            type: 'file'
        }).addClass('xc-input');
    previewImg.addClass('xc-preview-img');
    previewMask.addClass('xc-preview-mask').appendChild(previewImg).hide();

    cutBtn.btn.addClass('xc-cutbtn', 'xc-btn');
    cancelBtn.btn.addClass('xc-cbtn', 'xc-btn');

    showImg.addClass('xc-showimg');

    canvas
        .attr({
            width: this.options.cropperWidth,
            height: this.options.cropperHeight
        }).addClass('xc-canvas');

    contentBox.css({
        width: this.options.layerWidth + this.options.cropperWidth + 'px',
    }).addClass('xc-cbox');

    // 需要给裁剪框添加缩放的节点
    selectBox.css({
        width: this.options.cropperWidth + 'px',
        height: this.options.cropperHeight + 'px',
    }).addClass('xc-sbox').appendChild(zoomCircleTopLeft, zoomCircleTopCenter, zoomCircleTopRight, zoomCircleRightCenter,
        zoomCircleRightBottom, zoomCircleBottomCenter, zoomCircleBottomLeft, zoomCircleLeftCenter,
        duplicateImg);
    layerBox.appendChild(layerBoxInner, cutBtn, cancelBtn).addClass('xc-layer');
    layerBoxInner.addClass('xc-layer-inner').appendChild(selectBox, showImg, layerMask);
    layerMask.addClass('xc-layermask');

    contentBox.appendChild(layerBox, canvas);
    mask.addClass('r-cropper-mask').appendChild(contentBox);
    document.body.appendChild(mask.getElement());
    document.body.appendChild(previewMask.getElement());


    inputMask.appendChild(inputImg, inputFile);
    imgsOuterDom.appendChild(inputMask);
    originInputBtn.appendChild(imgsOuterDom.getElement());

    this.mask = mask;
    this.layerBox = layerBox.getElement();
    this._layerBox = layerBox;
    this.layerBoxInner = layerBoxInner.getElement();
    this._layerBoxInner = layerBoxInner;
    this.contentBox = contentBox;
    this.selectBox = selectBox.getElement();
    this.showImg = showImg.getElement();
    this._showImg = showImg;
    this.canvas = canvas.getElement();
    this.okBtn = cutBtn.btnMask.getElement();
    this.cancelBtn = cancelBtn.btnMask.getElement();
    this.ctx = canvas.getElement().getContext('2d');
    this.inputMask = inputMask.getElement();
    this.inputFileButton = inputFile.getElement();
    this.previewMask = previewMask;
    this.previewImg = previewImg;
    this.imgsOuterDom = imgsOuterDom;
    this.originImg = new Image();
}

/**
 * @desc check is specific target
 * @param target
 * @param className
 * @returns {boolean}
 */
function isTarget(target, className) {
    return target.className.indexOf(className) > -1;
}

/**
 * @desc fileReader handler
 * @param e
 */
function readerHandler(e) {
    var src = e.target ? e.target.result : e;
    this.isCropping = true;
    this._showImg.attr({
        src: src.originUrl || src
    });
    this.currentImgUrl = src.originUrl || src;
    if (!this.isRevise) {
        this.originImg.src = src.originUrl || src;
    } else {
        this.canvas.width = this.reviseObj.width;
        this.canvas.height = this.reviseObj.height;
        this.contentBox.css({
            width: this.options.layerWidth + this.reviseObj.width + 'px'
        });
        this.ctx.drawImage(this.showImg, parseInt(this.reviseObj.left), parseInt(this.reviseObj.top), this.reviseObj.width, this.reviseObj.height, 0, 0, this.reviseObj.width, this.reviseObj.height);
    }
}

/**
 * @desc handle input=file change event
 * @param isRevise
 */
function inputChangeHandler(isRevise) {
    var file = this.inputFileButton.files[0], reader=new FileReader();
    if (!isRevise) {
        if (!file) {
            return;
        }
        reader.readAsDataURL(file);
        EventUtil.addHandler(reader, 'load', this.readerHandler.bind(this));
    } else {
        this.readerHandler.call(this, isRevise);
        this.selectBox.style.left = isRevise.left;
        this.selectBox.style.top = isRevise.top;
        this.selectBox.style.height = isRevise.height + 'px';
        this.selectBox.style.width = isRevise.width + 'px';
    }

    this.mask.css({
        display: 'block'
    });
}

/**
 * handle mouse movement
 * @param event
 */
function mousemoveHandler(event) {
    var cropperWidth = this.selectBox.offsetWidth, cropperHeight = this.selectBox.offsetHeight,
        e = EventUtil.getEvent(event);
    EventUtil.stopPropagation(e);
    EventUtil.preventDefault(e);
    if (this.moveEventType !== 'move' && this.moveEventType !== 'zoom') {
        return;
    }
    if (this.moveEventType === 'move') {
        var left = this.originLeft + e.clientX-this.originX, top = this.originTop + e.clientY-this.originY;
        if(left <= 0) {
            left = 0;
        }
        if(left >= this.originShowImgWidth - cropperWidth) {
            left = this.originShowImgWidth - cropperWidth;
        }
        if(top <= 0) {
            top = 0;
        }
        if (top >= this.originShowImgHeight - cropperHeight) {
            top = this.originShowImgHeight - cropperHeight;
        }
        this.selectBox.style.left = left +'px';
        this.selectBox.style.top = top +'px';

    } else if (this.moveEventType === 'zoom') {
        $('.xc-zoomnode').hide();
        var heightIncrement = e.clientY - this.originY,
            dx = e.clientX - this.originX, dy = dx * this.currentCropperHeight / this.currentCropperWidth;
        this.moveTarget.style.display = 'block';

        switch(this.zoomDirection) {
            case 'rc':
                if ((this.naturalImgWidth >= this.currentCropperWidth + dx + parseInt(getComputedStyle(this.selectBox, null).left)) &&
                    (this.minCropperWidth <= this.currentCropperWidth + dx)
                ) {
                    this.selectBox.style.width = this.currentCropperWidth + dx + 'px';
                }
                break;
            case 'lc':
                if ((this.originLeft + dx >= 0) && (this.minCropperWidth <= this.currentCropperWidth - dx)) {
                    this.selectBox.style.width = this.currentCropperWidth - dx + 'px';
                    this.selectBox.style.left = this.originLeft + dx + 'px';
                }
                break;
            case 'tc':
                if ((this.originTop + heightIncrement >= 0) && (this.minCropperHeight <= this.currentCropperHeight - heightIncrement)) {
                    this.selectBox.style.height = this.currentCropperHeight - heightIncrement + 'px';
                    this.selectBox.style.top = this.originTop + heightIncrement + 'px';
                }
                break;
            case 'bc':
                if (this.naturalImgHeight >= (this.currentCropperHeight + heightIncrement + parseInt(getComputedStyle(this.selectBox, null).top)) &&
                    (this.minCropperHeight <= this.currentCropperHeight + heightIncrement)) {
                    this.selectBox.style.height = this.currentCropperHeight + heightIncrement + 'px';
                }
                break;
            case 'rb':
                if ((this.currentCropperWidth + dx + this.originLeft > this.naturalImgWidth) ||
                    this.currentCropperHeight + dy + this.originTop > this.naturalImgHeight ||
                    this.currentCropperWidth + dx < this.minCropperWidth ||
                    this.currentCropperHeight + dy < this.minCropperHeight) {
                    return;
                }
                this.selectBox.style.width = this.currentCropperWidth + dx + 'px';
                this.selectBox.style.height = this.currentCropperHeight + dy + 'px';
                break;
            case 'tr':
                if ((this.currentCropperWidth + dx + this.originLeft > this.naturalImgWidth) ||
                    this.originTop - dy < 0 ||
                    this.currentCropperWidth + dx < this.minCropperWidth ||
                    this.currentCropperHeight + dy < this.minCropperHeight) {
                    return;
                }
                this.selectBox.style.width = this.currentCropperWidth + dx + 'px';
                this.selectBox.style.height = this.currentCropperHeight + dy + 'px';
                this.selectBox.style.top = this.originTop - dy + 'px';
                break;
            case 'tl':
                if ((this.originTop + dy < 0) ||
                    (this.originLeft + dx < 0) ||
                    this.currentCropperWidth - dx < this.minCropperWidth ||
                    this.currentCropperHeight - dy < this.minCropperHeight) {
                    return;
                }
                this.selectBox.style.width = this.currentCropperWidth - dx + 'px';
                this.selectBox.style.height = this.currentCropperHeight - dy + 'px';
                this.selectBox.style.top = this.originTop + dy + 'px';
                this.selectBox.style.left = this.originLeft + dx + 'px';
                break;
            case 'bl':
                if ((this.currentCropperHeight - dy + this.originTop > this.naturalImgHeight) ||
                    (this.originLeft + dx < 0) ||
                    this.currentCropperWidth - dx < this.minCropperWidth ||
                    this.currentCropperHeight - dy < this.minCropperHeight) {
                    return;
                }
                this.selectBox.style.width = this.currentCropperWidth - dx + 'px';
                this.selectBox.style.height = this.currentCropperHeight - dy + 'px';
                this.selectBox.style.left = this.originLeft + dx + 'px';
                break;
        }
    }

}

/**
 * @desc natural img load handler
 */
function naturalImgLoadHandler() {
    var o = this.options, newX = parseInt(getComputedStyle(this.selectBox, null).left),
        newY = parseInt(getComputedStyle(this.selectBox, null).top),
        xOverflow, yOverflow;

    this.naturalImgHeight = this.originImg.naturalHeight;
    this.naturalImgWidth = this.originImg.naturalWidth;
    this.ctx.clearRect(0,0, o.cropperWidth, o.cropperWidth);
    this.canvas.width = o.cropperWidth;
    this.canvas.height = o.cropperHeight;

    xOverflow = this.naturalImgWidth > this.maxLayerWidth;
    yOverflow = this.naturalImgHeight > this.maxLayerHeight;
    this._layerBox.css({
        width: (xOverflow ? this.maxLayerWidth : (this.naturalImgWidth < this.minLayerWidth ? this.minLayerWidth : this.naturalImgWidth)) + (yOverflow ? this.scrollBarDimension : 0) + 'px',
        height: (yOverflow ? this.maxLayerHeight : (this.naturalImgHeight < this.minLayerHeight ? this.minLayerHeight : this.naturalImgHeight)) + (xOverflow ? this.scrollBarDimension : 0) + 'px',
    });
    this._layerBoxInner.css({
        overflow: (xOverflow ? 'scroll' : 'hidden') + ' ' + (yOverflow ? 'scroll' : 'hidden')
    });
    this.ctx.drawImage(this.showImg, newX, newY, o.cropperWidth, o.cropperWidth, 0, 0, o.cropperWidth, o.cropperWidth);
}

/**
 * @desc mousedown handler
 * @param ev
 */
function mousedownHandler(ev) {
    var e = EventUtil.getEvent(ev), target = EventUtil.getTarget(ev),
        isZoom = isTarget(target, 'xc-zoomnode'),
        isBoxMove = isTarget(target, 'xc-sbox');
    if (!isZoom && !isBoxMove) {
        return;
    }
    EventUtil.stopPropagation(ev);
    EventUtil.preventDefault(ev);
    if (isZoom) {
        // 裁剪框缩放
        this.moveEventType = 'zoom';
        this.moveTarget = EventUtil.getTarget(ev);
        this.currentCropperWidth = this.selectBox.offsetWidth;
        this.currentCropperHeight = this.selectBox.offsetHeight;
        this.zoomDirection = target.getAttribute('data-direction')
    } else if (isBoxMove) {
        // 裁剪框移动
        this.moveEventType = 'move';
    }
    this.originX = e.clientX;
    this.originY = e.clientY;
    this.originLeft = parseInt(getComputedStyle(this.selectBox, null).left);
    this.originTop = parseInt(getComputedStyle(this.selectBox, null).top);
    this.originShowImgWidth = this.showImg.offsetWidth;
    this.originShowImgHeight = this.showImg.offsetHeight;
}

/**
 * @desc revise img handler
 * @param e
 */
function imgReviseHandler(e) {
    var target = EventUtil.getTarget(e);
    if (target.tagName.toUpperCase() === 'I') {
        var index = target.getAttribute('data-index');
        switch (target.getAttribute('data-type').toUpperCase()) {
            case 'REVISE':
                this.reviseObj = {
                    index: index,
                    originUrl: this.fileList[index].originUrl,
                    newUrl: this.fileList[index].newUrl,
                    left: this.fileList[index].left,
                    top: this.fileList[index].top,
                    width: this.fileList[index].width,
                    height: this.fileList[index].height,
                };
                this.naturalImgHeight = this.fileList[index].naturalImgHeight;
                this.naturalImgWidth = this.fileList[index].naturalImgWidth;
                this.isRevise = true;
                this.inputChangeHandler(this.reviseObj);
                break;
            case 'DELETE':
                this.fileList.splice(index, 1);
                document.getElementById('r-c-imglist').removeChild(document.getElementsByClassName('xc-simg')[index]);
                break;
            case 'PREVIEW':
                this.previewIndex = index;
                this.preview();
                break;
            default:
                break;
        }
    }
}

/**
 * @desc crop button click handler
 */
function okBtnHandler() {
    var fragment = document.createDocumentFragment(), parentNode = this.inputFileButton.parentNode.parentNode,
        imgListDom = document.getElementById('r-c-imglist'), imgOuter,
        canWidth = this.selectBox.offsetWidth, canHeight = this.selectBox.offsetHeight;
    // maxFileNumber
    if (this.options.maxFileNumber > 1) {
        // currentImgUrl
        if (this.isRevise) {
            this.fileList[this.reviseObj.index].newUrl = this.canvas.toDataURL('base64');
            this.fileList[this.reviseObj.index].width = canWidth;
            this.fileList[this.reviseObj.index].height = canHeight;
            this.fileList[this.reviseObj.index].left = this.selectBox.style.left;
            this.fileList[this.reviseObj.index].top = this.selectBox.style.top;
        } else {
            this.fileList.push({
                originUrl: this.currentImgUrl,
                newUrl: this.canvas.toDataURL('base64'),
                left: this.selectBox.style.left,
                top: this.selectBox.style.top,
                width: canWidth,
                height: canHeight,
                naturalImgHeight: this.naturalImgHeight,
                naturalImgWidth: this.naturalImgWidth,
            });
        }

    } else {
        this.fileList = [{
            originUrl: this.currentImgUrl,
            newUrl: this.canvas.toDataURL('base64'),
            left: this.selectBox.style.left,
            top: this.selectBox.style.top,
            width: canWidth,
            height: canHeight,
            naturalImgHeight: this.naturalImgHeight,
            naturalImgWidth: this.naturalImgWidth,
        }];
    }
    if (this.fileList.length > 0) {
        if (!this.isRevise) {
            var i = this.fileList.length - 1,
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
                width: this.options.imgFileDimension + 'px',
                height: this.options.imgFileDimension + 'px',
            }).addClass('xc-simg');
            showImgMask.addClass('xc-imgmask').appendChild(zoomImgIcon, reviseImgIcon, deleteImgIcon);
            img.css({
                width: '100%',
                height: '100%',
            }).attr({
                src: this.fileList[i].newUrl
            }).addClass('xc-realimg');
            showImg.appendChild(showImgMask, img);
            fragment.appendChild(showImg.getElement());
        } else {
            document.getElementsByClassName('xc-realimg')[this.reviseObj.index].src = this.fileList[this.reviseObj.index].newUrl;
        }
        if (imgListDom && !this.isRevise) {
            imgListDom.appendChild(fragment);
        }
        if (!imgListDom) {
            imgOuter = $('div')
                .addClass('r-c-imgs')
                .attr({
                    id: 'r-c-imglist'
                })
                .css({
                    height: this.options.imgFileDimension + 'px'
                }).appendChild(fragment);
            parentNode.insertBefore(imgOuter.getElement(), this.inputMask);

            // 处理图片修改、删除、查看事件
            EventUtil.addHandler(imgOuter.getElement(), 'click', this.imgReviseHandler.bind(this))
        }
    }
    this.resetState();
}

/**
 * @desc mouseup handler
 * @param e
 */
function mouseupHandler(e) {
    EventUtil.stopPropagation(e);
    EventUtil.preventDefault(e);
    // 有可能鼠标会移动到裁剪框外面，需要处理exception
    this.moveEventType = '';
    if (this.isCropping) {
        var newX = parseInt(getComputedStyle(this.selectBox, null).left),
            newY = parseInt(getComputedStyle(this.selectBox, null).top),
            selectBoxWidth = this.selectBox.offsetWidth,
            selectBoxHeight = this.selectBox.offsetHeight,
            canvasWidth = selectBoxWidth,
            canvasHeight = selectBoxHeight;
        this.canvas.setAttribute('width', canvasWidth.toString());
        this.canvas.setAttribute('height', canvasHeight.toString());
        this.ctx.clearRect(0,0, canvasWidth, canvasHeight);
        this.ctx.drawImage(this.showImg, newX, newY, selectBoxWidth, selectBoxHeight, 0, 0, canvasWidth, canvasHeight);
        $('.xc-zoomnode').show();
        this.moveTarget = null;
        this.contentBox.css({
            width: this.options.layerWidth + this.selectBox.offsetWidth + 'px'
        });
    }
}

/**
 * @desc file upload button click handler
 * @param e
 */
function fileuploadClickHandler(e) {
    if (this.fileList.length >= this.options.maxFileNumber) {
        if (document.getElementById('xc-error')) {
            $('#xc-error').show();
        } else {
            var errorRemind = $('div')
                .attr({
                    id: 'xc-error'
                })
                .addClass('xc-error')
                .text(this.options.fileNumberExceed);
            this.imgsOuterDom.appendChild(errorRemind);
        }
        EventUtil.preventDefault(e);
    }
}

/**
 * @desc click empty area to hide preview
 * @param e
 */
function hideMaskHandler(e) {
    var target = EventUtil.getTarget(e);
    if (target.className.indexOf('xc-preview-mask') > -1) {
        this.previewMask.hide();
    }
}
/**
 * @desc init entity event listener
 */
function initEvent() {
    EventUtil.addHandler(this.showImg, 'load', function() {
        if (this.isRevise) {
            return;
        }
        EventUtil.addHandler(this.originImg, 'load', this.naturalImgLoadHandler.bind(this));
    }.bind(this));
    EventUtil.addHandler(window, 'mousemove', this.mousemoveHandler.bind(this));
    EventUtil.addHandler(window, 'mousedown', this.mousedownHandler.bind(this));
    EventUtil.addHandler(window, 'mouseup', this.mouseupHandler.bind(this));
    EventUtil.addHandler(this.inputFileButton, 'click', this.fileuploadClickHandler.bind(this));
    EventUtil.addHandler(this.inputFileButton, 'input', function () {
        this.inputChangeHandler();
    }.bind(this));
    EventUtil.addHandler(this.okBtn, 'click', this.okBtnHandler.bind(this));
    EventUtil.addHandler(this.cancelBtn, 'click', this.resetState.bind(this));
    EventUtil.addHandler(this.inputMask, 'click', function () {
        this.inputFileButton.click();
    }.bind(this));
    EventUtil.addHandler(this.previewMask.getElement(), 'click', this.hideMaskHandler.bind(this));
}


/**
 * @desc calculate window scrollbar width
 * @returns {number}
 */
function getScrollWidth() {
    var noScroll, scroll, dummyDiv = document.createElement('div');
    dummyDiv.style.cssText = 'position:absolute;top: -1000px;width:100px;height:100px;overflow:hidden;';
    document.body.appendChild(dummyDiv);
    noScroll = dummyDiv.clientWidth;
    dummyDiv.style.overflow = 'scroll';
    scroll = dummyDiv.clientWidth;
    document.body.removeChild(dummyDiv);
    return noScroll - scroll;
}

/**
 * @desc init entity params
 */
function initParams() {
    this.originX = 0;
    this.originY = 0;
    this.originLeft = 0;
    this.originTop = 0;
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
    this.maxLayerWidth = window.innerWidth - 80;
    this.maxLayerHeight = window.innerHeight - 80;
    this.minLayerWidth = 300;
    this.minLayerHeight = 300;
    this.scrollBarDimension = getScrollWidth();
}

/**
 * @desc preview img
 */
function preview() {
    this.previewMask.show();
    this.previewImg.attr({
        src: this.fileList[this.previewIndex].newUrl
    }).css({
        height: this.fileList[this.previewIndex].height + 'px',
        width: this.fileList[this.previewIndex].width + 'px'
    });
}

/**
 * @desc get cropper instance file data
 * @returns {{width: *, base64: string | *, height: *}[]}
 */
function getFiles() {
    return this.fileList.map(function (item) {
        return {height: item.height, width: item.width, base64: item.newUrl}
    });
}

/**
 * @desc reset cropper state
 */
function resetState() {
    this.isRevise = false;
    this.reviseObj = null;
    this.moveEventType = '';
    this.selectBox.style.left = '0';
    this.selectBox.style.top = '0';
    this.selectBox.style.width = this.options.cropperWidth + 'px';
    this.selectBox.style.height = this.options.cropperHeight + 'px';
    this.canvas.width = this.options.cropperWidth;
    this.canvas.height = this.options.cropperHeight;
    this.ctx.clearRect(0, 0, this.options.cropperWidth, this.options.cropperHeight);
    this.isCropping = false;
    this.inputFileButton.value = '';
    this.mask.css({
        display: 'none'
    });
}
/**
 * @desc initialize entity methods
 */
function initMethods() {
    this.preview = preview;
    this.getFiles = getFiles;
    this.resetState = resetState;
    this.okBtnHandler = okBtnHandler;
    this.readerHandler = readerHandler;
    this.mouseupHandler = mouseupHandler;
    this.hideMaskHandler = hideMaskHandler;
    this.mousemoveHandler = mousemoveHandler;
    this.mousedownHandler = mousedownHandler;
    this.imgReviseHandler = imgReviseHandler;
    this.inputChangeHandler = inputChangeHandler;
    this.naturalImgLoadHandler = naturalImgLoadHandler;
    this.fileuploadClickHandler = fileuploadClickHandler;
}


function validateProps() {
    if (!this.options.el || !document.getElementById(this.options.el)) {
        throw new TypeError('please pass a valid id as "el" in your option');
    }
}
/**
 * @desc a Cropper Constructor
 * @param option
 * @constructor
 */
function Cropper(option) {
    this.options = {
        okText: option.okText || '确定',
        cancelText: option.cancelText || '取消',
        el: option.el,
        layerWidth: option.layerWidth || 750,
        layerHeight: option.layerHeight || 800,
        maxFileNumber: option.maxFileNumber || 1,
        cropperWidth: option.cropperWidth || 150,
        cropperHeight: option.cropperHeight || 150,
        imgFileDimension: option.imgFileDimension || 80,
        fileNumberExceed: option.fileNumberExceed || '最多支持上传' + (option.maxFileNumber || 1) + '张图片！'
    };
    this.validateProps = validateProps;
    this.initParams = initParams;
    this.createDom = createDom;
    this.initEvents = initEvent;
    this.initMethods = initMethods;

    this.initParams();
    this.validateProps();
    this.createDom();
    this.initMethods();
    this.initEvents();
}
