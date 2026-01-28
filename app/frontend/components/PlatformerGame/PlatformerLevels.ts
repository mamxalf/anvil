// Level configurations for Platformer Game

import type { PlatformerLevelConfig } from './PlatformerTypes'

// Level 1: Movement basics - straight line to goal
// Player starts at x=50, needs 9 "move_right" blocks to reach goal at x=500
// Platform at y=370, player height=32, so spawn/goal Y = 370-32 = 338
export const level1: PlatformerLevelConfig = {
    level: 1,
    worldWidth: 600,
    worldHeight: 400,
    spawnX: 50,
    spawnY: 338, // 370 (platform) - 32 (player height)
    goalX: 500, // 50 + (9 * 50) = 500 → exactly 9 steps
    goalY: 338,
    platforms: [
        [0, 370, 600, 30], // Single floor
    ],
    obstacles: [],
    collectibles: [],
    availableBlocks: ['move_right'],
    maxBlocks: 10,
    requiredCollectibles: 0,
}

// Level 2: Introduction to jumping over a gap
export const level2: PlatformerLevelConfig = {
    level: 2,
    worldWidth: 700,
    worldHeight: 400,
    spawnX: 50,
    spawnY: 338, // 370 - 32
    goalX: 600,
    goalY: 338,
    platforms: [
        [0, 370, 250, 30], // Start platform (ends at x=250)
        [350, 370, 350, 30], // Goal platform (100px gap from 250 to 350)
    ],
    obstacles: [],
    collectibles: [[300, 330, 'coin']], // Coin in air above gap
    availableBlocks: ['move_right', 'jump_right'],
    maxBlocks: 8,
    requiredCollectibles: 0,
}

// Level 3: Multiple platforms, need jump + move
export const level3: PlatformerLevelConfig = {
    level: 3,
    worldWidth: 800,
    worldHeight: 400,
    spawnX: 50,
    spawnY: 338, // 370 - 32
    goalX: 700,
    goalY: 338,
    platforms: [
        [0, 370, 200, 30], // Start
        [250, 320, 100, 30], // Higher platform
        [400, 270, 100, 30], // Higher
        [550, 320, 100, 30], // Down
        [650, 370, 150, 30], // Goal
    ],
    obstacles: [],
    collectibles: [],
    availableBlocks: ['move_right', 'move_left', 'jump', 'jump_right'],
    maxBlocks: 15,
    requiredCollectibles: 0,
}

// Level 4: Use repeat to cross repeated platforms (20px gaps)
export const level4: PlatformerLevelConfig = {
    level: 4,
    worldWidth: 700,
    worldHeight: 400,
    spawnX: 50,
    spawnY: 338,
    goalX: 650,
    goalY: 338,
    platforms: [
        [0, 370, 100, 30],
        [120, 370, 100, 30],
        [240, 370, 100, 30],
        [360, 370, 100, 30],
        [480, 370, 100, 30],
        [600, 370, 100, 30],
    ],
    obstacles: [],
    collectibles: [],
    availableBlocks: ['move_right', 'jump_right', 'repeat'],
    maxBlocks: 5, // Force use of repeat
    requiredCollectibles: 0,
}

// Level 5: Jump + repeat pattern
export const level5: PlatformerLevelConfig = {
    level: 5,
    worldWidth: 800,
    worldHeight: 400,
    spawnX: 50,
    spawnY: 338,
    goalX: 700,
    goalY: 338,
    platforms: [
        [0, 370, 100, 30],
        [120, 300, 100, 30], // Up
        [240, 370, 100, 30], // Down
        [360, 300, 100, 30], // Up
        [480, 370, 100, 30], // Down
        [600, 370, 150, 30], // Goal
    ],
    obstacles: [],
    collectibles: [
        [180, 260, 'coin'],
        [420, 260, 'coin'],
    ],
    availableBlocks: ['move_right', 'jump', 'jump_right', 'jump_left', 'repeat'],
    maxBlocks: 10,
    requiredCollectibles: 0,
}

// Level 6: Collect all coins with repeat
export const level6: PlatformerLevelConfig = {
    level: 6,
    worldWidth: 900,
    worldHeight: 400,
    spawnX: 50,
    spawnY: 338,
    goalX: 800,
    goalY: 338,
    platforms: [
        [0, 370, 900, 30], // Long floor
    ],
    obstacles: [],
    collectibles: [
        [150, 340, 'coin'],
        [250, 340, 'coin'],
        [350, 340, 'coin'],
        [450, 340, 'coin'],
        [550, 340, 'coin'],
        [650, 340, 'coin'],
    ],
    availableBlocks: ['move_right', 'jump', 'repeat'],
    maxBlocks: 6,
    requiredCollectibles: 6, // Must collect all
}

