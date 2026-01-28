// Blockly Toolbox and Block Definitions for Platformer Game

import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import type { PlatformerLevelConfig } from './PlatformerTypes'

interface ToolboxCategory {
    kind: 'category'
    name: string
    colour: string
    contents: unknown[]
}

interface Toolbox {
    kind: 'categoryToolbox'
    contents: ToolboxCategory[]
}

export function createPlatformerToolbox(
    levelConfig: PlatformerLevelConfig,
    t: (key: string, params?: Record<string, string>) => string
): Toolbox {
    const contents: ToolboxCategory[] = []

    // Movement category
    if (
        levelConfig.availableBlocks.includes('move_right') ||
        levelConfig.availableBlocks.includes('move_left') ||
        levelConfig.availableBlocks.includes('jump') ||
        levelConfig.availableBlocks.includes('jump_right') ||
        levelConfig.availableBlocks.includes('jump_left')
    ) {
        const movementBlocks: unknown[] = []

        if (levelConfig.availableBlocks.includes('move_right')) {
            movementBlocks.push({
                kind: 'block',
                type: 'platformer_move_right',
            })
        }

        if (levelConfig.availableBlocks.includes('move_left')) {
            movementBlocks.push({
                kind: 'block',
                type: 'platformer_move_left',
            })
        }

        if (levelConfig.availableBlocks.includes('jump')) {
            movementBlocks.push({
                kind: 'block',
                type: 'platformer_jump',
            })
        }

        if (levelConfig.availableBlocks.includes('jump_right')) {
            movementBlocks.push({
                kind: 'block',
                type: 'platformer_jump_right',
            })
        }

        if (levelConfig.availableBlocks.includes('jump_left')) {
            movementBlocks.push({
                kind: 'block',
                type: 'platformer_jump_left',
            })
        }

        contents.push({
            kind: 'category',
            name: t('platformer.blocks.movement', { defaultValue: 'Movement' }),
            colour: '120',
            contents: movementBlocks,
        } as ToolboxCategory)
    }

    // Loops category
    if (levelConfig.availableBlocks.includes('repeat')) {
        contents.push({
            kind: 'category',
            name: t('platformer.blocks.loops', { defaultValue: 'Loops' }),
            colour: '180',
            contents: [
                {
                    kind: 'block',
                    type: 'controls_repeat_ext',
                    inputs: {
                        TIMES: {
                            shadow: { type: 'math_number', fields: { NUM: 3 } },
                        },
                    },
                },
            ],
        } as ToolboxCategory)
    }

    // Logic category
    if (
        levelConfig.availableBlocks.includes('if_spike_ahead') ||
        levelConfig.availableBlocks.includes('if_gap_ahead')
    ) {
        const logicBlocks: unknown[] = []

        if (levelConfig.availableBlocks.includes('if_spike_ahead')) {
            logicBlocks.push({
                kind: 'block',
                type: 'platformer_if_spike_ahead',
            })
        }

        if (levelConfig.availableBlocks.includes('if_gap_ahead')) {
            logicBlocks.push({
                kind: 'block',
                type: 'platformer_if_gap_ahead',
            })
        }

        contents.push({
            kind: 'category',
            name: t('platformer.blocks.logic', { defaultValue: 'Logic' }),
            colour: '210',
            contents: logicBlocks,
        } as ToolboxCategory)
    }

    return {
        kind: 'categoryToolbox',
        contents,
    }
}

// Block definitions for Blockly
export function definePlatformerBlocks(): void {
    if (typeof Blockly === 'undefined') return

    // Define blocks with JSON
    Blockly.defineBlocksWithJsonArray([
        {
            type: 'platformer_move_right',
            message0: 'gerak kanan ➡️',
            previousStatement: null,
            nextStatement: null,
            colour: 120,
            tooltip: 'Gerakkan karakter ke kanan',
            helpUrl: '',
        },
        {
            type: 'platformer_move_left',
            message0: '⬅️ gerak kiri',
            previousStatement: null,
            nextStatement: null,
            colour: 120,
            tooltip: 'Gerakkan karakter ke kiri',
            helpUrl: '',
        },
        {
            type: 'platformer_jump',
            message0: 'lompat ⬆️',
            previousStatement: null,
            nextStatement: null,
            colour: 120,
            tooltip: 'Buat karakter melompat',
            helpUrl: '',
        },
        {
            type: 'platformer_jump_right',
            message0: 'lompat kanan ↗️',
            previousStatement: null,
            nextStatement: null,
            colour: 160,
            tooltip: 'Lompat sambil bergerak ke kanan',
            helpUrl: '',
        },
        {
            type: 'platformer_jump_left',
            message0: '↖️ lompat kiri',
            previousStatement: null,
            nextStatement: null,
            colour: 160,
            tooltip: 'Lompat sambil bergerak ke kiri',
            helpUrl: '',
        },
        {
            type: 'platformer_if_spike_ahead',
            message0: 'jika ada duri di depan 🔺',
            message1: 'lakukan %1',
            args1: [
                {
                    type: 'input_statement',
                    name: 'DO',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 210,
            tooltip: 'Cek jika ada duri di depan karakter',
            helpUrl: '',
        },
        {
            type: 'platformer_if_gap_ahead',
            message0: 'jika ada lubang di depan 🕳️',
            message1: 'lakukan %1',
            args1: [
                {
                    type: 'input_statement',
                    name: 'DO',
                },
            ],
            previousStatement: null,
            nextStatement: null,
            colour: 210,
            tooltip: 'Cek jika ada lubang di depan karakter',
            helpUrl: '',
        },
    ])

    // Generator for JavaScript
    javascriptGenerator.forBlock['platformer_move_right'] = function () {
        return 'moveright();\n'
    }

    javascriptGenerator.forBlock['platformer_move_left'] = function () {
        return 'moveleft();\n'
    }

    javascriptGenerator.forBlock['platformer_jump'] = function () {
        return 'jump();\n'
    }

    javascriptGenerator.forBlock['platformer_jump_right'] = function () {
        return 'jumpright();\n'
    }

    javascriptGenerator.forBlock['platformer_jump_left'] = function () {
        return 'jumpleft();\n'
    }

    javascriptGenerator.forBlock['platformer_if_spike_ahead'] = function (
        block: Blockly.Block
    ) {
        const statementsDo = javascriptGenerator.statementToCode(block, 'DO')
        return `if (isspikeahead()) {\n  ${statementsDo}}\n`
    }

    javascriptGenerator.forBlock['platformer_if_gap_ahead'] = function (
        block: Blockly.Block
    ) {
        const statementsDo = javascriptGenerator.statementToCode(block, 'DO')
        return `if (isgapahead()) {\n  ${statementsDo}}\n`
    }
}
