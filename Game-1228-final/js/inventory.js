// ============================================
// Inventory System
// ============================================

const Inventory = {
    items: [],
    maxSlots: 15,
    equippedItem: null,
    selectedIndex: -1,
    isOpen: false,

    // DOM elements
    screen: null,
    grid: null,
    details: null,
    equippedSlot: null,

    init() {
        this.screen = Utils.$('inventory-screen');
        this.grid = Utils.$('inventory-grid');
        this.details = Utils.$('item-details');
        this.equippedSlot = Utils.$('equipped-item');

        // Create inventory slots
        this.createSlots();

        // Setup event listeners
        Utils.$('btn-close-inventory').onclick = () => this.close();
        Utils.$('btn-use-item').onclick = () => this.useSelected();
        Utils.$('btn-equip-item').onclick = () => this.equipSelected();
        Utils.$('btn-drop-item').onclick = () => this.dropSelected();
    },

    createSlots() {
        this.grid.innerHTML = '';
        for (let i = 0; i < this.maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'item-slot empty';
            slot.dataset.index = i;
            slot.onclick = () => this.selectItem(i);
            this.grid.appendChild(slot);
        }
    },

    // Open inventory screen
    open() {
        this.isOpen = true;
        this.selectedIndex = -1;
        this.render();
        Utils.show(this.screen);
        Input.setEnabled(false);
    },

    // Close inventory screen
    close() {
        this.isOpen = false;
        this.selectedIndex = -1;
        Utils.hide(this.screen);
        Utils.hide(this.details);
        Input.setEnabled(true);
    },

    // Toggle inventory
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    // Add item to inventory
    addItem(itemId) {
        const item = getItem(itemId);
        if (!item) return false;

        // Check for stackable items
        if (item.stackable) {
            const existing = this.items.find(i => i.id === itemId);
            if (existing) {
                existing.count = (existing.count || 1) + 1;
                this.updateHUD();
                return true;
            }
        }

        // Check if inventory is full
        if (this.items.length >= this.maxSlots) {
            return false;
        }

        this.items.push({ id: itemId, count: 1 });
        this.updateHUD();

        // Quest trigger: When key is obtained
        if (itemId === 'key' && typeof QuestSystem !== 'undefined') {
            QuestSystem.completeQuest('find_key');
            QuestSystem.startQuest('climb_building');
        }

        // Check for full inventory achievement
        if (this.items.length >= this.maxSlots) {
            AchievementSystem.unlock('full_inventory');
        }

        return true;
    },

    // Remove item from inventory
    removeItem(itemId, count = 1) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index === -1) return false;

        const item = this.items[index];
        if (item.count > count) {
            item.count -= count;
        } else {
            this.items.splice(index, 1);
        }

        this.updateHUD();
        return true;
    },

    // Check if player has item
    hasItem(itemId) {
        return this.items.some(i => i.id === itemId);
    },

    // Get item count
    getItemCount(itemId) {
        const item = this.items.find(i => i.id === itemId);
        return item ? (item.count || 1) : 0;
    },

    // Select item
    selectItem(index) {
        if (index < 0 || index >= this.items.length) {
            this.selectedIndex = -1;
            Utils.hide(this.details);
            return;
        }

        this.selectedIndex = index;
        this.showItemDetails(this.items[index]);
        this.render();
    },

    // Show item details
    showItemDetails(inventoryItem) {
        const item = getItem(inventoryItem.id);
        if (!item) return;

        Utils.$('item-name').textContent = `${item.icon} ${item.name}`;
        Utils.$('item-desc').textContent = item.description;

        // Show/hide action buttons based on item type
        Utils.$('btn-use-item').style.display = item.canUse ? 'block' : 'none';
        Utils.$('btn-equip-item').style.display = item.canEquip ? 'block' : 'none';
        Utils.$('btn-drop-item').style.display = item.canDrop ? 'block' : 'none';

        Utils.show(this.details);
    },

    // Use selected item
    useSelected() {
        if (this.selectedIndex < 0) return;

        const inventoryItem = this.items[this.selectedIndex];
        const item = getItem(inventoryItem.id);
        if (!item || !item.canUse) return;

        const result = useItem(inventoryItem.id, Game.state);
        if (result && result.success) {
            // Apply HP change
            if (result.hpChange) {
                Game.state.hp = Utils.clamp(Game.state.hp + result.hpChange, 0, Game.state.maxHp);
                Game.updateHUD();
            }

            // Apply effects
            if (result.effects && result.effects.length > 0) {
                result.effects.forEach(effect => {
                    Game.state.tempBuffs.push(effect);
                });
            }

            // Remove if consumed
            if (result.consumed) {
                this.removeItem(inventoryItem.id);
                this.selectedIndex = -1;
                Utils.hide(this.details);
            }

            // Show message
            if (result.message) {
                this.close();
                Dialogue.showMessage(result.message);
            }

            this.render();
        }
    },

    // Equip selected item
    equipSelected() {
        if (this.selectedIndex < 0) return;

        const inventoryItem = this.items[this.selectedIndex];
        const item = getItem(inventoryItem.id);
        if (!item || !item.canEquip) return;

        // Unequip current item if any
        if (this.equippedItem) {
            this.items.push({ id: this.equippedItem, count: 1 });
        }

        // Equip new item
        this.equippedItem = inventoryItem.id;
        if (typeof Game !== 'undefined' && Game.state) {
            Game.state.equippedItem = this.equippedItem;
        }
        this.items.splice(this.selectedIndex, 1);
        this.selectedIndex = -1;
        Utils.hide(this.details);

        this.render();
        this.updateHUD();

        // Check for full inventory achievement (if we put back an item)
        if (this.items.length >= this.maxSlots) {
            AchievementSystem.unlock('full_inventory');
        }
    },

    // Unequip current item
    unequip() {
        if (!this.equippedItem) return false;

        if (this.items.length >= this.maxSlots) {
            return false;
        }

        this.items.push({ id: this.equippedItem, count: 1 });
        this.equippedItem = null;
        if (typeof Game !== 'undefined' && Game.state) {
            Game.state.equippedItem = null;
        }
        this.updateHUD();

        // Check for full inventory achievement
        if (this.items.length >= this.maxSlots) {
            AchievementSystem.unlock('full_inventory');
        }

        return true;
    },

    // Drop selected item
    dropSelected() {
        if (this.selectedIndex < 0) return;

        const item = getItem(this.items[this.selectedIndex].id);
        if (!item || !item.canDrop) return;

        Dialogue.showPrompt(`確定要丟棄 ${item.name} 嗎？`, () => {
            this.items.splice(this.selectedIndex, 1);
            this.selectedIndex = -1;
            Utils.hide(this.details);
            this.render();
        });
    },

    // Render inventory
    render() {
        const slots = this.grid.querySelectorAll('.item-slot');

        slots.forEach((slot, i) => {
            slot.innerHTML = '';
            slot.classList.remove('selected');

            if (i < this.items.length) {
                const inventoryItem = this.items[i];
                const item = getItem(inventoryItem.id);
                slot.classList.remove('empty');
                slot.innerHTML = `<span>${item.icon}</span>`;
                if (inventoryItem.count > 1) {
                    slot.innerHTML += `<span class="item-count">${inventoryItem.count}</span>`;
                }
                if (i === this.selectedIndex) {
                    slot.classList.add('selected');
                }
            } else {
                slot.classList.add('empty');
            }
        });
    },

    // Update HUD equipped item display
    updateHUD() {
        if (this.equippedItem) {
            const item = getItem(this.equippedItem);
            this.equippedSlot.innerHTML = `<span>${item.icon}</span>`;
            this.equippedSlot.classList.remove('empty');
            this.equippedSlot.title = item.name;
        } else {
            this.equippedSlot.innerHTML = '';
            this.equippedSlot.classList.add('empty');
            this.equippedSlot.title = '無裝備';
        }
    },

    // Get equipment bonus
    getEquipmentBonus() {
        if (!this.equippedItem) return { atk: 0 };

        const item = getItem(this.equippedItem);
        if (!item || !item.effects) return { atk: 0 };

        return {
            atk: item.effects.atk || 0,
            selfDamageChance: item.effects.selfDamageChance || 0,
            selfDamageMultiplier: item.effects.selfDamageMultiplier || 0
        };
    },

    // Load from save
    loadFromSave(saveData) {
        this.items = saveData.inventory || [];
        this.equippedItem = saveData.equippedItem || null;
        this.updateHUD();
    },

    // Get save data
    getSaveData() {
        return {
            inventory: this.items,
            equippedItem: this.equippedItem
        };
    }
};
