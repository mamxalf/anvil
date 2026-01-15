import * as Blockly from 'blockly/core';

// Define the custom blocks
export const defineCustomBlocks = () => {
    // Move Forward Block
    Blockly.Blocks['move_forward'] = {
        init: function () {
            this.jsonInit({
                type: 'move_forward',
                message0: 'Move Forward',
                previousStatement: null,
                nextStatement: null,
                colour: 160,
                tooltip: 'Moves the character one step forward',
                helpUrl: '',
            });
        },
    };

    // Turn Left Block
    Blockly.Blocks['turn_left'] = {
        init: function () {
            this.jsonInit({
                type: 'turn_left',
                message0: 'Turn Left',
                previousStatement: null,
                nextStatement: null,
                colour: 160,
                tooltip: 'Turns the character 90 degrees to the left',
                helpUrl: '',
            });
        },
    };

    // Turn Right Block
    Blockly.Blocks['turn_right'] = {
        init: function () {
            this.jsonInit({
                type: 'turn_right',
                message0: 'Turn Right',
                previousStatement: null,
                nextStatement: null,
                colour: 160,
                tooltip: 'Turns the character 90 degrees to the right',
                helpUrl: '',
            });
        },
    };
};
