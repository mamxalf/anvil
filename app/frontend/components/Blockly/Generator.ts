import { javascriptGenerator } from 'blockly/javascript';
import * as Blockly from 'blockly/core';

export const configureGenerator = () => {
    // Define the custom block generators
    javascriptGenerator.forBlock['move_forward'] = function (_block: Blockly.Block) {
        return 'moveForward();\n';
    };

    javascriptGenerator.forBlock['turn_left'] = function (_block: Blockly.Block) {
        return 'turnLeft();\n';
    };

    javascriptGenerator.forBlock['turn_right'] = function (_block: Blockly.Block) {
        return 'turnRight();\n';
    };
};
