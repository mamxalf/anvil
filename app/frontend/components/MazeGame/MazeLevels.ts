// Level configurations for Maze Game
import { PathType, DirectionType, LevelConfig, LevelMap } from './MazeTypes';

// Re-export LevelConfig for other modules
export type { LevelConfig } from './MazeTypes';


// Level 1: Simple straight path
const level1Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 1, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Level 2: L-shaped path
const level2Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Level 3: Path with collectible
const level3Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 1, 1, 3, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Level 4: Loop path
const level4Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 2, 0, 3, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Level 5: Multiple collectibles
const level5Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 3, 0, 0],
    [0, 0, 1, 4, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 4, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 4, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 4, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Level 6: Complex path with conditional
const level6Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 3, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 2, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Level 7: Complex maze
const level7Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 2, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 1, 1, 3, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Level 8: Advanced maze
const level8Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 2, 1, 1, 0, 0, 3, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Level 9: Complex path
const level9Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 3, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Level 10: Final challenge
const level10Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 3, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 2, 1, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const LEVELS: LevelConfig[] = [
    {
        level: 1,
        map: level1Map,
        blocks: ['maze_forward'],
        maxBlocks: Infinity,
        initialDirection: DirectionType.EAST,
        collectiblesCount: 0,
    },
    {
        level: 2,
        map: level2Map,
        blocks: ['maze_forward', 'maze_turn_right'],
        maxBlocks: Infinity,
        initialDirection: DirectionType.NORTH,
        collectiblesCount: 0,
    },
    {
        level: 3,
        map: level3Map,
        blocks: ['maze_forward', 'maze_turn_right', 'maze_collect'],
        maxBlocks: Infinity,
        initialDirection: DirectionType.NORTH,
        collectiblesCount: 1,
    },
    {
        level: 4,
        map: level4Map,
        blocks: ['maze_forward', 'maze_turn_right', 'maze_collect', 'controls_repeat'],
        maxBlocks: 6,
        initialDirection: DirectionType.NORTH,
        collectiblesCount: 0,
    },
    {
        level: 5,
        map: level5Map,
        blocks: ['maze_forward', 'maze_turn_right', 'maze_turn_left', 'maze_collect', 'controls_repeat'],
        maxBlocks: Infinity,
        initialDirection: DirectionType.SOUTH,
        collectiblesCount: 4,
    },
    {
        level: 6,
        map: level6Map,
        blocks: ['maze_forward', 'controls_repeat', 'maze_if_path', 'maze_turn_left'],
        maxBlocks: 4,
        initialDirection: DirectionType.EAST,
        collectiblesCount: 0,
    },
    {
        level: 7,
        map: level7Map,
        blocks: ['maze_forward', 'controls_repeat', 'maze_if_path', 'maze_turn_right'],
        maxBlocks: 4,
        initialDirection: DirectionType.EAST,
        collectiblesCount: 0,
    },
    {
        level: 8,
        map: level8Map,
        blocks: ['maze_forward', 'controls_repeat', 'maze_if_path', 'maze_turn_right', 'maze_turn_left'],
        maxBlocks: 6,
        initialDirection: DirectionType.EAST,
        collectiblesCount: 0,
    },
    {
        level: 9,
        map: level9Map,
        blocks: ['maze_forward', 'controls_repeat', 'maze_if_path', 'maze_if_else', 'maze_turn_right', 'maze_turn_left'],
        maxBlocks: 4,
        initialDirection: DirectionType.EAST,
        collectiblesCount: 0,
    },
    {
        level: 10,
        map: level10Map,
        blocks: ['maze_forward', 'controls_repeat', 'maze_if_path', 'maze_if_else', 'maze_turn_right', 'maze_turn_left'],
        maxBlocks: Infinity,
        initialDirection: DirectionType.EAST,
        collectiblesCount: 0,
    },
];

export const getLevelConfig = (level: number): LevelConfig => {
    const index = Math.max(0, Math.min(level - 1, LEVELS.length - 1));
    return LEVELS[index];
};
