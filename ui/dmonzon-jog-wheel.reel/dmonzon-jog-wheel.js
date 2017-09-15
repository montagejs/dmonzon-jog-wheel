/**
 * @module ./den.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Den
 * @extends Component
 */
exports.DmonzonJogWheel = Component.specialize(/** @lends Den# */ {

    _icon: {
        value: null
    },

    _needsUpdateIcon: {
        value: false
    },

    icon: {
        get: function () {
            return this._icon;
        },
        set: function (value) {
            switch (value) {
            case "am":
                this._icon = "ui/den.reel/day.png";
                break;
            case "pm":
                this._icon = "ui/den.reel/night.png";
                break;
            default:
                this._icon = null;
                break;
            }
            this._needsUpdateIcon = true;
            this.needsDraw = true;
        }
    },

    _value: {
        value: 0
    },

    value: {
        get: function () {
            if (this._value > this.max) {
                return this.max;
            } else if (this._value < this.min) {
                return this.min;
            }
            
            return this._value;
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
                    this._value = value;
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

    temperatureDelta: {
        value: 0
    },

    _temperatureOffset: {
        value: 51
    },

    _previousTimestamp: {
        value: null
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
            this._isRotating = true;
            // if(shouldDraw) 
                this.needsDraw = true;
        }
    },

    handleRotateEnd: {
        value: function(event) {
            this.value = Math.floor(this.value) + 0.5;
            this._isRotating = false;
            this.needsDraw = true;
        }
    },

    // heatingRate and coolingRate are in farenheight degrees per second
    heatingRate: {
        value: 1
    },

    coolingRate: {
        value: 1
    },

    handlePress: {
        value: function () {
            console.log("press!");
        }
    },

    draw: {
        value: function (timestamp) {
            this._rotatingBlock.style[this._transform] = "rotate3d(0, 0, 1, " + this._rotation + "deg)";
        }
    }

});
