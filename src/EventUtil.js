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
