/* eslint-disable max-len */
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const Color = require('../../util/color');
const log = require('../../util/log');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const RenderedTarget = require('../../sprites/rendered-target');
const StageLayering = require('../../engine/stage-layering');
const AssetType = require('../../../node_modules/scratch-storage/src/AssetType');
const {loadCostumeFromAsset} = require('../../import/load-costume');
const {newCostumeNames} = require('./helper');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

/**
 * Enum for pen color parameter values.
 * @readonly
 * @enum {string}
 */
const ColorParam = {
    COLOR: 'color',
    SATURATION: 'saturation',
    BRIGHTNESS: 'brightness',
    TRANSPARENCY: 'transparency'
};

/**
 * Asset ID for number 0 to 9, letter A to Z (index starts from 10)
 * @type {string}
 */
const assetIDArr = ['64b59074f24d0e2405a509a45c0dadba', '9f75c26aa6c56168a3e5a4f598de2c94', 'e8d8bf59db37b5012dd643a16a636042',
    '57f7afe3b9888cca56803b73a62e4227', 'b8209e1980475b30ff11e60d7633446d', 'aacb5b3cec637f192f080138b4ccd8d2',
    '84d9f26050c709e6b98706c22d2efb3d', '6194b9a251a905d0001a969990961724', '55e95fb9c60fbebb7d20bba99c7e9609',
    '0f53ee6a988bda07cba561d38bfbc36f', '3c46f5192d2c29f957381e0100c6085d', '22817ed2e4253787c78d7b696bbefdc1',
    '6bd5cb8bc3e4df5e055f4c56dd630855', 'dd713e3bf42d7a4fd8d2f12094db1c63', '4e903ac41a7e16a52efff8477f2398c7',
    'd4ec9a1827429f4e2f3dc239dcc15b95', '8fb61932544adbe8c95b067ad1351758', '99aae97a2b49904db7eeb813fa968582',
    '9cad752323aa81dfa8d8cf009057b108', 'd5b58ddd6f6b4fdcfdfd86d102853935', '17ef8f63a2a8f47258bd62cf642fd8d6',
    'ec4d85a60c32c7637de31dbf503266a0', '643896fcad0a1bf6eb9f3f590094687c', '40ffad793f4042a5fe7b3aaa6bc175ae',
    '43a89fc1442627ca48b1dc631c517942', '9cf707e83af27c47e74adb77496ffca5', '01acd1076994a4379a3fc9e034bc05fc',
    '5c1d38d02ae9c4df7851a6e9d52f25b4', 'fd2a94481c3ef0c223784b2f3c6df874', '66b22b0ff0a5c1c205a701316ab954cf',
    'f6b7b4da5362fdac29d84f1fbf19e3f4', 'd5c20886e3eb0ca0f5430c9482b1d832', '528df57da4490f6da8c75da06a1367f5',
    '04be1176e562eff16f1159f69945a82e', 'd7fabe2652c93dd1bf91d9064cf5a348', '665db4c356d7e010fa8d71cc291834e3'];

class Scratch3VizBlocks {
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

        // Initiate canvas and center of coordinate system for the line chart / dot plot
        this._xCenter = -160;
        this._yCenter = -100;
        this._width = 360;
        this._height = 200;

        // Shared variables
        this._xMarkers = 10;
        this._yMarkers = 5;
        this._interval = 36;

        // Variables for line graph
        this._xArray = [];
        this._yArray = [];
        this._xPos = [];
        this._yPos = [];
        this._posEmpty = true;

        // Variables for dot plot
        this._valCountMap = new Map();
        this._dotPos = [];

        // Variables for picture graph
        this._xPicStart = -250;
        this._yPicStart = 150;
        this._yCostumeStart = 100;
        this._picCategories = [];
        this._customSprites = newCostumeNames;
        if (this._customSprites.length === 0) {
            this._customSprites = ['costume1'];
        }

        // Variables for pie chart
        this._xPieStart = -250;
        this._yPieStart = 150;
        this._radius = 120;
        this._categorySizesArr = [];
        this._pieChartSize = 0;
        this._colors = [];

        // Costumes array
        this._costumes = [];

