const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Color = require('../../util/color');
const Clone = require('../../util/clone');
const log = require('../../util/log');
const formatMessage = require('format-message');
const RenderedTarget = require('../../sprites/rendered-target');
const StageLayering = require('../../engine/stage-layering');

class Scratch3LineChart {
    constructor (runtime) {
        this.runtime = runtime;

        /**
         * The ID of the renderer Drawable corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penDrawableId = -1;

        /**
         * The ID of the renderer Skin corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penSkinId = -1;

        //initiate canvas and center of coordinate system
        this._xCenter = -100;
        this._yCenter = -100;
        this._width = 220;
        this._height = 220;
        this._interval = 20;

        //initiate position array
        this._xPos = [];
        this._yPos = [];
        this._posEmpty = true;

        this._onTargetCreated = this._onTargetCreated.bind(this);
        // this._onTargetMoved = this._onTargetMoved.bind(this);

        runtime.on('targetWasCreated', this._onTargetCreated);
        runtime.on('RUNTIME_DISPOSED', this.clear.bind(this));
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.pen';
    }

    /**
     * The default pen state, to be used when a target has no existing pen state.
     * @type {PenState}
     */
    static get DEFAULT_PEN_STATE () {
        return {
            penDown: false,
            color: 66.66,
            saturation: 100,
            brightness: 100,
            transparency: 0,
            _shade: 50, // Used only for legacy `change shade by` blocks
            penAttributes: {
                color4f: [0, 0, 1, 1],
                diameter: 1
            }
        };
    }

    /**
     * When a pen-using Target is cloned, clone the pen state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated (newTarget, sourceTarget) {
        if (sourceTarget) {
            const penState = sourceTarget.getCustomState(Scratch3PenBlocks.STATE_KEY);
            if (penState) {
                newTarget.setCustomState(Scratch3PenBlocks.STATE_KEY, Clone.simple(penState));
                if (penState.penDown) {
                    newTarget.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
                }
            }
        }
    }

    /**
     * Retrieve the ID of the renderer "Skin" corresponding to the pen layer. If
     * the pen Skin doesn't yet exist, create it.
     * @returns {int} the Skin ID of the pen layer, or -1 on failure.
     * @private
     */
    _getPenLayerID () {
        if (this._penSkinId < 0 && this.runtime.renderer) {
            this._penSkinId = this.runtime.renderer.createPenSkin();
            this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableProperties(this._penDrawableId, {skinId: this._penSkinId});
        }
        return this._penSkinId;
    }

    /**
     * @param {Target} target - collect pen state for this target. Probably, but not necessarily, a RenderedTarget.
     * @returns {PenState} the mutable pen state associated with that target. This will be created if necessary.
     * @private
     */
    _getPenState (target) {
        let penState = target.getCustomState(Scratch3LineChart.STATE_KEY);
        if (!penState) {
            penState = Clone.simple(Scratch3LineChart.DEFAULT_PEN_STATE);
            target.setCustomState(Scratch3LineChart.STATE_KEY, penState);
        }
        return penState;
    }

    getInfo () {
        return {
            id: 'linechart',
            name: 'Line Chart',
            blocks: [
                {
                    opcode: 'drawAxis',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'linechart.drawAxis',
                        default: 'draw axis',
                        description: 'draw axis'
                    })
                },
                {
                    opcode: 'read',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'linechart.read',
                        default: 'read data x:[X] y:[Y]',
                        description: 'read data'
                    }),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        }
                    }
                },
                {
                    opcode: 'drawLine',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'linechart.drawLine',
                        default: 'draw line',
                        description: 'draw line'
                    })
                },
                {
                    opcode: 'clear',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'linechart.clear',
                        default: 'clear',
                        description: 'clear canvas'
                    })
                },
            ],
        };
    }

    /**
     * The pen "clear" block clears the pen layer's contents.
     */
    clear () {
        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penClear(penSkinId);
            this.runtime.requestRedraw();
        }

        if(!this._posEmpty){
            this._xPos.length=0;
            this._yPos.length=0;
            this._posEmpty = true;
        }
    }

    /**
     * The pen "pen down" block causes the target to leave pen trails on future motion.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    drawAxis (args, util) {
        const target = util.target;
        
        console.log("draw axis");
        target.setVisible(false);

        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            const penState = this._getPenState(target);
            target.x = this._xCenter + this._width;
            target.y = this._yCenter;
            this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter, this._yCenter, target.x, target.y);
            for(let i=0;i*this._interval<this._width;i++){
                let interval = i*this._interval;
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter+interval, this._yCenter, this._xCenter+interval, this._yCenter+5);
                
            }
            target.x = this._xCenter;
            target.y = this._yCenter + this._height;
            this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter, this._yCenter, target.x, target.y);
            for(let i=0;i*this._interval<this._height;i++){
                let interval = i*this._interval;
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter, this._yCenter+interval, this._xCenter+5, this._yCenter+interval);
                
            }
            this.runtime.requestRedraw();
        }
    }

    drawLine(args, util){
        var data_x = this._xPos;
        var data_y = this._yPos;

        console.log(data_x);
        console.log(data_y);
        
        const target = util.target;

        console.log("draw line");
        console.log(target);

        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0 && data_x.length>1 && data_y.length>1) {
            const penState = this._getPenState(target);
            for(let i=0;i<data_x.length;i++){
                this.runtime.renderer.penPoint(penSkinId, penState.penAttributes, data_x[i], data_y[i]);
            }
            for(let i=1;i<data_x.length;i++){
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, data_x[i-1], data_y[i-1], data_x[i], data_y[i]);
            }
            this.runtime.requestRedraw();
        }
    }

    read(args){
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);

        this._xPos.push(this._xCenter + x*20);
        this._yPos.push(this._yCenter + y*20);
        this._posEmpty = false;
    }
}

module.exports = Scratch3LineChart;