# Maze Game Developer Guide

Panduan untuk membuat maze game baru dengan asset dan konfigurasi yang berbeda.

## Struktur Folder

```
app/frontend/components/MazeGame/
├── MazeTypes.ts      # Type definitions
├── MazeLevels.ts     # Level configurations
├── MazeEngine.ts     # Game logic & rendering
├── MazeInterpreter.ts # Code execution
├── MazeToolbox.ts    # Dynamic Blockly toolbox
├── MazeGame.tsx      # React component
└── index.ts          # Exports

public/images/maze/
├── idle.png          # Character idle sprite sheet
├── front_jump.png    # Jump animation (south)
├── back_jump.png     # Jump animation (north)
├── left_jump.png     # Jump animation (west)
├── right_jump.png    # Jump animation (east)
├── turn.png          # Turn animation sprite
├── carrot.png        # Collectible item
├── level1.jpg        # Level 1 background (500x500px)
├── level2.jpg        # ... up to level10.jpg
└── number/           # Counter sprites (0.png - 9.png)
```

---

## Cara Membuat Game Baru dengan Asset Berbeda

### 1. Siapkan Asset Baru

Buat folder baru di `public/images/`:

```bash
mkdir -p public/images/my_new_game/number
```

Asset yang dibutuhkan:

| File | Deskripsi | Format |
|------|-----------|--------|
| `idle.png` | Sprite sheet karakter idle (4 arah) | 600x210px |
| `front_jump.png` | Animasi lompat ke depan (8 frame) | 1200x320px |
| `back_jump.png` | Animasi lompat ke belakang | 1200x320px |
| `left_jump.png` | Animasi lompat ke kiri | 1200x320px |
| `right_jump.png` | Animasi lompat ke kanan | 1200x320px |
| `turn.png` | Animasi putar (8 frame) | 1200x210px |
| `carrot.png` | Collectible item | 50x50px |
| `level1.jpg` - `level10.jpg` | Background per level | 500x500px |
| `number/0.png` - `9.png` | Digit counter | 11x21px |

### 2. Buat Folder Komponen Baru

```bash
mkdir -p app/frontend/components/MyNewGame
```

### 3. Copy dan Modifikasi File

Copy semua file dari `MazeGame/` ke `MyNewGame/`:

```bash
cp app/frontend/components/MazeGame/*.ts* app/frontend/components/MyNewGame/
```

### 4. Update Asset Path di Engine

Edit `MyNewGame/MazeEngine.ts`:

```typescript
// Ubah path asset
const ASSET_BASE = '/images/my_new_game/';
```

### 5. Modifikasi Level Maps (Opsional)

Edit `MyNewGame/MazeLevels.ts` untuk mengubah layout maze:

```typescript
// Level map format: 10x10 grid
// 0 = Wall, 1 = Path, 2 = Start, 3 = Finish, 4 = Collectible

const level1Map: LevelMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 1, 1, 1, 3, 0, 0, 0],  // 2=start, 3=finish
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // ... dst
];

// Konfigurasi per level
{
    level: 1,
    map: level1Map,
    blocks: ['maze_forward', 'maze_turn_right'],  // Block yang tersedia
    maxBlocks: 6,  // Limit block (atau Infinity)
    initialDirection: DirectionType.EAST,
    collectiblesCount: 0,  // Jumlah collectible yang harus dikumpulkan
}
```

### 6. Tambahkan Block Baru (Opsional)

Edit `app/frontend/components/Blockly/CustomBlocks.ts`:

```typescript
Blockly.Blocks['my_new_action'] = {
    init: function () {
        this.jsonInit({
            type: 'my_new_action',
            message0: '🎮 New Action',
            previousStatement: null,
            nextStatement: null,
            colour: 208,
            tooltip: 'Deskripsi action',
        });
    },
};
```

Tambahkan generator di `Generator.ts`:

```typescript
javascriptGenerator.forBlock['my_new_action'] = function (_block) {
    return 'myNewAction();\n';
};
```

### 7. Buat Page Baru

Buat file `app/frontend/Pages/Student/MyNewGame/Index.tsx`:

```tsx
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { MyNewGame } from '@/components/MyNewGame';

const MyNewGameIndex = () => (
    <StudentLayout>
        <Head title="My New Game" />
        <div className="h-[calc(100vh-100px)] p-4">
            <MyNewGame initialLevel={1} />
        </div>
    </StudentLayout>
);

export default MyNewGameIndex;
```

### 8. Tambahkan Route

Edit `config/routes.rb`:

```ruby
namespace :student do
  # ... existing routes
  get 'my_new_game', to: 'my_new_game#index'
end
```

Buat controller `app/controllers/student/my_new_game_controller.rb`:

```ruby
class Student::MyNewGameController < ApplicationController
  def index
    render inertia: "Student/MyNewGame/Index"
  end
end
```

---

## Customization Guide

### Mengubah Ukuran Grid

Edit `MazeTypes.ts`:

```typescript
export const MAZE_WIDTH = 600;  // Ubah ukuran canvas
export const MAZE_HEIGHT = 600;
export const GRID_COLS = 12;    // Ubah jumlah kolom
export const GRID_ROWS = 12;    // Ubah jumlah baris
```

> ⚠️ Update juga level maps di `MazeLevels.ts` sesuai ukuran baru

### Mengubah Kecepatan Animasi

Edit `MazeEngine.ts`:

```typescript
// Di animateMoveForward()
const steps = 8;  // Lebih banyak = lebih lambat
const stepSize = SQUARE_SIZE / steps;
```

### Menambah Action Baru

1. Tambahkan method di `MazeEngine.ts`:
```typescript
public async jump(): Promise<void> {
    // Implementasi animasi jump
}
```

2. Register di `MazeInterpreter.ts`:
```typescript
jump: async () => {
    await this.engine.jump();
    await this.delay(300);
},
```

3. Buat block dan generator (lihat langkah 6)

---

## Tips

- Background images harus 500x500px untuk match dengan canvas size
- Sprite sheet harus konsisten formatnya (frame width 150px)
- Test setiap level setelah mengubah map
- Gunakan browser DevTools untuk debug jika ada error

---

## File Reference

| File | Fungsi |
|------|--------|
| `MazeTypes.ts` | Enum dan interface |
| `MazeLevels.ts` | Konfigurasi 10 level |
| `MazeEngine.ts` | Core game logic |
| `MazeInterpreter.ts` | Execute Blockly code |
| `MazeToolbox.ts` | Generate toolbox per level |
| `MazeGame.tsx` | UI component |
