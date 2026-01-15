// Dynamic toolbox generator for maze game
import { LevelConfig } from './MazeLevels'

export interface ToolboxBlock {
  kind: 'block'
  type: string
}

export interface ToolboxCategory {
  kind: 'category'
  name: string
  colour: string
  contents: ToolboxBlock[]
}

export interface ToolboxConfig {
  kind: 'categoryToolbox'
  contents: ToolboxCategory[]
}

// Map block names to their display configuration
const blockConfig: { [key: string]: { name: string; colour: string } } = {
  maze_forward: { name: 'Actions', colour: '208' },
  maze_turn_right: { name: 'Actions', colour: '208' },
  maze_turn_left: { name: 'Actions', colour: '208' },
  maze_collect: { name: 'Actions', colour: '30' },
  maze_if_path: { name: 'Conditions', colour: '208' },
  maze_if_else: { name: 'Conditions', colour: '208' },
  controls_repeat: { name: 'Loops', colour: '120' },
}

export const createMazeToolbox = (levelConfig: LevelConfig): ToolboxConfig => {
  const categories: { [key: string]: ToolboxBlock[] } = {}

  // Organize blocks by category based on available blocks for this level
  for (const blockType of levelConfig.blocks) {
    const config = blockConfig[blockType]
    if (config) {
      if (!categories[config.name]) {
        categories[config.name] = []
      }
      categories[config.name].push({
        kind: 'block',
        type: blockType,
      })
    }
  }

  // Convert to toolbox format
  const contents: ToolboxCategory[] = []

  // Add categories in a specific order
  const categoryOrder = ['Actions', 'Loops', 'Conditions']
  for (const categoryName of categoryOrder) {
    if (categories[categoryName] && categories[categoryName].length > 0) {
      contents.push({
        kind: 'category',
        name: categoryName,
        colour: blockConfig[categories[categoryName][0].type]?.colour || '160',
        contents: categories[categoryName],
      })
    }
  }

  return {
    kind: 'categoryToolbox',
    contents,
  }
}

// Simple flat toolbox for single-category display
export const createSimpleToolbox = (blocks: string[]): ToolboxConfig => {
  return {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: '🐰 Rabbit Actions',
        colour: '208',
        contents: blocks.map((type) => ({
          kind: 'block',
          type,
        })),
      },
    ],
  }
}