        // Event listeners
        this._onTargetCreated = this._onTargetCreated.bind(this);
        this._onTargetMoved = this._onTargetMoved.bind(this);
        runtime.on('targetWasCreated', this._onTargetCreated);
        runtime.on('RUNTIME_DISPOSED', this.clear.bind(this));
    }

    // PEN RELATED METHODS

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
     * The minimum and maximum allowed pen size.
     * The maximum is twice the diagonal of the stage, so that even an
     * off-stage sprite can fill it.
     * @type {{min: number, max: number}}
     */
    static get PEN_SIZE_RANGE () {
        return {min: 1, max: 1200};
    }

    /**
     * Wrap a color input into the range (0,100).
     * @param {number} value - the value to be wrapped.
     * @returns {number} the wrapped value.
     * @private
     */
    _wrapColor (value) {
        return MathUtil.wrapClamp(value, 0, 100);
    }

    /**
     * Clamp a pen color parameter to the range (0,100).
     * @param {number} value - the value to be clamped.
     * @returns {number} the clamped value.
     * @private
     */
    _clampColorParam (value) {
        return MathUtil.clamp(value, 0, 100);
    }

    /**
     * Clamp a pen size value to the range allowed by the pen.
     * @param {number} requestedSize - the requested pen size.
     * @returns {number} the clamped size.
     * @private
     */
    _clampPenSize (requestedSize) {
        return MathUtil.clamp(
            requestedSize,
            Scratch3VizBlocks.PEN_SIZE_RANGE.min,
            Scratch3VizBlocks.PEN_SIZE_RANGE.max
        );
    }

    /**
     * Convert a pen transparency value to an alpha value.
     * Alpha ranges from 0 to 1, where 0 is transparent and 1 is opaque.
     * Transparency ranges from 0 to 100, where 0 is opaque and 100 is transparent.
     * @param {number} transparency - the input transparency value.
     * @returns {number} the alpha value.
     * @private
     */
    _transparencyToAlpha (transparency) {
        return 1.0 - (transparency / 100.0);
    }

    /**
     * Sets the pen size to the given amount.
     * @param {number} size - the amount of desired size change.
     * @param {RenderedTarget} target - target object that has been updated.
     */
    setPenSizeTo (size, target) {
        const penAttributes = this._getPenState(target).penAttributes;
        penAttributes.diameter = this._clampPenSize(Cast.toNumber(size));
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
            // eslint-disable-next-line no-undef
            const penState = sourceTarget.getCustomState(Scratch3PenBlocks.STATE_KEY);
            if (penState) {
                // eslint-disable-next-line no-undef
                newTarget.setCustomState(Scratch3PenBlocks.STATE_KEY, Clone.simple(penState));
                if (penState.penDown) {
                    newTarget.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
                }
            }
        }
    }

    /**
     * Handle a target which has moved. This only fires when the pen is down.
     * @param {RenderedTarget} target - the target which has moved.
     * @param {number} oldX - the previous X position.
     * @param {number} oldY - the previous Y position.
     * @param {boolean} isForce - whether the movement was forced.
     * @private
     */
    _onTargetMoved (target, oldX, oldY, isForce) {
        // Only move the pen if the movement isn't forced (ie. dragged).
        if (!isForce) {
            const penSkinId = this._getPenLayerID();
            if (penSkinId >= 0) {
                const penState = this._getPenState(target);
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, oldX, oldY, target.x, target.y);
                this.runtime.requestRedraw();
            }
        }
    }

    /**
     * Update the cached color from the color, saturation, brightness and transparency values
     * in the provided PenState object.
     * @param {PenState} penState - the pen state to update.
     * @private
     */
    _updatePenColor (penState) {
        const rgb = Color.hsvToRgb({
            h: penState.color * 360 / 100,
            s: penState.saturation / 100,
            v: penState.brightness / 100
        });
        penState.penAttributes.color4f[0] = rgb.r / 255.0;
        penState.penAttributes.color4f[1] = rgb.g / 255.0;
        penState.penAttributes.color4f[2] = rgb.b / 255.0;
        penState.penAttributes.color4f[3] = this._transparencyToAlpha(penState.transparency);
    }

    /**
     * Set or change a single color parameter on the pen state, and update the pen color.
     * @param {ColorParam} param - the name of the color parameter to set or change.
     * @param {number} value - the value to set or change the param by.
     * @param {PenState} penState - the pen state to update.
     * @param {boolean} change - if true change param by value, if false set param to value.
     * @private
     */
    _setOrChangeColorParam (param, value, penState, change) {
        switch (param) {
        case ColorParam.COLOR:
            penState.color = this._wrapColor(value + (change ? penState.color : 0));
            break;
        case ColorParam.SATURATION:
            penState.saturation = this._clampColorParam(value + (change ? penState.saturation : 0));
            break;
        case ColorParam.BRIGHTNESS:
            penState.brightness = this._clampColorParam(value + (change ? penState.brightness : 0));
            break;
        case ColorParam.TRANSPARENCY:
            penState.transparency = this._clampColorParam(value + (change ? penState.transparency : 0));
            break;
        default:
            log.warn(`Tried to set or change unknown color parameter: ${param}`);
        }
        this._updatePenColor(penState);
    }

    /**
     * Changes one of the pen's color parameters by a given amount.
     * @param {number} value - the amount to change the selected parameter by.
     * @param {RenderedTarget} target - target object that has been updated.
     */
    changePenColorParamBy (value, target) {
        const penState = this._getPenState(target);
        this._setOrChangeColorParam('color', Cast.toNumber(value), penState, true);
    }

    /**
     * Causes the target to leave pen trails on future motion.
     * @param {RenderedTarget} target - target object that has been updated.
     */
    penDown (target) {
        const penState = this._getPenState(target);

        if (!penState.penDown) {
            penState.penDown = true;
            target.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }

        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penPoint(penSkinId, penState.penAttributes, target.x, target.y);
            this.runtime.requestRedraw();
        }
    }

    /**
     * Stops the target from leaving pen trails.
     * @param {RenderedTarget} target - target object that has been updated.
     */
    penUp (target) {
        const penState = this._getPenState(target);

        if (penState.penDown) {
            penState.penDown = false;
            target.removeListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
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
        let penState = target.getCustomState(Scratch3VizBlocks.STATE_KEY);
        if (!penState) {
            penState = Clone.simple(Scratch3VizBlocks.DEFAULT_PEN_STATE);
            target.setCustomState(Scratch3VizBlocks.STATE_KEY, penState);
        }
        return penState;
    }

    // METADATA FOR BLOCKS

    getInfo () {
        return {
            id: 'vizblocks',
            name: 'VizBlocks',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'clear',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.clear',
                        default: 'clear',
                        description: 'clear canvas'
                    })
                },
                {
                    opcode: 'drawXAxis',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.drawXAxis',
                        default: 'draw X-axis for [CHART] label:[LABEL]',
                        description: 'draw X-axis and insert label'
                    }),
                    arguments: {
                        CHART: {
                            type: ArgumentType.STRING,
                            menu: 'CHART',
                            defaultValue: 'dot plot'
                        },
                        LABEL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Type letters only'
                        }
                    }
                },
                {
                    opcode: 'drawYAxis',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.drawYAxis',
                        default: 'draw Y-axis label:[LABEL]',
                        description: 'draw Y-axis and insert label'
                    }),
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Type letters only'
                        }
                    }
                },
                {
                    opcode: 'readXY',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.readXY',
                        default: 'read x:[X] y:[Y]',
                        description: 'read from (X, Y)'
                    }),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'drawLine',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.drawLine',
                        default: 'draw line',
                        description: 'draw line'
                    })
                },
                {
                    opcode: 'readValCount',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.readValCount',
                        default: 'read value:[value] count:[count]',
                        description: 'read from (value, count)'
                    }),
                    arguments: {
                        value: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        count: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'plotDots',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.plotDots',
                        default: 'plot dots',
                        description: 'plot dots'
                    })
                },
                {
                    opcode: 'readPicCategoryCount',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.readPicCategoryCount',
                        default: 'read [PICTURE] for category:[category] count:[count]',
                        description: 'read （picture) for (category) with (count)'
                    }),
                    arguments: {
                        category: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Type letters only'
                        },
                        PICTURE: {
                            type: ArgumentType.STRING,
                            menu: 'PICTURE',
                            defaultValue: this._customSprites[0]
                        },
                        count: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'readCategorySize',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.readCategorySize',
                        default: 'read category:[category] size:[size]',
                        description: 'read data from (category, size)'
                    }),
                    arguments: {
                        category: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Type letters only'
                        },
                        size: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'drawPictures',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.drawPictures',
                        default: 'draw pictures',
                        description: 'draw pictures'
                    })
                },
                {
                    opcode: 'drawPie',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vizblocks.drawPie',
                        default: 'draw pie',
                        description: 'draw pie'
                    })
                }
            ],
            menus: {
                CHART: {
                    acceptReporters: true,
                    items: ['dot plot', 'line chart']
                },
                PICTURE: {
                    acceptReporters: true,
                    items: this._customSprites
                }
            }
        };
    }

    // CODE OF BLOCKS

    /**
     * Clears the layer's contents and costumes.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    clear (args, util) {
        const penSkinId = this._getPenLayerID();
        const target = util.target;
        target.setVisible(false);
        if (penSkinId >= 0) {
            this.runtime.renderer.penClear(penSkinId);
            this.runtime.requestRedraw();
        }

        // Clear for line chart
        if (!this._posEmpty){
            this._xPos.length = 0;
            this._yPos.length = 0;
            this._xArray = [];
            this._yArray = [];
            this._posEmpty = true;
        }

        // Clear for dot plot
        this._valCountMap = new Map();
        this._dotPos = [];
        this.setPenSizeTo(1, target);

        // Clear for picture graph
        this._picCategories = [];
        this._xPicStart = -250;
        this._yPicStart = 150;

        // Clear for pie chart
        this._categorySizesArr = [];
        this._pieChartSize = 0;
        this._colors = [];
        this._xPieStart = -250;
        this._yPieStart = 150;

        target.sprite.costumes_.forEach(costume => {
            if (costume.name !== 'costume1' && costume.name !== 'costume2' && !newCostumeNames.includes(costume.name)) {
                target.deleteCostume(target.getCostumeIndexByName(costume.name));
            }
        });
        target.setCostume('costume1');
    }

    /**
     * Read data from input as (picture, category, count)
     * @param {object} args - the block arguments.
     */
    readPicCategoryCount (args) {
        this._picCategories.push({
            picture: args.PICTURE,
            category: args.category,
            count: args.count
        });
    }

    /**
     * Draw pictures for the picture graph.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    drawPictures (args, util) {
        const target = util.target;
        target.setCostume('costume1');
        const penSkinId = this._getPenLayerID();
        this._costumes = this.loadCostumes(target);
        const incrementDist = 20;

        if (penSkinId >= 0 && this._picCategories.length > 0) {
            for (let i = 0; i < this._picCategories.length; i++) {
                let {picture, category, count} = this._picCategories[i];
                category = Cast.toString(category).toUpperCase();

                this.processText(category, penSkinId, 'picture', target);
                // Draw pictures based on the count
                for (let j = 0; j < count; j++) {
                    this.runtime.renderer.penStamp(penSkinId, target.drawableID);
                    target.setCostume(target.getCostumeIndexByName(picture));
                    target.setDirection(90);
                    target.setSize(20);
                    target.setXY(this._xPicStart + 120 + (incrementDist * j), this._yPicStart);
                    target.setVisible(true);
                    this.runtime.requestRedraw();
                }
                this._yPicStart -= 50;
            }
        }
        this.runtime.renderer.penStamp(penSkinId, target.drawableID);
    }

    /**
     * Draw x-axis for line chart or dot plot.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    drawXAxis (args, util) {
        const target = util.target;
        const chart = args.CHART;
        const label = Cast.toString(args.LABEL).toUpperCase();

        target.setVisible(false);
        this._costumes = this.loadCostumes(target);

        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            const penState = this._getPenState(target);
            target.x = this._xCenter + this._width;
            target.y = this._yCenter;
            // draw x-axis line
            this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter, this._yCenter, target.x, target.y);

            // Labelling x-axis
            this.labelAxis(penSkinId, penState, label, 'X', target, chart);
            this.runtime.requestRedraw();
        }
    }

    /**
     * Draw Y axis for line chart.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    drawYAxis (args, util) {
        const target = util.target;
        const label = Cast.toString(args.LABEL).toUpperCase();

        target.setVisible(false);
        this._costumes = this.loadCostumes(target);

        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            const penState = this._getPenState(target);
            target.x = this._xCenter;
            target.y = this._yCenter + this._height;
            // draw y-axis line
            this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter, this._yCenter, target.x, target.y);

            // Labelling y-axis
            this.labelAxis(penSkinId, penState, label, 'Y', target, 'line chart');
            this.runtime.requestRedraw();
        }
    }

    /**
     * Draw a line for the line chart.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    drawLine (args, util) {
        const dataX = this._xPos;
        const dataY = this._yPos;

        const data = dataX.map((d, i) => ({
            x: d,
            y: dataY[i]
        }));

        data.sort((a, b) => (a.x - b.x));

        const target = util.target;
        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0 && data.length > 1) {
            const penState = this._getPenState(target);
            for (let i = 1; i < data.length; i++){
                // eslint-disable-next-line max-len
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, data[i - 1].x, data[i - 1].y, data[i].x, data[i].y);
            }
            this.runtime.requestRedraw();
        }
    }

    /**
     * Read data from input as (x, y)
     * @param {object} args - the block arguments.
     */
    readXY (args) {
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);

        this._xArray.push(x);
        this._yArray.push(y);
        this._posEmpty = false;
    }

    /**
     * Read data from input as (value, count)
     * @param {object} args - the block arguments.
     */
    readValCount (args) {
        const value = Cast.toNumber(args.value);
        const count = Cast.toNumber(args.count);

        this._valCountMap.set(value, count);
    }

    /**
     * Plot the dots in a dot plot
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    plotDots (args, util) {
        const target = util.target;
        const penSkinId = this._getPenLayerID();
        const dotPos = this._dotPos;
        const valCountMap = this._valCountMap;
        const incrementDist = 10;

        this.setPenSizeTo(5, target);

        if (penSkinId >= 0 && dotPos.length > 0) {
            const penState = this._getPenState(target);
            for (let i = 0; i < dotPos.length; i++) {
                const pos = dotPos[i][0];
                const value = dotPos[i][1];
                const count = valCountMap.get(value);

                // Plot number of dots based on the count of each value
                for (let j = 0; j < count; j++) {
                    this.runtime.renderer.penPoint(penSkinId, penState.penAttributes, pos, this._yCenter + 5 + (incrementDist * j));
                }
            }
            this.runtime.requestRedraw();
        }
    }

    /**
     * Read data from input as (category, size)
     * @param {object} args - the block arguments.
     */
    readCategorySize (args){
        const category = Cast.toString(args.category);
        const size = Cast.toNumber(args.size);

        this._categorySizesArr.push([category, size]);
        this._pieChartSize += size;

        if (this._colors.length === 0) {
            this._colors = [15];
        } else {
            this._colors.push(this._colors[this._colors.length - 1] + 15);
        }
    }

    /**
     * Draw a line for the line chart.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    drawPie (args, util) {
        const target = util.target;
        target.setDirection(0);
        const penSkinId = this._getPenLayerID();
        const penState = this._getPenState(target);
        this._costumes = this.loadCostumes(target);

        if (penSkinId >= 0 && this._categorySizesArr.length > 0) {
            // Draw and label separate sections of the pie
            for (let i = 0; i < this._categorySizesArr.length; i++) {
                const currLabel = Cast.toString(this._categorySizesArr[i][0]).toUpperCase();
                const currSize = this._categorySizesArr[i][1];
                this.changePenColorParamBy(this._colors[i], target);

                // Draw label + color marking
                this.processText(currLabel, penSkinId, 'pie', target);
                this.setPenSizeTo(5, target);
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xPieStart + 120, this._yPieStart, this._xPieStart + 170, this._yPieStart);
                this.setPenSizeTo(1, target);

                let renderCount = Math.floor((currSize / this._pieChartSize) * (2 * Math.PI * this._radius));
                const degreesToTurn = 180 / (Math.PI * this._radius);
                let isDrawing = false;

                while (renderCount >= 0) {
                    if (isDrawing) {
                        target.setDirection(target.direction + degreesToTurn);
                    } else {
                        target.setDirection(target.direction);
                    }
                    target.setXY(75, 0); // Start at right side of the renderer section
                    isDrawing = true;
                    this.penDown(target);
                    this.moveSteps(this._radius, target);
                    this.penUp(target);

                    renderCount--;
                }
                this._yPieStart -= 30;
            }
            this.runtime.requestRedraw();
        }
    }

    // HELPER METHODS

    /**
     * Move x steps.
     * @param {number} steps - number of steps to move
     * @param {RenderedTarget} target - target object that has been updated.
     */
    moveSteps (steps, target) {
        const radians = MathUtil.degToRad(90 - target.direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        target.setXY(target.x + dx, target.y + dy);
    }

    /**
     * Load number costumes from existing assets and add costumes to target of the utility object
     * @param {RenderedTarget} target - target object that has been updated.
     * @returns {Promise.<Array>} -  A promise for the requested costumes Array.
     *   If the promise is resolved with non-null, the value is the requested asset or a fallback.
     *   If the promise is resolved with null, the desired asset could not be found with the current asset sources.
     *   If the promise is rejected, there was an error on at least one asset source. HTTP 404 does not count as an
     *   error here, but (for example) HTTP 403 does.
     */
    loadCostumes (target) {
        let result = Promise.resolve();
        const costumes = [];

        // load number costumes and letter costumes
        assetIDArr.forEach((assetID, index) => {
            const costumeObject = new Object();
            const name = index >= 10 ? String.fromCharCode('A'.charCodeAt() + index - 10) : index;
            result = result.then(() => this.runtime.storage.load(AssetType.ImageVector, assetID).then(asset => {
                // load asset by assetID
                costumeObject.name = index >= 10 ? `letter${name}` : `number${name}`;
                costumeObject.dataFormat = 'svg';
                costumeObject.asset = asset;
                costumes.push(costumeObject);
                // eslint-disable-next-line no-shadow
                loadCostumeFromAsset(costumeObject, this.runtime).then((costume, index) => {
                    // add costume to target
                    target.addCostume(costume, index);
                });
            }));
        });

        // eslint-disable-next-line arrow-body-style
        return result.then(() => {
            return costumes;
        });
    }

    /**
     * Process each character to display as a label
     * @param {int|string} label - the label text, can be number or string.
     * @param {int} penSkinId - Skin ID of the pen layer, or -1 on failure.
     * @param {string} option - e.g. 'X', 'Y' or 'pie'.
     * @param {RenderedTarget} target - target object that has been updated.
     * @param {?object} opt - optional parameters to process.
     */
    processText (label, penSkinId, option, target) {
        for (let index = 0; index < label.length; index++) {
            const char = label[index];
            if (char >= 'A' && char <= 'Z') {
                this.setText(penSkinId, index, 0, char, option, target);
            }
        }
    }

    /**
     * Label the axes with text and markers.
     * @param {int} penSkinId - Skin ID of the pen layer, or -1 on failure.
     * @param {PenState} penState - mutable pen state associated with that target. This will be created if necessary.
     * @param {int|string} label - the label text, can be number or string.
     * @param {string} axisOption - the axis option, e.g. 'X' or 'Y'.
     * @param {RenderedTarget} target - target object that has been updated.
     * @param {string} chart - the type of chart e.g. dot plot or line chart
     */
    labelAxis (penSkinId, penState, label, axisOption, target, chart) {
        const thisMarker = axisOption === 'X' ? this._xMarkers : this._yMarkers;
        const thisCenter = axisOption === 'X' ? this._xCenter : this._yCenter;

        // Set up label for axis
        this.processText(label, penSkinId, axisOption, target);

        // generate internal markers
        if (axisOption === 'X'){
            for (let i = 0; i * this._interval <= this._width; i++){
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter + (i * this._interval), this._yCenter, this._xCenter + (i * this._interval), this._yCenter + 5);
            }
        } else if (axisOption === 'Y'){
            for (let j = 1; j * this._interval <= this._height; j++){
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, this._xCenter, this._yCenter + (j * this._interval), this._xCenter + 5, this._yCenter + (j * this._interval));
            }
        }

        if (chart === 'dot plot') {
            const values = [...this._valCountMap.entries()].map(valCountPair => valCountPair[0]).sort((a, b) => (a.x - b.x));
            if (values.length !== 0) {
                const maxValue = Math.max.apply(null, values);
                const divider = this.prepareLargeNumbers(maxValue, thisMarker, penSkinId, axisOption, target);

                // set position for input data
                for (let i = 0; i < values.length; i++) {
                    this._dotPos.push([thisCenter + (values[i] * this._interval / divider), values[i]]);
                }
            }
        } else if (chart === 'line chart') {
            const thisArray = axisOption === 'X' ? this._xArray : this._yArray;
            const thisPos = axisOption === 'X' ? this._xPos : this._yPos;

            if (thisArray.length !== 0) {
                const maxValue = Math.max.apply(null, thisArray);
                const divider = this.prepareLargeNumbers(maxValue, thisMarker, penSkinId, axisOption, target);

                // set position for input data
                for (let d = 0; d < thisArray.length; d++) {
                    thisPos.push(thisCenter + (thisArray[d] * this._interval / divider));
                }
            }
        }
    }

    /**
     * Prepare numbers larger than 9 to set as text.
     * @param {number} maxValue - Max value of the target axis.
     * @param {number} thisMarker - Number of markers in the axis.
     * @param {int} penSkinId - Skin ID of the pen layer, or -1 on failure.
     * @param {string} axisOption - the axis option, e.g. 'X' or 'Y'.
     * @param {RenderedTarget} target - target object that has been updated.
     * @returns {number} divider - the divider value for tracking interval distance.
     */
    prepareLargeNumbers (maxValue, thisMarker, penSkinId, axisOption, target) {
        const numbers = [];
        const maxNumber = maxValue % 10 === 0 ? maxValue : 10 * (Math.floor(maxValue / 10) + 1);
        for (let l = 0; l <= thisMarker; l++){
            numbers.push(maxNumber / thisMarker * l);
        }
        numbers.forEach((number, index) => {
            const num = number.toString();
            // Set text for each character in the number
            for (let i = 0; i < num.length; i++){
                this.setText(penSkinId, index, i, num[i], axisOption, target);
            }
        });

        return numbers[1];
    }

    /**
     * Set text for the axis' values
     * @param {int} penSkinId - Skin ID of the pen layer, or -1 on failure.
     * @param {int} numberIndex - the index of label.
     * @param {int} charIndex - the index of char in label.
     * @param {int|string} costumeIndex - the index of costume.
     * @param {string} option - the context to set text in.
     * @param {RenderedTarget} target - target object that has been updated.
     */
    setText (penSkinId, numberIndex, charIndex, costumeIndex, option, target) {
        let xPos;
        let yPos;
        let size;
        let direction;

        // set text based on costumeIndex
        if (costumeIndex <= 9 && costumeIndex >= 0) {
            if (option === 'X') {
                xPos = this._xCenter + (numberIndex * this._interval) + (charIndex * 8);
                yPos = this._yCenter - 10;
            } else if (option === 'Y') {
                xPos = this._xCenter - 10;
                yPos = this._yCenter + (numberIndex * this._interval) + (charIndex * 8);
            }
            size = 20;
        } else if (costumeIndex >= 'A' && costumeIndex <= 'Z') {
            if (option === 'X') {
                direction = 90;
                xPos = this._xCenter + (this._interval * 3) + (numberIndex * this._interval / 3);
                yPos = this._yCenter - 40;
                size = 32;
            } else if (option === 'Y') {
                direction = 0;
                xPos = this._xCenter - 40;
                yPos = this._yCenter + this._interval + (numberIndex * this._interval / 3);
                size = 32;
            } else if (option === 'picture') {
                direction = 90;
                xPos = this._xPicStart + this._interval + (numberIndex * this._interval / 5);
                yPos = this._yPicStart;
                size = 20;
            } else if (option === 'pie') {
                direction = 90;
                xPos = this._xPieStart + this._interval + (numberIndex * this._interval / 5);
                yPos = this._yPieStart;
                size = 20;
            }
            costumeIndex = costumeIndex.charCodeAt() - 65 + 10;
        }

        this._costumes.then(costume => {
            if (penSkinId >= 0) {
                this.runtime.renderer.penStamp(penSkinId, target.drawableID);
                target.setCostume(target.getCostumeIndexByName(costume[costumeIndex].name));
                target.setDirection(direction);
                target.setSize(size);
                target.setXY(xPos, yPos);
                target.setVisible(true);
                this.runtime.requestRedraw();
            }
        });
    }
}

module.exports = Scratch3VizBlocks;
