// ============================================
// Input Handler (Fixed - Smoother Movement)
// ============================================

const Input = {
    keys: {},
    lastKey: null,
    keyBuffer: [],
    enabled: true,
    moveDelay: 100, // Faster movement delay for smoother feel
    lastMoveTime: 0,

    init() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    },

    onKeyDown(e) {
        const key = e.key.toLowerCase();

        // Prevent default for game keys
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'z', 'enter', 'i', 'q', 'escape', ' '].includes(key)) {
            e.preventDefault();
        }

        if (!this.keys[key]) {
            this.keys[key] = true;
            this.lastKey = key;
            if (this.enabled) {
                this.keyBuffer.push(key);
            }
        }
    },

    onKeyUp(e) {
        const key = e.key.toLowerCase();
        this.keys[key] = false;
    },

    isPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    },

    // Check if any movement key is pressed
    isMoving() {
        return this.isPressed('arrowup') || this.isPressed('arrowdown') ||
            this.isPressed('arrowleft') || this.isPressed('arrowright') ||
            this.isPressed('w') || this.isPressed('a') ||
            this.isPressed('s') || this.isPressed('d');
    },

    // Get movement direction
    getMovementDirection() {
        if (this.isPressed('arrowup') || this.isPressed('w')) return { dx: 0, dy: -1 };
        if (this.isPressed('arrowdown') || this.isPressed('s')) return { dx: 0, dy: 1 };
        if (this.isPressed('arrowleft') || this.isPressed('a')) return { dx: -1, dy: 0 };
        if (this.isPressed('arrowright') || this.isPressed('d')) return { dx: 1, dy: 0 };
        return null;
    },

    // Check if action key is pressed (Z or Enter)
    isActionPressed() {
        return this.isPressed('z') || this.isPressed('enter');
    },

    // Check if inventory key is pressed (I)
    isInventoryPressed() {
        return this.isPressed('i');
    },

    // Check if equip key is pressed (Q)
    isEquipPressed() {
        return this.isPressed('q');
    },

    // Check if escape key is pressed
    isEscapePressed() {
        return this.isPressed('escape');
    },

    // Get and clear key buffer
    consumeKeyBuffer() {
        const buffer = [...this.keyBuffer];
        this.keyBuffer = [];
        return buffer;
    },

    // Check if can move (with delay for smooth continuous movement)
    canMove() {
        const now = Date.now();
        if (now - this.lastMoveTime >= this.moveDelay) {
            this.lastMoveTime = now;
            return true;
        }
        return false;
    },

    // Enable/disable input
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.keyBuffer = [];
        }
    },

    // Clear all input state
    clear() {
        this.keys = {};
        this.keyBuffer = [];
        this.lastKey = null;
    }
};