// Level 7: Introduction to conditionals (spike ahead)
export const level7: PlatformerLevelConfig = {
    level: 7,
    worldWidth: 700,
    worldHeight: 400,
    spawnX: 50,
    spawnY: 338,
    goalX: 600,
    goalY: 338,
    platforms: [[0, 370, 700, 30]],
    obstacles: [
        [200, 350, 30, 20, 'spike'], // Spike on ground
        [350, 350, 30, 20, 'spike'], // Another spike
        [500, 350, 30, 20, 'spike'], // Third spike
    ],
    collectibles: [],
    availableBlocks: ['move_right', 'jump', 'if_spike_ahead', 'repeat'],
    maxBlocks: 10,
    requiredCollectibles: 0,
}

// Level 8: Gaps with conditional
export const level8: PlatformerLevelConfig = {
    level: 8,
    worldWidth: 800,
    worldHeight: 400,
    spawnX: 50,
    spawnY: 338,
    goalX: 700,
    goalY: 338,
    platforms: [
        [0, 370, 200, 30], // Start
        [300, 370, 100, 30], // After gap 1
        [500, 370, 100, 30], // After gap 2
        [650, 370, 150, 30], // Goal
    ],
    obstacles: [],
    collectibles: [
        [250, 280, 'coin'],
        [450, 280, 'coin'],
    ],
    availableBlocks: ['move_right', 'jump_right', 'if_gap_ahead', 'repeat'],
    maxBlocks: 12,
    requiredCollectibles: 0,
}

// Level 9: Combined challenge: spikes + gaps + coins
export const level9: PlatformerLevelConfig = {
    level: 9,
    worldWidth: 1000,
    worldHeight: 400,
    spawnX: 50,
    spawnY: 338,
    goalX: 900,
    goalY: 338,
    platforms: [
        [0, 370, 150, 30],
        [200, 320, 100, 30],
        [350, 370, 100, 30],
        [500, 300, 100, 30],
        [650, 370, 150, 30],
        [850, 370, 150, 30],
    ],
    obstacles: [
        [400, 350, 30, 20, 'spike'],
        [700, 350, 30, 20, 'spike'],
        [780, 350, 30, 20, 'spike'],
    ],
    collectibles: [
        [250, 280, 'coin'],
        [400, 260, 'coin'],
        [550, 260, 'coin'],
        [750, 340, 'coin'],
    ],
    availableBlocks: [
        'move_right',
        'move_left',
        'jump',
        'jump_right',
        'jump_left',
        'if_spike_ahead',
        'if_gap_ahead',
        'repeat',
    ],
    maxBlocks: 18,
    requiredCollectibles: 3,
}

// Level 10: Final boss level
export const level10: PlatformerLevelConfig = {
    level: 10,
    worldWidth: 1200,
    worldHeight: 450,
    spawnX: 50,
    spawnY: 368, // 400 - 32
    goalX: 1100,
    goalY: 368,
    platforms: [
        [0, 400, 150, 30],
        [180, 350, 80, 30],
        [300, 300, 80, 30],
        [420, 350, 80, 30],
        [540, 400, 150, 30],
        [720, 350, 80, 30],
        [840, 300, 80, 30],
        [960, 350, 80, 30],
        [1050, 400, 150, 30],
    ],
    obstacles: [
        [230, 330, 30, 20, 'spike'],
        [580, 380, 30, 20, 'spike'],
        [620, 380, 30, 20, 'spike'],
        [880, 330, 30, 20, 'spike'],
    ],
    collectibles: [
        [220, 260, 'gem'],
        [340, 260, 'gem'],
        [520, 360, 'coin'],
        [680, 360, 'coin'],
        [780, 260, 'gem'],
        [900, 260, 'gem'],
        [1000, 310, 'coin'],
    ],
    availableBlocks: [
        'move_right',
        'move_left',
        'jump',
        'jump_right',
        'jump_left',
        'if_spike_ahead',
        'if_gap_ahead',
        'repeat',
    ],
    maxBlocks: 25,
    requiredCollectibles: 5,
}

// Level lookup function
export function getLevelConfig(level: number): PlatformerLevelConfig {
    const levels: Record<number, PlatformerLevelConfig> = {
        1: level1,
        2: level2,
        3: level3,
        4: level4,
        5: level5,
        6: level6,
        7: level7,
        8: level8,
        9: level9,
        10: level10,
    }

    return levels[level] || level1
}
