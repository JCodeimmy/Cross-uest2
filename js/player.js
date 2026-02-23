// ============================================
// Player System
// ============================================

const Player = {
    x: 0,
    y: 0,
    direction: 'down',
    isMoving: false,

    init(x, y) {
        this.x = x;
        this.y = y;
        this.direction = 'down';
        this.isMoving = false;
    },

    // Try to move in direction
    move(dx, dy, currentMap) {
        if (this.isMoving) return false;

        const newX = this.x + dx;
        const newY = this.y + dy;

        // Update direction
        if (dy < 0) this.direction = 'up';
        if (dy > 0) this.direction = 'down';
        if (dx < 0) this.direction = 'left';
        if (dx > 0) this.direction = 'right';

        // Check bounds
        if (newX < 0 || newX >= currentMap.width || newY < 0 || newY >= currentMap.height) {
            return false;
        }

        // Check collision
        const tile = currentMap.tiles[newY][newX];
        if (TILE_COLLISION[tile]) {
            return false;
        }

        // Check for NPCs blocking
        if (NPCSystem.getNPCAt(newX, newY)) {
            // Interact with NPC instead
            NPCSystem.interact(NPCSystem.getNPCAt(newX, newY));
            return false;
        }

        // Check for Enemies (Handle large enemies)
        if (currentMap.enemies) {
            for (const enemy of currentMap.enemies) {
                if (Game.state.flags[enemy.flag]) continue; // Skip defeated

                const enemyData = Enemies[enemy.enemyId];
                const width = (enemyData && enemyData.width) || 1;
                const height = (enemyData && enemyData.height) || 1;

                if (newX >= enemy.x && newX < enemy.x + width &&
                    newY >= enemy.y && newY < enemy.y + height) {

                    // Trigger Combat
                    Game.startCombat(enemy.enemyId, (victory) => {
                        if (victory) {
                            Game.state.flags[enemy.flag] = true;
                            // Re-render to clear enemy
                            Renderer.render(SceneManager.getCurrentMap());
                        }
                    });
                    return false;
                }
            }
        }

        // Move player
        this.x = newX;
        this.y = newY;

        return true;
    },

    // Get current position
    getPosition() {
        return { x: this.x, y: this.y };
    },

    // Set position directly (for scene transitions)
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    },

    // Get sprite direction for rendering
    getDirectionOffset() {
        switch (this.direction) {
            case 'up': return { row: 3 };
            case 'down': return { row: 0 };
            case 'left': return { row: 1 };
            case 'right': return { row: 2 };
            default: return { row: 0 };
        }
    }
};
