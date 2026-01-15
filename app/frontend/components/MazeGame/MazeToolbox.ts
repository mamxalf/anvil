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

export const createMazeToolbox = (levelConfig: LevelConfig, t?: (key: string, options?: any) => string): ToolboxConfig => {
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
      // Translate category name if generic translation function is provided,
      // but here we might just map known English names to keys manually.
      // Since map is simple: Actions -> blocks.actions, etc.

      let displayName = categoryName;
      if (t) {
        if (categoryName === 'Actions') displayName = t('maze_game.blocks.actions', { defaultValue: 'Actions' }); // You'll need to add this key or just rely on block names
        // Actually, let's keep it simple and just translate the blocks themselves in CustomBlocks.ts
        // But categories need names too.

        // Let's use hardcoded keys for now to match categoryOrder
        if (categoryName === 'Actions') displayName = 'Actions'; // Or t('...')
      }

      contents.push({
        kind: 'category',
        name: categoryName, // If we want to translate categories: t(`maze_game.categories.${categoryName.toLowerCase()}`)
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
