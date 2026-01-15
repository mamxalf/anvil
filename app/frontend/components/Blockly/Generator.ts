import { javascriptGenerator } from 'blockly/javascript';
import * as Blockly from 'blockly/core';

export const configureGenerator = () => {
    // Legacy block generators
    javascriptGenerator.forBlock['move_forward'] = function (_block: Blockly.Block) {
        return 'moveForward();\n';
    };

    javascriptGenerator.forBlock['turn_left'] = function (_block: Blockly.Block) {
        return 'turnLeft();\n';
    };

    javascriptGenerator.forBlock['turn_right'] = function (_block: Blockly.Block) {
        return 'turnRight();\n';
    };

    // =====================
    // MAZE GAME GENERATORS
    // =====================

    // Maze: Move Forward
    javascriptGenerator.forBlock['maze_forward'] = function (_block: Blockly.Block) {
        return 'moveforward();\n';
    };

    // Maze: Turn Right
    javascriptGenerator.forBlock['maze_turn_right'] = function (_block: Blockly.Block) {
        return 'turnright();\n';
    };

    // Maze: Turn Left
    javascriptGenerator.forBlock['maze_turn_left'] = function (_block: Blockly.Block) {
        return 'turnleft();\n';
    };

    // Maze: Collect
    javascriptGenerator.forBlock['maze_collect'] = function (_block: Blockly.Block) {
        return 'collect();\n';
    };

    // Maze: If Path
    javascriptGenerator.forBlock['maze_if_path'] = function (block: Blockly.Block) {
        const direction = block.getFieldValue('DIR');
        const doCode = javascriptGenerator.statementToCode(block, 'DO');
        return `if (${direction}()) {\n${doCode}}\n`;
    };

    // Maze: If/Else Path
    javascriptGenerator.forBlock['maze_if_else'] = function (block: Blockly.Block) {
        const direction = block.getFieldValue('DIR');
        const doCode = javascriptGenerator.statementToCode(block, 'DO');
        const elseCode = javascriptGenerator.statementToCode(block, 'ELSE');
        return `if (${direction}()) {\n${doCode}} else {\n${elseCode}}\n`;
    };

    // Controls: Repeat
    javascriptGenerator.forBlock['controls_repeat'] = function (block: Blockly.Block) {
        const times = block.getFieldValue('TIMES');
        const doCode = javascriptGenerator.statementToCode(block, 'DO');
        return `for (var count = 0; count < ${times}; count++) {\n${doCode}}\n`;
    };
};
