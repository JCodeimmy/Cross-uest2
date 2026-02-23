// ============================================
// Renderer (Fixed - Solid Characters & Door Icons)
// ============================================

const Renderer = {
    canvas: null,
    ctx: null,
    animFrame: 0,
    lastAnimTime: 0,

    init() {
        this.canvas = Utils.$('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
    },

    // Clear canvas
    clear() {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    },

    // Render the current map
    renderMap(mapData) {
        const tiles = mapData.tiles;

        // Render base tiles
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const tile = tiles[y][x];
                this.renderTile(x, y, tile);
            }
        }

        // Render triggers (doors, stairs) - ALWAYS show icons
        if (mapData.triggers) {
            mapData.triggers.forEach(trigger => {
                this.renderTrigger(trigger);
            });
        }

        // Render objects (only if not already picked up)
        if (mapData.objects) {
            mapData.objects.forEach(obj => {
                // Skip if this object has been picked up (flag is set)
                if (obj.oneTime && obj.flag && Game.state.flags[obj.flag]) {
                    return;
                }
                this.renderObject(obj);
            });
        }

        // Render enemies (if not defeated)
        if (mapData.enemies) {
            mapData.enemies.forEach(enemy => {
                if (!Game.state.flags[enemy.flag]) {
                    this.renderEnemy(enemy);
                }
            });
        }
    },

    // Render a single tile
    renderTile(x, y, tile) {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // Fill with tile color
        this.ctx.fillStyle = TILE_COLORS[tile] || '#4a4a6a';
        this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Add grid lines
        this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        this.ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

        // Special tile decorations
        switch (tile) {
            case TILES.DOOR:
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(px + 4, py + 2, TILE_SIZE - 8, TILE_SIZE - 4);
                this.ctx.fillStyle = '#ffd700';
                this.ctx.beginPath();
                this.ctx.arc(px + TILE_SIZE - 8, py + TILE_SIZE / 2, 3, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case TILES.STAIRS_UP:
            case TILES.STAIRS_DOWN:
                this.ctx.fillStyle = '#5a7c9f';
                for (let i = 0; i < 4; i++) {
                    const sw = TILE_SIZE - i * 6;
                    const sx = px + i * 3;
                    const sy = py + i * 6 + 4;
                    this.ctx.fillRect(sx, sy, sw, 4);
                }
                break;

            case TILES.GRASS:
                // Draw grass pattern
                this.ctx.fillStyle = '#2d5a2d';
                this.ctx.fillRect(px + 4, py + 8, 2, 6);
                this.ctx.fillRect(px + 12, py + 6, 2, 8);
                this.ctx.fillRect(px + 20, py + 10, 2, 5);
                this.ctx.fillRect(px + 26, py + 7, 2, 7);
                break;

            case TILES.TREE:
                // Draw trunk
                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(px + 12, py + 16, 8, 16);
                // Draw foliage
                this.ctx.fillStyle = '#228b22';
                this.ctx.beginPath();
                this.ctx.arc(px + 16, py + 12, 12, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case TILES.BENCH:
                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(px + 4, py + 12, TILE_SIZE - 8, 8);
                this.ctx.fillRect(px + 6, py + 20, 4, 8);
                this.ctx.fillRect(px + TILE_SIZE - 10, py + 20, 4, 8);
                break;

            case TILES.STATUE:
                this.ctx.fillStyle = '#a0a0a0';
                this.ctx.fillRect(px + 8, py + 20, 16, 12);
                this.ctx.beginPath();
                this.ctx.arc(px + 16, py + 12, 8, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case TILES.DESK:
                this.ctx.fillStyle = '#a0825a';
                this.ctx.fillRect(px + 2, py + 8, TILE_SIZE - 4, TILE_SIZE - 12);
                this.ctx.fillStyle = '#8b7355';
                this.ctx.fillRect(px + 4, py + 10, TILE_SIZE - 8, TILE_SIZE - 16);
                break;

            case TILES.CHAIR:
                this.ctx.fillStyle = '#b06030';
                this.ctx.fillRect(px + 8, py + 4, 16, 4);
                this.ctx.fillRect(px + 10, py + 8, 12, 16);
                this.ctx.fillRect(px + 10, py + 24, 4, 6);
                this.ctx.fillRect(px + 18, py + 24, 4, 6);
                break;

            case TILES.LOCKER:
                this.ctx.fillStyle = '#708090';
                this.ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                this.ctx.fillStyle = '#505868';
                this.ctx.fillRect(px + 4, py + 4, 10, TILE_SIZE - 8);
                this.ctx.fillRect(px + 18, py + 4, 10, TILE_SIZE - 8);
                // Handle
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(px + 12, py + 14, 2, 4);
                this.ctx.fillRect(px + 26, py + 14, 2, 4);
                break;

            case TILES.WATER:
                this.ctx.fillStyle = '#1e70c0';
                this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
                this.ctx.fillRect(px + 4, py + 8, 12, 2);
                this.ctx.fillRect(px + 16, py + 16, 8, 2);
                break;

            case TILES.CROSS:
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(px + 14, py + 2, 4, 28);
                this.ctx.fillRect(px + 6, py + 8, 20, 4);
                // Glow effect
                this.ctx.shadowColor = '#ffd700';
                this.ctx.shadowBlur = 10;
                this.ctx.fillRect(px + 14, py + 2, 4, 28);
                this.ctx.shadowBlur = 0;
                break;

            case TILES.BUILDING_SHENGXIN:
                // Shengxin Building - Tan/Brown
                this.ctx.fillStyle = '#8b7355';
                this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                // Roof
                this.ctx.fillStyle = '#6b5344';
                this.ctx.fillRect(px, py, TILE_SIZE, 6);
                // Windows
                this.ctx.fillStyle = '#87ceeb';
                this.ctx.fillRect(px + 4, py + 10, 8, 8);
                this.ctx.fillRect(px + 20, py + 10, 8, 8);
                this.ctx.fillRect(px + 4, py + 22, 8, 6);
                this.ctx.fillRect(px + 20, py + 22, 8, 6);
                // Window frames
                this.ctx.strokeStyle = '#4a3728';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(px + 4, py + 10, 8, 8);
                this.ctx.strokeRect(px + 20, py + 10, 8, 8);
                // Label
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 8px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('聖', px + 16, py + 4);
                break;

            case TILES.BUILDING_HUIQING:
                // Huiqing Building - Purple/Gray
                this.ctx.fillStyle = '#7a6a8a';
                this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                // Roof with cross
                this.ctx.fillStyle = '#5a4a6a';
                this.ctx.fillRect(px, py, TILE_SIZE, 6);
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(px + 14, py + 1, 4, 5);
                this.ctx.fillRect(px + 12, py + 3, 8, 2);
                // Windows
                this.ctx.fillStyle = '#b0c4de';
                this.ctx.fillRect(px + 4, py + 10, 8, 8);
                this.ctx.fillRect(px + 20, py + 10, 8, 8);
                this.ctx.fillRect(px + 4, py + 22, 8, 6);
                this.ctx.fillRect(px + 20, py + 22, 8, 6);
                // Window frames
                this.ctx.strokeStyle = '#4a3a5a';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(px + 4, py + 10, 8, 8);
                this.ctx.strokeRect(px + 20, py + 10, 8, 8);
                // Label
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 8px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('會', px + 16, py + 4);
                break;
        }
    },

    // Render object (items on map)
    renderObject(obj) {
        const px = obj.x * TILE_SIZE;
        const py = obj.y * TILE_SIZE;

        // Draw glowing background
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 14, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw icon
        this.ctx.font = '22px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(obj.icon, px + TILE_SIZE / 2, py + TILE_SIZE / 2);
    },

    // Render trigger (doors, stairs) - ALWAYS render icons
    renderTrigger(trigger) {
        const px = trigger.x * TILE_SIZE;
        const py = trigger.y * TILE_SIZE;

        // Determine icon based on trigger type
        let icon = trigger.icon;
        if (!icon) {
            switch (trigger.type) {
                case 'door':
                    icon = '🚪';
                    break;
                case 'stairs':
                    icon = '🔻';
                    break;
                case 'locked_door':
                    icon = '🔒';
                    break;
                case 'sewer':
                    icon = '🕳️';
                    break;
                case 'ending':
                    icon = '✨';
                    break;
                default:
                    icon = '❓';
            }
        }

        // Draw a subtle highlight
        this.ctx.fillStyle = 'rgba(100, 200, 255, 0.2)';
        this.ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);

        // Draw icon
        this.ctx.font = '20px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(icon, px + TILE_SIZE / 2, py + TILE_SIZE / 2);
    },

    // Render enemy on map
    renderEnemy(enemy) {
        const enemyData = Enemies[enemy.enemyId];
        if (!enemyData) return;

        const width = enemyData.width || 1;
        const height = enemyData.height || 1;
        const px = enemy.x * TILE_SIZE;
        const py = enemy.y * TILE_SIZE;
        const pixelWidth = width * TILE_SIZE;
        const pixelHeight = height * TILE_SIZE;

        // Draw danger zone
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        this.ctx.fillRect(px, py, pixelWidth, pixelHeight);

        // Draw shadow
        this.ctx.fillStyle = 'rgba(0,0,0,0.4)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + pixelWidth / 2, py + pixelHeight - 4, pixelWidth / 2.5, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw enemy icon (scaled)
        // Adjust font size based on size
        const fontSize = 24 * Math.min(width, height);
        this.ctx.font = `${fontSize}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(enemyData.icon, px + pixelWidth / 2, py + pixelHeight / 2);

        // Exclamation mark
        this.ctx.fillStyle = '#ff4444';
        this.ctx.font = 'bold 16px sans-serif';
        this.ctx.fillText('!', px + pixelWidth / 2, py - 2);
    },

    // Render NPCs
    renderNPCs() {
        NPCSystem.npcs.forEach(npc => {
            const px = npc.x * TILE_SIZE;
            const py = npc.y * TILE_SIZE;

            // Draw shadow
            this.ctx.fillStyle = 'rgba(0,0,0,0.4)';
            this.ctx.beginPath();
            this.ctx.ellipse(px + TILE_SIZE / 2, py + TILE_SIZE - 4, 10, 4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw NPC icon
            this.ctx.font = '24px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(npc.icon, px + TILE_SIZE / 2, py + TILE_SIZE / 2);
        });
    },

    // Render player - SOLID character with colored body
    renderPlayer() {
        const px = Player.x * TILE_SIZE;
        const py = Player.y * TILE_SIZE;

        // Draw shadow
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.beginPath();
        this.ctx.ellipse(px + TILE_SIZE / 2, py + TILE_SIZE - 3, 11, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Character colors
        const charColors = [
            { body: '#4a90d9', head: '#ffe0bd', hair: '#4a3728' }, // 勇者 - 藍色
            { body: '#9b59b6', head: '#ffe0bd', hair: '#2c2c2c' }, // 智者 - 紫色
            { body: '#e74c3c', head: '#ffe0bd', hair: '#8b4513' }  // 勇士 - 紅色
        ];
        const colors = charColors[Game.state.characterId] || charColors[0];

        // Draw body (torso)
        this.ctx.fillStyle = colors.body;
        this.ctx.fillRect(px + 8, py + 14, 16, 14);

        // Draw legs
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(px + 9, py + 26, 5, 5);
        this.ctx.fillRect(px + 18, py + 26, 5, 5);

        // Draw arms
        this.ctx.fillStyle = colors.body;
        this.ctx.fillRect(px + 4, py + 15, 4, 10);
        this.ctx.fillRect(px + 24, py + 15, 4, 10);

        // Draw head
        this.ctx.fillStyle = colors.head;
        this.ctx.beginPath();
        this.ctx.arc(px + 16, py + 10, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw hair
        this.ctx.fillStyle = colors.hair;
        this.ctx.beginPath();
        this.ctx.arc(px + 16, py + 8, 8, Math.PI, Math.PI * 2);
        this.ctx.fill();

        // Draw eyes based on direction
        this.ctx.fillStyle = '#2c3e50';
        if (Player.direction === 'left') {
            this.ctx.fillRect(px + 11, py + 9, 2, 2);
        } else if (Player.direction === 'right') {
            this.ctx.fillRect(px + 19, py + 9, 2, 2);
        } else {
            this.ctx.fillRect(px + 12, py + 9, 2, 2);
            this.ctx.fillRect(px + 18, py + 9, 2, 2);
        }

        // Draw equipped item if any
        if (Inventory.equippedItem) {
            const item = getItem(Inventory.equippedItem);
            if (item) {
                this.ctx.font = '14px sans-serif';
                this.ctx.fillText(item.icon, px + 28, py + 20);
            }
        }
    },

    // Main render function
    render(mapData) {
        this.clear();
        this.renderMap(mapData);
        this.renderNPCs();
        this.renderPlayer();
    }
};
