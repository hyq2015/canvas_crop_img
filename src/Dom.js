/**
 * @desc 只支持通过类名或者ID进行元素选择
 * @param idOrClassOrTagName
 * @returns {Dom}
 */
function $(idOrClassOrTagName) {
    return new Dom(idOrClassOrTagName);
}

/**
 * @desc 辅助函数, 将驼峰命名的样式名称转换成中横线
 * @param key
 * @returns {string}
 */
function styleNameHelper(key) {
    var _key = key.trim(), i, upperCaseWord = _key.match(/[A-Z]/g), len;
    if (upperCaseWord && upperCaseWord.length > 0) {
        for(i = 0, len = upperCaseWord.length; i < len; i++) {
            _key.replace(/upperCaseWord[i]/g, '-' + upperCaseWord[i].toLowerCase())
        }
    }
    return _key;
}

/**
 *
 * @param display
 * @returns {Dom}
 */
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

/**
 *
 * @param display
 * @returns {Dom}
 */
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

/**
 *
 * @param obj
 * @returns {Dom}
 */
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

/**
 *
 * @param attributeObj
 * @returns {Dom}
 */
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

/**
 *
 * @returns {Dom}
 */
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

/**
 *
 * @param txt
 * @returns {Dom}
 */
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

/**
 * @desc create html dom
 * @param tagName
 * @constructor
 */
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

/**
 * @desc ripple button click handler
 * @param ev
 */
function rippleHandler(ev) {
    var _this = this,
        e = EventUtil.getEvent(ev),
        rightMargin = Math.max(Math.abs(this.btn.getElement().offsetWidth - e.offsetX), e.offsetX),
        topMargin = Math.max(Math.abs(this.btn.getElement().offsetHeight - e.offsetY), e.offsetY),
        finalCircleRadius = Math.sqrt(Math.pow(rightMargin, 2) + Math.pow(topMargin, 2));
    if (this.rippling) {
        return;
    }
    this.rippling = true;
    this.rippleCircle.css({
        left: e.offsetX + 'px',
        top: e.offsetY + 'px',
        width: finalCircleRadius * 2 + 'px',
        height: finalCircleRadius * 2 + 'px',
        opacity: 0.3,
        transition: 'transform 200ms cubic-bezier(.25, 0.46, .45, 0.94), opacity 160ms cubic-bezier(.25, 0.46, .45, 0.94)',
        transform: 'translate(-50%, -50%) scale(1, 1)'
    });
    setTimeout(function () {
        _this.rippleCircle.css({
            opacity: 0,
            transition: 'transform opacity 100ms'
        });
    }, 200);
    setTimeout(function () {
        _this.rippleCircle.css({
            transform: 'translate(-50%, -50%) scale(0, 0)',
            transition: 'none'
        });
        _this.rippling = false;
    },300);
}

/**
 *
 * @param tagName
 * @param text
 * @param {Number?} width
 */
function createButtonDom(tagName, text, width) {
    var btnMask = $('div'),
        rippleCircle = $('div'),
        btn = $(tagName),
        fragment = document.createDocumentFragment();

    btnMask.addClass('x-btn-mask');
    rippleCircle.addClass('ripple-circle');
    if (width) {
        btn.css({
            width: width + 'px'
        })
    }
    btn.addClass('xc-base-btn')
    .text(text)
    .appendChild(btnMask, rippleCircle);
    fragment.appendChild(btn.getElement());

    this.rippling = false;
    this.ele = fragment;
    this.btn = btn;
    this.btnMask = btnMask;
    this.rippleCircle = rippleCircle;
}

/**
 * @desc initialize button click listener
 */
function initButtonEvents() {
    EventUtil.addHandler(this.btnMask.getElement(), 'click', rippleHandler.bind(this));
    if (this.options.onclick) {
        EventUtil.addHandler(this.btnMask.getElement(), 'click', this.options.onclick.bind(this));
    }
}

/**
 * @desc create ripple button
 * @param tagName
 * @param text
 * @param {Number?} width
 * @constructor
 */
function ButtonDom(options) {
    this.createButtonDom = createButtonDom;
    this.initEvents = initButtonEvents;
    this.options = options;
    this.createButtonDom(options.tagName, options.text, options.width);
    this.initEvents();
}
