// ============================================
// Utility Functions
// ============================================

const Utils = {
    // Random integer between min and max (inclusive)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Random float between 0 and 1
    random() {
        return Math.random();
    },

    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    // Deep clone an object
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Wait for milliseconds
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Get element by ID (shorthand)
    $(id) {
        return document.getElementById(id);
    },

    // Show element
    show(element) {
        if (typeof element === 'string') element = this.$(element);
        if (element) element.classList.remove('hidden');
    },

    // Hide element
    hide(element) {
        if (typeof element === 'string') element = this.$(element);
        if (element) element.classList.add('hidden');
    },

    // Toggle element visibility
    toggle(element) {
        if (typeof element === 'string') element = this.$(element);
        if (element) element.classList.toggle('hidden');
    },

    // Add class
    addClass(element, className) {
        if (typeof element === 'string') element = this.$(element);
        if (element) element.classList.add(className);
    },

    // Remove class
    removeClass(element, className) {
        if (typeof element === 'string') element = this.$(element);
        if (element) element.classList.remove(className);
    },

    // Switch active screen
    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = this.$(screenId);
        if (screen) screen.classList.add('active');
    },

    // Create damage number effect
    showDamageNumber(x, y, damage, isCrit = false, isPlayerDamage = false) {
        const el = document.createElement('div');
        el.className = 'damage-number';
        if (isCrit) el.classList.add('crit');
        if (isPlayerDamage) {
            el.classList.add('player-damage');
        } else {
            el.classList.add('enemy-damage');
        }
        el.textContent = (isCrit ? '暴擊! ' : '') + damage;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    },

    // Show firework effect
    showFirework(x, y) {
        const el = document.createElement('div');
        el.className = 'firework';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    },

    // Shuffle array
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};

// Tile constants
const TILE_SIZE = 32;
const MAP_WIDTH = 16;
const MAP_HEIGHT = 12;
const CANVAS_WIDTH = TILE_SIZE * MAP_WIDTH;
const CANVAS_HEIGHT = TILE_SIZE * MAP_HEIGHT;

// Tile types
const TILES = {
    FLOOR: 0,
    WALL: 1,
    DOOR: 2,
    STAIRS_UP: 3,
    STAIRS_DOWN: 4,
    WATER: 5,
    GRASS: 6,
    PATH: 7,
    DESK: 8,
    CHAIR: 9,
    LOCKER: 10,
    TREE: 11,
    BENCH: 12,
    STATUE: 13,
    NPC: 14,
    ITEM: 15,
    TRIGGER: 16,
    CROSS: 17,
    BUILDING_SHENGXIN: 18,
    BUILDING_HUIQING: 19
};

// Tile colors (for procedural rendering)
const TILE_COLORS = {
    [TILES.FLOOR]: '#4a4a6a',
    [TILES.WALL]: '#2a2a4a',
    [TILES.DOOR]: '#8b4513',
    [TILES.STAIRS_UP]: '#6a8caf',
    [TILES.STAIRS_DOWN]: '#5a7c9f',
    [TILES.WATER]: '#1e90ff',
    [TILES.GRASS]: '#228b22',
    [TILES.PATH]: '#8b8b6b',
    [TILES.DESK]: '#8b7355',
    [TILES.CHAIR]: '#a0522d',
    [TILES.LOCKER]: '#708090',
    [TILES.TREE]: '#006400',
    [TILES.BENCH]: '#daa520',
    [TILES.STATUE]: '#c0c0c0',
    [TILES.NPC]: '#ff69b4',
    [TILES.ITEM]: '#ffd700',
    [TILES.TRIGGER]: '#4a4a6a',
    [TILES.CROSS]: '#ffd700',
    [TILES.BUILDING_SHENGXIN]: '#7b6850',
    [TILES.BUILDING_HUIQING]: '#6a5a7a'
};

// Collision map (true = blocked)
const TILE_COLLISION = {
    [TILES.FLOOR]: false,
    [TILES.WALL]: true,
    [TILES.DOOR]: false,
    [TILES.STAIRS_UP]: false,
    [TILES.STAIRS_DOWN]: false,
    [TILES.WATER]: true,
    [TILES.GRASS]: false,
    [TILES.PATH]: false,
    [TILES.DESK]: true,
    [TILES.CHAIR]: true,
    [TILES.LOCKER]: true,
    [TILES.TREE]: true,
    [TILES.BENCH]: true,
    [TILES.STATUE]: true,
    [TILES.NPC]: true,
    [TILES.ITEM]: false,
    [TILES.TRIGGER]: false,
    [TILES.CROSS]: false,
    [TILES.BUILDING_SHENGXIN]: true,
    [TILES.BUILDING_HUIQING]: true
};
