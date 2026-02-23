// ============================================
// Scene Manager (Fixed - Adjacent Interaction)
// ============================================

const SceneManager = {
    currentMap: null,
    currentMapId: null,

    // Load a map
    loadMap(mapId, playerX = null, playerY = null) {
        const mapData = getMap(mapId);
        if (!mapData) {
            console.error('Map not found:', mapId);
            return;
        }

        this.currentMap = Utils.clone(mapData);
        this.currentMapId = mapId;

        if (playerX !== null && playerY !== null) {
            Player.setPosition(playerX, playerY);
        } else {
            Player.setPosition(mapData.playerSpawn.x, mapData.playerSpawn.y);
        }

        NPCSystem.loadMapNPCs(this.currentMap);
        Utils.$('scene-name').textContent = mapData.name;

        Game.state.currentMap = mapId;
        Game.state.playerX = Player.x;
        Game.state.playerY = Player.y;

        // Burning Broom Notification in Sewage Palace
        if (mapId === 'sewage_palace' && Game.state.equippedItem === 'burning_broom' && !Game.state.flags['broom_warned']) {
            Game.state.flags['broom_warned'] = true;
            setTimeout(() => {
                Dialogue.showMessage('警告：這裡的汙穢氣息壓制了火焰...\n燃燒掃把已失去功效！');
            }, 500);
        }

        // Pollution Warning
        if (mapId === 'sewer_deeper' || mapId === 'sewage_palace') {
            setTimeout(() => {
                if (!Game.state.flags['pollution_warned']) {
                    Dialogue.showMessage('警告：這裡的空氣充滿了劇毒髒汙！\n每走一步都有可能受到傷害！');
                    Game.state.flags['pollution_warned'] = true;
                }
            }, 1000);
        }

        // Explorer achievement for entering hidden sewer
        if (mapId === 'sewer_hidden' && !Game.state.flags['explorer_unlocked']) {
            Game.state.flags['explorer_unlocked'] = true;
            AchievementSystem.unlock('explorer');

            Game.state.flags['explorer_unlocked'] = true;
            AchievementSystem.unlock('explorer');
        }

        // Start side/hidden quest when entering sewer (ensure it's active)
        if (mapId === 'sewer_hidden' && typeof QuestSystem !== 'undefined') {
            QuestSystem.startQuest('defeat_octopus');
        }

        // Complete climb_building quest when reaching rooftop
        if (mapId === 'rooftop' && typeof QuestSystem !== 'undefined') {
            QuestSystem.completeQuest('climb_building');
        }

        console.log('Loaded map:', mapId);
    },

    // Check triggers at player position (TOUCH triggers - when walking onto tile)
    checkTouchTriggers() {
        if (!this.currentMap) return false;

        const px = Player.x;
        const py = Player.y;

        // Check enemy encounters (touch trigger)
        if (this.currentMap.enemies) {
            for (const enemy of this.currentMap.enemies) {
                if (enemy.x === px && enemy.y === py) {
                    if (enemy.oneTime && Game.state.flags[enemy.flag]) continue;
                    this.handleEnemy(enemy);
                    return true;
                }
            }
        }

        // Check door/stairs triggers (touch trigger)
        if (this.currentMap.triggers) {
            for (const trigger of this.currentMap.triggers) {
                if (trigger.x === px && trigger.y === py) {
                    this.handleTrigger(trigger);
                    return true;
                }
            }
        }

        return false;
    },

    // Check for adjacent interactables (ACTION triggers - when pressing Z/Enter)
    checkActionTriggers() {
        if (!this.currentMap) return false;

        const px = Player.x;
        const py = Player.y;

        // Get the tile player is facing
        const facingPos = this.getFacingPosition(px, py);

        // First check at facing position
        if (this.tryInteractAt(facingPos.x, facingPos.y)) {
            return true;
        }

        // Then check all 4 adjacent tiles
        const directions = [
            { x: px, y: py - 1 },     // up
            { x: px, y: py + 1 },     // down
            { x: px - 1, y: py },     // left
            { x: px + 1, y: py }      // right
        ];

        for (const pos of directions) {
            if (pos.x === facingPos.x && pos.y === facingPos.y) continue; // Skip facing (already checked)
            if (this.tryInteractAt(pos.x, pos.y)) {
                return true;
            }
        }

        // Also check current position for items
        if (this.tryInteractAt(px, py)) {
            return true;
        }

        return false;
    },

    // Get position player is facing
    getFacingPosition(px, py) {
        switch (Player.direction) {
            case 'up': return { x: px, y: py - 1 };
            case 'down': return { x: px, y: py + 1 };
            case 'left': return { x: px - 1, y: py };
            case 'right': return { x: px + 1, y: py };
            default: return { x: px, y: py + 1 };
        }
    },

    // Try to interact with something at position
    tryInteractAt(x, y) {
        // Check NPC
        const npc = NPCSystem.getNPCAt(x, y);
        if (npc) {
            NPCSystem.interact(npc);
            return true;
        }

        // Check objects
        if (this.currentMap.objects) {
            for (const obj of this.currentMap.objects) {
                if (obj.x === x && obj.y === y) {
                    if (obj.oneTime && obj.flag && Game.state.flags[obj.flag]) {
                        continue;
                    }
                    this.handleObject(obj);
                    return true;
                }
            }
        }

        return false;
    },

    // Get adjacent interactable (for showing prompt)
    getAdjacentInteractable() {
        if (!this.currentMap) return null;

        const px = Player.x;
        const py = Player.y;

        // Check facing position first
        const facingPos = this.getFacingPosition(px, py);
        const facing = this.getInteractableAt(facingPos.x, facingPos.y);
        if (facing) return facing;

        // Check all adjacent tiles
        const directions = [
            { x: px, y: py - 1 },
            { x: px, y: py + 1 },
            { x: px - 1, y: py },
            { x: px + 1, y: py }
        ];

        for (const pos of directions) {
            const interactable = this.getInteractableAt(pos.x, pos.y);
            if (interactable) return interactable;
        }

        // Check current position
        return this.getInteractableAt(px, py);
    },

    // Get interactable at position
    getInteractableAt(x, y) {
        // Check NPC
        const npc = NPCSystem.getNPCAt(x, y);
        if (npc) {
            return { type: 'npc', name: npc.name, data: npc };
        }

        // Check objects
        if (this.currentMap && this.currentMap.objects) {
            for (const obj of this.currentMap.objects) {
                if (obj.x === x && obj.y === y) {
                    if (obj.oneTime && obj.flag && Game.state.flags[obj.flag]) {
                        continue;
                    }
                    const item = getItem(obj.itemId);
                    return { type: 'object', name: item ? item.name : '物品', data: obj };
                }
            }
        }

        return null;
    },

    // Handle object interaction
    handleObject(obj) {
        if (obj.oneTime && obj.flag && Game.state.flags[obj.flag]) {
            return;
        }

        if (obj.type === 'item' || obj.type === 'locker') {
            Dialogue.showPrompt(obj.message, () => {
                if (Inventory.addItem(obj.itemId)) {
                    const item = getItem(obj.itemId);

                    if (obj.flag) {
                        Game.state.flags[obj.flag] = true;
                    }

                    if (obj.itemId === 'fragment') {
                        Game.state.fragmentCount = (Game.state.fragmentCount || 0) + 1;

                        if (this.checkFragmentMerge()) return;
                    }
                    if (obj.itemId === 'easter_egg') {
                        Game.state.easterEggCount = (Game.state.easterEggCount || 0) + 1;
                        // Egg hunter achievement
                        if (Game.state.easterEggCount >= 3) {
                            AchievementSystem.unlock('egg_hunter');
                        }
                    }

                    Dialogue.showMessage(`獲得 ${item.icon} ${item.name}！`);
                } else {
                    Dialogue.showMessage('背包已滿！');
                }
            });
        }

        if (obj.type === 'bird_tree') {
            if (Inventory.equippedItem === 'telescope') {
                Dialogue.start([
                    { speaker: '', text: '你舉起望遠鏡看向樹梢...' },
                    { speaker: '', text: '發現了一隻稀有的藍色小鳥！' },
                    { speaker: '小鳥', text: '啾！' }
                ]);
                AchievementSystem.unlock('bird_watcher');
            } else {
                Dialogue.showMessage(obj.message);
            }
            return;
        }
    },

    // Handle enemy encounter
    handleEnemy(enemy) {
        if (enemy.oneTime && enemy.flag) {
            Game.state.flags[enemy.flag] = true;
        }

        Combat.start(enemy.enemyId, (victory) => {
            if (victory) {
                // Quest trigger: Defeated octopus boss
                if (enemy.enemyId === 'boss_octopus' && typeof QuestSystem !== 'undefined') {
                    if (!QuestSystem.isActive('defeat_octopus')) {
                        QuestSystem.startQuest('defeat_octopus');
                    }
                    QuestSystem.completeQuest('defeat_octopus');
                }
            } else if (enemy.oneTime && enemy.flag) {
                Game.state.flags[enemy.flag] = false;
            }
        });
    },

    // Handle trigger
    handleTrigger(trigger) {
        switch (trigger.type) {
            case 'door':
            case 'stairs':
                Dialogue.showPrompt(trigger.message, () => {
                    this.loadMap(trigger.targetMap, trigger.targetX, trigger.targetY);
                });
                break;

            case 'locked_door':
                if (Inventory.hasItem(trigger.needsItem)) {
                    Dialogue.showPrompt(`使用 ${getItem(trigger.needsItem).name} 開門？`, () => {
                        this.loadMap(trigger.targetMap, trigger.targetX, trigger.targetY);
                    });
                } else {
                    Dialogue.showMessage(trigger.locked_message || '門是鎖著的...');
                }
                break;

            case 'sewer':
                if (Inventory.hasItem('mysterious_stone') || Game.state.flags[trigger.needsFlag]) {
                    Dialogue.showPrompt('神秘的魔法石發出了光芒... 要進入下水道嗎？', () => {
                        this.loadMap(trigger.targetMap, trigger.targetX, trigger.targetY);
                    });
                } else {
                    Dialogue.showMessage('這裡似乎隱藏著什麼...但現在打不開。\n也許需要某種強大的魔法物品？');
                }
                break;

            case 'ending':
                this.triggerEnding();
                break;
        }
    },

    // Trigger game ending
    triggerEnding() {
        let endingTitle = '恭喜通關！';
        let endingText = '';
        let endingId = '';

        // Complete the main quest
        if (typeof QuestSystem !== 'undefined') {
            QuestSystem.completeQuest('climb_building');
        }

        // Count collected fragments
        const defeatedShanshan = Game.state.flags['boss_defeated'];
        const easterEggCount = Game.state.easterEggCount || 0;

        if (Game.state.flags['octopus_defeated']) {
            // Hidden Ending - Defeated Deep Sea Octopus
            endingId = 'ending_octopus';
            endingTitle = '👑 隱藏結局 - 汙穢的閣王';
            endingText = `你擊敗了深海章魚，坐上了汙水王座。
            
這不像是你原本的目標...
但這股來自深淵的力量讓你感到無比強大。

你成為了正心校園地下的新主宰。
所有的秘密都在你的掌控之中...

「光明與十字架？那與我何干？」

—— 沒人知道你去了哪裡 ——`;
        } else if (Inventory.hasItem('mysterious_stone') && defeatedShanshan && easterEggCount >= 3) {
            // True ending - All fragments (merged), all bosses, all easter eggs
            endingId = 'ending_true';
            endingTitle = '🌟 真結局 - 完美通關！';
            endingText = `你終於登上了會卿大樓的十字架！

站在這裡，俯瞰整個正心校園，你回想起這段旅程中的點點滴滴。

你成功合成了神秘的魔法石，
擊敗了傳說中的姍姍老師和足夠強的Boss，
發現了所有隱藏的彩蛋...

這一刻，所有的努力都值得了。

「知識就是力量，而你已經掌握了它。」

—— 正心中學，永遠的回憶 ——`;
        } else if (defeatedShanshan && Inventory.hasItem('mysterious_stone')) {
            // Good ending - Defeated Shanshan and got stone
            endingId = 'ending_good';
            endingTitle = '✨ 好結局！';
            endingText = `經過重重考驗，你終於登上了十字架！

站在會卿大樓的頂端，微風輕拂，
你終於實現了這個小小的夢想。

你手握著神秘的魔法石，
還擊敗了傳說中的姍姍老師！

雖然還有一些秘密沒有發現...
也許下次可以再來探索？`;
        } else {
            // Normal ending - fallback for all other cases
            endingId = 'ending_normal';
            endingTitle = '🎉 普通結局';
            endingText = `你成功登上了十字架！

雖然一路上遇到了不少困難，
但你還是完成了這個冒險。

${Inventory.hasItem('mysterious_stone') ? '✓ 持有神秘的魔法石' : '✗ 未獲得神秘的魔法石'}
${defeatedShanshan ? '✓ 擊敗姍姍老師' : '✗ 未挑戰姍姍老師'}

據說校園裡還藏著許多秘密...
你願意再次挑戰嗎？`;
        }

        // Unlock the ending achievement (per difficulty)
        const difficulty = Game.state.difficulty || 'normal';
        AchievementSystem.unlockEnding(endingId, difficulty);

        // Check for speed runner achievement
        AchievementSystem.checkSpeedRunner();

        // Check for flawless combat achievement
        if (Game.state && Game.state.noWrongAnswers) {
            AchievementSystem.unlock('flawless_combat');
        }

        Game.showEnding(endingTitle, endingText);
    },

    // Check for fragment merge
    checkFragmentMerge() {
        if (Game.state.fragmentCount >= 5 && !Game.state.flags['stone_merged']) {
            // Trigger merge animation
            const gameScreen = Utils.$('game-screen');
            gameScreen.classList.add('merge-animation');

            // Disable input during animation
            Input.setEnabled(false);

            setTimeout(() => {
                // Remove fragments and add stone
                Inventory.removeItem('fragment', 5);
                Inventory.addItem('mysterious_stone');
                Game.state.flags['stone_merged'] = true;

                gameScreen.classList.remove('merge-animation');
                Input.setEnabled(true);

                // Stone collector achievement
                AchievementSystem.unlock('stone_collector');

                Dialogue.showMessage('5片魔法石碎片產生了共鳴...\n聚合成了神秘的魔法石！');
            }, 2000);

            return true;
        }
        return false;
    },

    getCurrentMap() {
        return this.currentMap;
    }
};
