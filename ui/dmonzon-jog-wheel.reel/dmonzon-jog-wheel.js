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
    constructor: {
        value: function() {
            this._blinksIndicatorOnce = false;
            this._blinksIndicatorOnceTimeOff = 0;
            this._center = {};            
            return this;
        }
    },

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
    _fullRotationValue: {
        value: undefined
    },

    /**
     * Defines how much value is represented by a full rotation. 
     * Defaults to enter the valid range, max - min, on one rotation
     *
     * @property {number} value
     * @default {number} this.max - this.min
     */

    fullRotationValue: {
        get: function() {
            return this._fullRotationValue || (this._fullRotationValue = this.max - this.min);
        },
        set: function(value) {
            this._fullRotationValue = value;
        }
    },


    // The following enterDocument and handleTouchstart are a workaround for measurement
    // that should be removed after Afonso fixes loading css styles on time

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.activationArea.addEventListener("touchstart", this, false);
                this.activationArea.addEventListener("mousedown", this, false);
                if("transform" in this.element.style) {
                    this._transform = "transform";
                }
                else if("webkitTransform" in this.element.style) {
                    this._transform = "webkitTransform";
                } else if("MozTransform" in this.element.style) {
                    this._transform = "MozTransform";
                } else if("msTransform" in this.element.style) {
                    this._transform = "msTransform";
                }
            }
        }
    },
    _center: {
        value: null
    },

    _updateCenter: {
        value: function() {
            var boundingRect = this.element.getBoundingClientRect();
            // center = {
            //     pageX: (boundingRect.left + boundingRect.right) * .5,
            //     pageY: boundingRect.top * .55 + boundingRect.bottom * .45
            // };

            this._center.pageX = (boundingRect.left + boundingRect.right) * .5;
            this._center.pageY = boundingRect.top * .55 + boundingRect.bottom * .45;
             // this._rotateComposer.center = center;
        }
    },
    handleTouchstart: {
        value: function () {
            //this._updateCenter();
            this.activationArea.removeEventListener("touchstart", this, false);
        }
    },

    handleMousedown: {
        value: function () {
            //this._updateCenter();
            this.activationArea.removeEventListener("mousedown", this, false);
        }
    },

    // End of workaround

    willDraw: {
        value: function() {
            this._updateCenter();            
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
            this.value += event.deltaRotation / 360 * this.fullRotationValue;
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
            this.needsDraw = true;            
        }
    },

    handleRotateEnd: {
        value: function(event) {
            this.value = Math.floor(this.value);
            this._isRotating = false;
            //.value might trigger it but if value is the same it wouldn't
            this.needsDraw = true;
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
    indicatorBlinkDuration: {
        value: 50
    },
    
    /**
     * The time, in milliseconds (thousandths of a second), between Jog-Wheel's indicator blinks. 
     *
     * @property {number} value
     * @default {number} 50
     */
    _indicatorBlinkInterval: {
        value: 80
    },
    indicatorBlinkInterval: {
            
        get: function() {
            return this._indicatorBlinkInterval;
        },
        set: function(value) {
            if(this._indicatorBlinkInterval !== value) {
                this._indicatorBlinkInterval = value;
                //If blinking, interval needs to be reset
                if(this.blinksIndicator) {
                    this._stopBlinking();
                    this._startBlinking();
                }
            }
        }
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
                    this._blinksIndicatorOnceTimeOff = performance.now()+this.indicatorBlinkDuration;
                }
                else {
                    this._blinksIndicatorOnceTimeOff = 0;
                }
                this.needsDraw = true;
            }
        }
    },

    _blinkIntervalId: {
        value: null
    },

    _blinkIntervalFunction: {
        value: function() {
            this.blinksIndicatorOnce = true;
        }
    },

    _toggleBlinkInterval: {
        value: function() {
            if(this._blinkIntervalId) clearInterval(this._blinkIntervalId);
            if(this.blinks) {
                if(!this.hasOwnProperty("_blinkIntervalFunction")) {
                    this._blinkIntervalFunction = this._blinkIntervalFunction.bind(this);
                }
                this._blinkIntervalId = setInterval(this._blinkIntervalFunction,60000/this._blinkRate);
                //console.log("setInterval delay is ",60000/this._blinkRate);
            }

        }
    },

    _blinksIndicator: {
        value: null
    },

    _startBlinking: {
        value: function() {
            if(!this.hasOwnProperty("_blinkIntervalFunction")) {
                this._blinkIntervalFunction = this._blinkIntervalFunction.bind(this);
            }
            this._blinkIntervalId = setInterval(this._blinkIntervalFunction,60000/this.indicatorBlinkInterval);
            //console.log("setInterval delay is ",60000/this._blinkRate);
        }
    },
    _stopBlinking: {
        value: function() {
            clearInterval(this._blinkIntervalId);
            this._blinkIntervalId = 0;
        }
    },

   /**
     * Instructs Jog-Wheel to blink its indicator once when set toi true. 
     * Once indicator has blinked the property value reverts to false.
     *
     * @property {boolean} value
     * @default {boolean} false
     */
    blinksIndicator: {
        get: function() {
            return this._blinksIndicator;
        },
        set: function(value) {
            if(this._blinksIndicator !== value) {
                if(this._blinkIntervalId && this._blinksIndicator) {
                    this._stopBlinking();
                }
                this._blinksIndicator = value;

                if(this._blinksIndicator) {
                    this._startBlinking();
                }
    
            }
        }
    },

    draw: {
        value: function (timestamp) {
            if(this._isRotating) {
                var transform = "rotate3d(0, 0, 1, ";
                
                transform += this._rotation;
                transform += "deg)";
                this._rotatingBlock.style[this._transform] = transform;                
            }
            if(this._startsRotating || this._blinksIndicatorOnce) {
                this._indicatorElementOn.classList.add("active");
                if(this._blinksIndicatorOnce) {
                    //if(this._blinksIndicatorOnceTimeOff>timestamp) {
                        //console.log("timestamp: ",timestamp,", Date.now(): ",Date.now());
                    if(this._blinksIndicatorOnceTimeOff>performance.now()) {
                            this.needsDraw = true;
                    }
                    else {
                        this.blinksIndicatorOnce = false;
                    }
                }
    
            }
            else if(!this._isRotating && (!this.blinksIndicatorOnce && this._indicatorElementOn.classList.has("active"))) {
                this._indicatorElementOn.classList.remove("active");
            }             
        }
    }

});
