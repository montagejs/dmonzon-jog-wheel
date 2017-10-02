var Component = require("montage/ui/component").Component,
    Promise = require('montage/core/promise');

exports.Main = Component.specialize(/** @lends Main# */{

    constructor: {
        value: function() {
            this.blinkButtonLabel = this.startBlinkingLabel;
            return this;
        }
    },

    message: {
        value: null
    },

    blinkingOn: {
        value: false
    },

    blinks: {
        value: false
    },

    _blinkRate: {
        value: 6
    },
    blinkRate: {
        get: function(){
            return this._blinkRate;
        },
        set: function(value) {
            if(this._blinkRate !== value) {
                this._blinkRate = value;
                this._toggleBlinkInterval();
            }
        }
    },
    startBlinkingLabel: {
        value: "Start Blinking Indicator"
    },
    stopBlinkingLabel: {
        value: "Stop Blinking Indicator"
    },

    blinkButtonLabel: {
        value: null
    },

    _blinkIntervalId: {
        value: null
    },

    _blinkIntervalFunction: {
        value: function() {
            this.blinkingOn = true;
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

    handleBlinkButtonAction: {
        value: function (event) {
            this.blinksIndicator = !this.blinksIndicator;
            // this.blinks = !this.blinks;
            this.blinkButtonLabel = this.blinksIndicator 
                ? this.stopBlinkingLabel
                : this.startBlinkingLabel;
            // this._toggleBlinkInterval();
        }
    }

    
});
