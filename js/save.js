// ============================================
// Save System
// ============================================

const SAVE_KEY = 'cross_quest_saves';
const MAX_SAVES = 3;

const SaveSystem = {
    // Get all saves
    getAllSaves() {
        try {
            const data = localStorage.getItem(SAVE_KEY);
            return data ? JSON.parse(data) : [null, null, null];
        } catch (e) {
            console.error('Error loading saves:', e);
            return [null, null, null];
        }
    },

    // Get specific save slot
    getSave(slot) {
        const saves = this.getAllSaves();
        return saves[slot] || null;
    },

    // Save game to slot
    save(slot, gameState) {
        try {
            const saves = this.getAllSaves();
            saves[slot] = {
                timestamp: Date.now(),
                date: new Date().toLocaleString('zh-TW'),
                characterId: gameState.characterId,
                characterName: gameState.characterName,
                currentMap: gameState.currentMap,
                playerX: gameState.playerX,
                playerY: gameState.playerY,
                hp: gameState.hp,
                maxHp: gameState.maxHp,
                atk: gameState.atk,
                cr: gameState.cr,
                cd: gameState.cd,
                inventory: gameState.inventory,
                equippedItem: gameState.equippedItem,
                flags: gameState.flags,
                fragmentCount: gameState.fragmentCount || 0,
                easterEggCount: gameState.easterEggCount || 0,
                playTime: gameState.playTime || 0,
                noWrongAnswers: gameState.noWrongAnswers !== undefined ? gameState.noWrongAnswers : true
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
            return true;
        } catch (e) {
            console.error('Error saving game:', e);
            return false;
        }
    },

    // Delete save slot
    deleteSave(slot) {
        try {
            const saves = this.getAllSaves();
            saves[slot] = null;
            localStorage.setItem(SAVE_KEY, JSON.stringify(saves));
            return true;
        } catch (e) {
            console.error('Error deleting save:', e);
            return false;
        }
    },

    // Format save info for display
    formatSaveInfo(save) {
        if (!save) return '空白';
        return `${save.characterName} | ${save.date} | HP: ${save.hp}/${save.maxHp}`;
    },

    // Create initial game state
    createNewGame(characterId) {
        const characters = [
            { id: 0, name: '勇者', hp: 100, maxHp: 100, atk: 10, cr: 10, cd: 1.5 },
            { id: 1, name: '智者', hp: 80, maxHp: 80, atk: 8, cr: 20, cd: 1.5 },
            { id: 2, name: '勇士', hp: 120, maxHp: 120, atk: 12, cr: 5, cd: 1.5 },
            { id: 3, name: '開發者專屬', hp: 100, maxHp: 100, atk: 100, cr: 100, cd: 1.5 }
        ];

        const char = characters[characterId] || characters[0];

        return {
            characterId: char.id,
            characterName: char.name,
            currentMap: 'classroom_4f',
            playerX: 8,
            playerY: 6,
            hp: char.hp,
            maxHp: char.maxHp,
            atk: char.atk,
            cr: char.cr,
            cd: char.cd,
            inventory: [],
            equippedItem: null,
            flags: {},
            fragmentCount: 0,
            easterEggCount: 0,
            playTime: 0,
            tempBuffs: [],
            noWrongAnswers: true
        };
    }
};
