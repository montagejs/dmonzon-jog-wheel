/**
 * @module ./den.reel
 * @requires montage/ui/component
 */
var Control = require("montage/ui/control").Control;

/**
 * @class Den
 * @extends Component
 */
exports.DmonzonJogWheel = Control.specialize(/** @lends Den# */ {

    value: {
        get: function () {
            if (this._value > this.max) {
                return this.max;
            } else if (this._value < this.min) {
                return this.min;
            }
            return this.super();
        },
        set: function (value) {
            if (! isNaN(value = parseFloat(value))) {
                var shouldDraw = true;
                
                if (value > this.max) {
                    value = this.max;
                    shouldDraw = false;
                } else if (value < this.min) {
                    value = this.min;
                    shouldDraw = false;
                }

                if (this._value !== value) {
                    this.super(value);
                    //if(shouldDraw) 
                        this.needsDraw = true;
                }
            }
        }
    },
    min: {
        value: 0
    },
    max: {
        value: 100
    },



    _progressValue: {
        value: undefined
    },

    progressValue: {
        get: function () {
            return this._progressValue;
        },
        set: function (value) {
            this._progressValue = value;
            this.needsDraw = true;
        }
    },

    // The following enterDocument and handleTouchstart are a workaround for measurement
    // that should be removed after Afonso fixes loading css styles on time

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.activationArea.addEventListener("touchstart", this, false);
                this.activationArea.addEventListener("mousedown", this, false);
                if("webkitTransform" in this.element.style) {
                    this._transform = "webkitTransform";
                } else if("MozTransform" in this.element.style) {
                    this._transform = "MozTransform";
                } else if("msTransform" in this.element.style) {
                    this._transform = "msTransform";
                } else {
                    this._transform = "transform";
                }
            }
        }
    },

    handleTouchstart: {
        value: function () {
            var boundingRect = this.element.getBoundingClientRect(),
                center = {
                    pageX: (boundingRect.left + boundingRect.right) * .5,
                    pageY: boundingRect.top * .55 + boundingRect.bottom * .45
                };
            this._rotateComposer.center = center;
            this.activationArea.removeEventListener("touchstart", this, false);
        }
    },

    handleMousedown: {
        value: function () {
            var boundingRect = this.element.getBoundingClientRect(),
                center = {
                    pageX: (boundingRect.left + boundingRect.right) * .5,
                    pageY: boundingRect.top * .55 + boundingRect.bottom * .45
                };
            this._rotateComposer.center = center;
            this.activationArea.removeEventListener("mousedown", this, false);
        }
    },

    // End of workaround

    willDraw: {
        value: function() {
            var boundingRect = this.element.getBoundingClientRect(),
                center = {
                    pageX: (boundingRect.left + boundingRect.right) * .5,
                    pageY: boundingRect.top * .55 + boundingRect.bottom * .45
                };

            this._rotateComposer.center = center;

            if(this._progressValue == undefined) 
                this._progressValue = this._value;

        }
    },

    _isRotating: {
        value: false
    },
    _startsRotating: {
        value: false
    },

    handleRotate: {
        value: function(event) {
            //this.value += event.deltaRotation / 6;
            this.value += event.deltaRotation / 2;
            if (this.value < this.min) {
                this.value = this.min;
            }
            if (this.value > this.max) {
                this.value = this.max;
            }
            this._rotation = event.rotation;
            if(!this._isRotating) {
                this._startsRotating = true;
            }
            else {
                this._startsRotating = false;                
            }
            this._isRotating = true;
        }
    },

    handleRotateEnd: {
        value: function(event) {
            this.value = Math.floor(this.value);
            this._isRotating = false;
        }
    },

    handlePress: {
        value: function () {
            console.log("press!");
        }
    },

    /**
     * Defines how long Jog-Wheel's indicator stays lit when blinking. 
     * Value is expected to be in ms
     *
     * @property {number} value
     * @default {number} 50
     */
    blinksIndicatorDuration: {
        value: 50
    },
    _blinksIndicatorOnceTimeOff: {
        value: 0
    },

    _blinksIndicatorOnce: {
        value: false
    },

    /**
     * Instructs Jog-Wheel to blink its indicator once when set toi true. 
     * Once indicator has blinked the property value reverts to false.
     *
     * @property {boolean} value
     * @default {boolean} false
     */
    blinksIndicatorOnce: {
        get: function() {
            return this._blinksIndicatorOnce;
        },
        set: function(value) {
            if(this._blinksIndicatorOnce !== value) {
                this._blinksIndicatorOnce = value;
                if(this._blinksIndicatorOnce) {
                    this._blinksIndicatorOnceTimeOff = Date.now()+this.blinksIndicatorDuration;
                }
                else {
                    this._blinksIndicatorOnceTimeOff = 0;
                }
                this.needsDraw = true;
            }
        }
    },

    draw: {
        value: function (timestamp) {
            this._rotatingBlock.style[this._transform] = "rotate3d(0, 0, 1, " + this._rotation + "deg)";
            if(this._startsRotating || this.blinksIndicator) {
                this._indicatorElement.classList.add("on");
                
                if(this.blinksIndicator) {
                    if(this._blinksIndicatorOnceTimeOff>Date.now()) {
                        this.needsDraw = true;
                    }
                    else {
                        this.blinksIndicator = false;
                    }
                }
    
            }
            else if(!this._isRotating && (!this.blinksIndicator && this._indicatorElement.classList.has("on"))) {
                this._indicatorElement.classList.remove("on");
            }             
        }
    }

});
