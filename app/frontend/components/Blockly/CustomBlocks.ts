import * as Blockly from 'blockly/core';

// Define the custom blocks
export const defineCustomBlocks = () => {
    // Move Forward Block (legacy)
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

    // Turn Left Block (legacy)
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

    // Turn Right Block (legacy)
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

    // =====================
    // MAZE GAME BLOCKS
    // =====================

    // Maze: Move Forward
    Blockly.Blocks['maze_forward'] = {
        init: function () {
            this.jsonInit({
                type: 'maze_forward',
                message0: '🐰 Move Forward',
                previousStatement: null,
                nextStatement: null,
                colour: 208,
                tooltip: 'Move the rabbit one step forward',
            });
        },
    };

    // Maze: Turn Right
    Blockly.Blocks['maze_turn_right'] = {
        init: function () {
            this.jsonInit({
                type: 'maze_turn_right',
                message0: '🐰 Turn Right ↻',
                previousStatement: null,
                nextStatement: null,
                colour: 208,
                tooltip: 'Turn the rabbit 90 degrees to the right',
            });
        },
    };

    // Maze: Turn Left
    Blockly.Blocks['maze_turn_left'] = {
        init: function () {
            this.jsonInit({
                type: 'maze_turn_left',
                message0: '🐰 Turn Left ↺',
                previousStatement: null,
                nextStatement: null,
                colour: 208,
                tooltip: 'Turn the rabbit 90 degrees to the left',
            });
        },
    };

    // Maze: Collect
    Blockly.Blocks['maze_collect'] = {
        init: function () {
            this.jsonInit({
                type: 'maze_collect',
                message0: '🥕 Collect',
                previousStatement: null,
                nextStatement: null,
                colour: 30,
                tooltip: 'Collect the carrot at current position',
            });
        },
    };

    // Maze: If Path
    Blockly.Blocks['maze_if_path'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('if path')
                .appendField(
                    new Blockly.FieldDropdown([
                        ['ahead', 'isPathForward'],
                        ['to the left ↺', 'isPathLeft'],
                        ['to the right ↻', 'isPathRight'],
                    ]),
                    'DIR'
                );
            this.appendStatementInput('DO').appendField('do');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(208);
            this.setTooltip('If there is a path in the specified direction, do something');
        },
    };

    // Maze: If/Else Path
    Blockly.Blocks['maze_if_else'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('if path')
                .appendField(
                    new Blockly.FieldDropdown([
                        ['ahead', 'isPathForward'],
                        ['to the left ↺', 'isPathLeft'],
                        ['to the right ↻', 'isPathRight'],
                    ]),
                    'DIR'
                );
            this.appendStatementInput('DO').appendField('do');
            this.appendStatementInput('ELSE').appendField('else');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(208);
            this.setTooltip('If there is a path, do something, otherwise do something else');
        },
    };

    // Controls: Repeat (simple version for maze)
    Blockly.Blocks['controls_repeat'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('repeat')
                .appendField(new Blockly.FieldNumber(4, 1, 100), 'TIMES')
                .appendField('times');
            this.appendStatementInput('DO').appendField('do');
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(120);
            this.setTooltip('Repeat the enclosed blocks a specified number of times');
        },
    };
};
