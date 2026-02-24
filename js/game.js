// ============================================
// Main Game Controller
// ============================================

const Game = {
    state: null,
    isRunning: false,
    isPaused: false,
    lastTime: 0,
    selectedCharacter: 0,
    selectedDifficulty: 'normal',
    saveMode: 'load',

    // Character detailed descriptions
    characterDescriptions: {
        0: {
            name: '勇者',
            avatar: '🧑‍🎓',
            stats: 'HP:100 ATK:10 CR:10%',
            description: '平衡型角色，擁有穩定的屬性和普通的暴擊率。適合想要體驗完整遊戲內容的玩家。'
        },
        1: {
            name: '智者',
            avatar: '🦸',
            stats: 'HP:80 ATK:8 CR:20%',
            description: '高暴擊率角色，血量較低但爆發力強。擅長答題的玩家能發揮最大威力。'
        },
        2: {
            name: '勇士',
            avatar: '🧙',
            stats: 'HP:120 ATK:12 CR:5%',
            description: '高血量高攻擊角色，暴擊率較低但生存能力強。適合硬派玩家。'
        },
        3: {
            name: '開發者專屬',
            avatar: '👨‍💻',
            stats: 'HP:100 ATK:100 CR:100%',
            description: '作弊角色，擁有超高攻擊力和100%暴擊率。'
        }
    },

    // Initialize the game
    init() {
        console.log('Initializing Cross Quest...');

        // Initialize all systems
        Input.init();
        Renderer.init();
        Dialogue.init();
        Inventory.init();
        Combat.init();
        QuestSystem.init();
        AudioManager.init();

        // Setup UI event listeners
        this.setupEventListeners();

        // Update save slot display
        this.updateSaveSlots();

        // Update nightmare difficulty lock status
        this.updateNightmareLock();

        // Start playing menu music
        AudioManager.play('menu');

        console.log('Game initialized!');
    },

    // Setup event listeners
    setupEventListeners() {
        // Title screen - character selection
        document.querySelectorAll('.character-card').forEach(card => {
            card.onclick = () => {
                const charId = parseInt(card.dataset.char);
                if (charId === 3) {
                    this.showPasswordModal(card);
                } else {
                    this.selectCharacter(charId);
                }
            };
        });


        Utils.$('btn-new-game').onclick = () => this.showConfirmScreen();
        Utils.$('btn-load-game').onclick = () => this.showSaveScreen('load');
        Utils.$('btn-achievements').onclick = () => this.showAchievementScreen();
        Utils.$('btn-back-achievement').onclick = () => this.hideAchievementScreen();

        // Confirmation screen
        Utils.$('btn-confirm-back').onclick = () => this.hideConfirmScreen();
        Utils.$('btn-confirm-start').onclick = () => this.startNewGame();

        // Difficulty selection
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.onclick = () => {
                const diff = card.dataset.diff;
                if (card.classList.contains('locked')) {
                    Dialogue.showMessage('需要先通關困難難度才能解鎖惡夢難度！');
                    return;
                }
                this.selectDifficulty(diff);
            };
        });

        // Save screen
        document.querySelectorAll('.save-slot').forEach(slot => {
            slot.onclick = () => this.handleSaveSlot(parseInt(slot.dataset.slot));
        });
        Utils.$('btn-back-save').onclick = () => this.hideSaveScreen();

        // Pause menu
        Utils.$('btn-resume').onclick = () => this.togglePause();
        Utils.$('btn-save').onclick = () => this.showSaveScreen('save');
        Utils.$('btn-quit').onclick = () => this.quitToTitle();

        // Game over
        Utils.$('btn-retry').onclick = () => this.retry();
        Utils.$('btn-gameover-title').onclick = () => this.quitToTitle();

        // Ending
        Utils.$('btn-ending-title').onclick = () => this.quitToTitle();

        // In-game buttons
        Utils.$('inventory-btn').onclick = () => Inventory.toggle();
        Utils.$('menu-btn').onclick = () => this.togglePause();
        Utils.$('equipped-slot').onclick = () => this.toggleEquipment();

        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (Inventory.isOpen) {
                    Inventory.close();
                } else if (Combat.active) {
                    // Can't pause during combat
                } else if (Dialogue.active) {
                    // Can't pause during dialogue
                } else if (this.isRunning) {
                    this.togglePause();
                }
            }
        });
    },

    // Update nightmare difficulty lock status
    updateNightmareLock() {
        const nightmareCard = document.querySelector('.difficulty-card[data-diff="nightmare"]');
        if (nightmareCard) {
            if (AchievementSystem.isNightmareUnlocked()) {
                nightmareCard.classList.remove('locked');
                nightmareCard.querySelector('.diff-name').textContent = '👹 惡夢';
                nightmareCard.querySelector('.diff-desc').textContent = '全員菁英+惡夢型態，敵人吸血';
            }
        }
    },

    // Select character on title screen
    selectCharacter(index) {
        this.selectedCharacter = index;
        document.querySelectorAll('.character-card').forEach((card, i) => {
            card.classList.toggle('selected', i === index);
        });
    },

    // Select difficulty
    selectDifficulty(diff) {
        this.selectedDifficulty = diff;
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.diff === diff);
        });
    },

    // Show confirmation screen
    showConfirmScreen() {
        const charData = this.characterDescriptions[this.selectedCharacter];
        Utils.$('confirm-avatar').textContent = charData.avatar;
        Utils.$('confirm-name').textContent = charData.name;
        Utils.$('confirm-stats').textContent = charData.stats;
        Utils.$('confirm-desc').textContent = charData.description;

        // Update nightmare lock status
        this.updateNightmareLock();

        // Reset difficulty selection to normal
        this.selectedDifficulty = 'normal';
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.diff === 'normal');
        });

        Utils.switchScreen('confirm-screen');
    },

    // Hide confirmation screen
    hideConfirmScreen() {
        Utils.switchScreen('title-screen');
    },

    // Start new game with selected character and difficulty
    startNewGame() {
        // Check for cheater achievement
        if (this.selectedCharacter === 3) {
            AchievementSystem.unlock('cheater');
        }

        this.state = SaveSystem.createNewGame(this.selectedCharacter);
        this.state.difficulty = this.selectedDifficulty;

        // Initialize inventory from empty state first
        Inventory.loadFromSave(this.state);

        // Reset Quest System
        QuestSystem.init();

        // Apply difficulty modifiers
        this.applyDifficultyModifiers();

        // Sync inventory back to state so startGame doesn't overwrite it
        const invData = Inventory.getSaveData();
        this.state.inventory = invData.inventory;

        if (!this.state.flags['intro_shown']) {
            this.playIntroAnimation(() => this.startGame());
        } else {
            this.startGame();
        }
    },

    // Apply difficulty-based modifiers
    applyDifficultyModifiers() {
        const diff = this.state.difficulty;

        if (diff === 'easy') {
            // Easy: Start with 3 bandages
            Inventory.addItem('healing_herb');
            Inventory.addItem('healing_herb');
            Inventory.addItem('healing_herb');
        }
        // Other modifiers are applied during combat
    },

    // Start the game
    startGame() {
        Utils.switchScreen('game-screen');
        this.isRunning = true;
        this.isPaused = false;

        // Initialize player
        Player.init(this.state.playerX, this.state.playerY);

        // Load inventory
        Inventory.loadFromSave(this.state);

        // Load the current map
        SceneManager.loadMap(this.state.currentMap, this.state.playerX, this.state.playerY);

        // Update HUD
        this.updateHUD();

        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));

        // Show quest tracker
        QuestSystem.show();

        // Start exploration music
        AudioManager.play('exploration');

        // Only auto-start quest if loading from save (intro already completed before)
        // For new games, the quest is started from the tutorial dialogue
        // Skip if tutorial is pending (will be set before calling startGame from intro)
        if (this.state.flags['intro_shown'] &&
            !this.state.flags['tutorial_pending'] &&
            !QuestSystem.activeQuests.includes('find_key') &&
            !QuestSystem.completedQuests.includes('find_key')) {
            QuestSystem.startQuest('find_key');
        }
    },

    async playIntroAnimation(onComplete) {
        // Start epic intro music
        AudioManager.play('intro');

        Utils.switchScreen('intro-screen');
        const textElem = Utils.$('intro-text');
        const skipHint = Utils.$('intro-skip');
        const container = Utils.$('intro-text-container');

        const slides = [
            { text: "在時間的洪流中，有一座被迷霧籠罩的聖殿...", style: "normal" },
            { text: "正心之土，承載著無數靈魂的渴望與夢想。", style: "normal" },
            { text: "傳說，在那會卿大樓的巔峰，矗立著一座神聖的十字架。", style: "highlight" },
            { text: "它不僅是建築的頂端，更是通往救贖與榮耀的門戶。", style: "normal" },
            { text: "唯有尋得那被遺忘的鑰匙，方能踏上這條朝聖之路。", style: "important" },
            { text: "少年啊，你的宿命已與這座十字架緊緊相連...", style: "dramatic" },
            { text: "去吧，揭開隱藏在陰影下的真相，\n登上那神聖的頂點！", style: "finale" }
        ];

        let skipCurrent = false;
        let skipAll = false;

        const skipHandler = (e) => {
            if (e.key === 'z' || e.key === 'Z' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                skipCurrent = true;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                skipAll = true;
                skipCurrent = true;
            }
        };
        window.addEventListener('keydown', skipHandler);

        // Update skip hint
        if (skipHint) {
            skipHint.innerHTML = '按 Z 跳過此句 | 按 ESC 跳過全部';
        }

        for (let i = 0; i < slides.length; i++) {
            if (skipAll) break;
            skipCurrent = false;

            const slide = slides[i];

            // Apply style class
            textElem.className = 'intro-text';
            if (slide.style !== 'normal') {
                textElem.classList.add('intro-text-' + slide.style);
            }

            // Show slide number indicator
            const progress = document.createElement('div');
            progress.className = 'intro-progress';
            progress.innerHTML = `<span class="intro-progress-current">${i + 1}</span> / ${slides.length}`;

            // Clear and set new text
            textElem.textContent = slide.text;
            textElem.classList.add('active');

            // Add floating particles effect for special slides
            if (slide.style === 'finale' || slide.style === 'dramatic') {
                container.classList.add('intro-particles');
            } else {
                container.classList.remove('intro-particles');
            }

            // Wait for display (or skip on Z press)
            const displayTime = slide.style === 'finale' ? 40 : 30;
            for (let j = 0; j < displayTime; j++) {
                if (skipCurrent || skipAll) break;
                await Utils.wait(100);
            }

            // Fade out
            textElem.classList.remove('active');

            // Wait between slides (or skip)
            if (!skipCurrent && !skipAll && i < slides.length - 1) {
                for (let k = 0; k < 8; k++) {
                    if (skipCurrent || skipAll) break;
                    await Utils.wait(100);
                }
            }
        }

        window.removeEventListener('keydown', skipHandler);
        this.state.flags['intro_shown'] = true;
        this.state.flags['tutorial_pending'] = true; // Prevent auto-quest in startGame

        // Switch to game screen first to avoid black screen blocking dialogue
        onComplete();

        // Clear input state and reset dialogue cooldown to ensure tutorial shows properly
        Input.clear();
        Dialogue.lastEndTime = 0; // Reset cooldown

        // Small delay to ensure screen transition is complete
        await Utils.wait(300);

        // Show detailed tutorial dialogue after animation
        Dialogue.start([
            {
                speaker: '📖 操作說明',
                text: '【移動】使用 方向鍵 或 WASD 移動角色\n【互動】按 Z 或 Enter 與物件/NPC 互動'
            },
            {
                speaker: '📖 操作說明',
                text: '【背包】按 I 開啟背包查看物品\n【裝備】按 Q 切換/卸下裝備'
            },
            {
                speaker: '📖 操作說明',
                text: '【戰鬥】遇到敵人時會進入問答戰鬥\n答對則可攻擊敵人，答錯則會受到傷害'
            },
            {
                speaker: '',
                text: '準備好踏上冒險了嗎？',
                choices: [{
                    text: '🚀 出發！',
                    action: () => {
                        // Start the first quest silently (without showing message)
                        if (!QuestSystem.activeQuests.includes('find_key') &&
                            !QuestSystem.completedQuests.includes('find_key')) {
                            QuestSystem.activeQuests.push('find_key');
                            QuestSystem.updateUI();
                        }
                        // Clear the tutorial pending flag
                        Game.state.flags['tutorial_pending'] = false;
                    },
                    next: [
                        {
                            speaker: '📋 任務開始',
                            text: '【主線任務】\n新任務：找到鑰匙\n\n在聖心大樓廁所的置物櫃找到通往十字架的鑰匙'
                        }
                    ]
                }]
            }
        ]);
    },

    // Main game loop
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (!this.isPaused) {
            this.update(deltaTime);
            this.render();
        }

        requestAnimationFrame((t) => this.gameLoop(t));
    },

    // Update game state
    update(deltaTime) {
        // Update play time
        this.state.playTime += deltaTime;

        // Handle dialogue input
        if (Dialogue.active) {
            Dialogue.handleInput();
            return;
        }

        // Don't process input during combat or inventory
        if (Combat.active || Inventory.isOpen || this.isPaused) return;

        // Check for key presses
        const buffer = Input.consumeKeyBuffer();

        // Inventory toggle
        if (buffer.includes('i')) {
            Inventory.toggle();
            return;
        }

        // Equipment toggle
        if (buffer.includes('q')) {
            this.toggleEquipment();
            return;
        }

        // Action key (Z/Enter) - interact with adjacent objects/NPCs
        if (buffer.includes('z') || buffer.includes('enter') || buffer.includes(' ')) {
            SceneManager.checkActionTriggers();
            return;
        }

        // Handle movement
        if (Input.isMoving() && Input.canMove()) {
            const dir = Input.getMovementDirection();
            if (dir) {
                const moved = Player.move(dir.dx, dir.dy, SceneManager.getCurrentMap());
                if (moved) {
                    // Update state
                    this.state.playerX = Player.x;
                    this.state.playerY = Player.y;

                    // Pollution Effect (Sewer Deeper & Sewage Palace)
                    const mapId = this.state.currentMap;
                    if (mapId === 'sewer_deeper' || mapId === 'sewage_palace') {
                        if (Utils.random() < 0.33) {
                            const damage = Utils.randomInt(1, 2);
                            this.state.hp = Math.max(1, this.state.hp - damage); // Don't kill by pollution? User didn't specify, but usually environments kill
                            this.updateHUD();
                            // Visual feedback
                            Utils.showDamageNumber(
                                Player.x * 32 + 16 + (window.innerWidth - 512) / 2, // Centered offset approximation
                                Player.y * 32,
                                `汙濁 -${damage}`,
                                false,
                                true
                            );
                            // Maybe a small shake or text?
                            // Utils.showMessage is async, might block. Just update HUD and float text.
                        }
                    }

                    // Check TOUCH triggers at new position (doors, enemies)
                    SceneManager.checkTouchTriggers();
                }
            }
        }

        // Update interact prompt
        this.updateInteractPrompt();
    },

    // Render the game
    render() {
        const mapData = SceneManager.getCurrentMap();
        if (mapData) {
            Renderer.render(mapData);
        }
    },

    // Update HUD
    updateHUD() {
        const hpPercent = (this.state.hp / this.state.maxHp) * 100;
        Utils.$('hp-fill').style.width = hpPercent + '%';
        Utils.$('hp-text').textContent = `${this.state.hp}/${this.state.maxHp}`;
        Utils.$('player-name').textContent = this.state.characterName;

        // Update inventory HUD
        Inventory.updateHUD();
    },

    // Update interaction prompt visibility
    updateInteractPrompt() {
        const prompt = Utils.$('interact-prompt');
        const interactable = SceneManager.getAdjacentInteractable();

        if (interactable) {
            if (interactable.type === 'npc') {
                prompt.textContent = `按 Z 與 ${interactable.name} 對話`;
            } else if (interactable.type === 'object') {
                prompt.textContent = `按 Z 調查 ${interactable.name}`;
            } else {
                prompt.textContent = `按 Z 互動`;
            }
            Utils.show(prompt);
        } else {
            Utils.hide(prompt);
        }
    },

    // Start combat
    startCombat(enemyId, onComplete) {
        Combat.start(enemyId, onComplete);
    },

    // Toggle equipment
    toggleEquipment() {
        if (Inventory.equippedItem) {
            const item = getItem(Inventory.equippedItem);
            if (Inventory.unequip()) {
                Dialogue.showMessage(`卸下 ${item.name}`);
            } else {
                Dialogue.showMessage('背包已滿，無法卸下裝備！');
            }
        } else {
            Dialogue.showMessage('沒有裝備中的物品。\n按 I 開啟背包選擇裝備。');
        }
    },

    // Toggle pause
    togglePause() {
        if (Combat.active || Dialogue.active) return;

        this.isPaused = !this.isPaused;
        const pauseMenu = Utils.$('pause-menu');

        if (this.isPaused) {
            Utils.show(pauseMenu);
            Input.setEnabled(false);
        } else {
            Utils.hide(pauseMenu);
            Input.setEnabled(true);
        }
    },

    // Show save screen
    showSaveScreen(mode) {
        this.saveMode = mode;
        Utils.$('save-title').textContent = mode === 'save' ? '存檔' : '讀取存檔';
        this.updateSaveSlots();

        if (this.isPaused) {
            Utils.hide('pause-menu');
        }

        Utils.switchScreen('save-screen');
    },

    // Hide save screen
    hideSaveScreen() {
        if (this.isRunning) {
            Utils.switchScreen('game-screen');
            if (this.isPaused) {
                Utils.show('pause-menu');
            }
        } else {
            Utils.switchScreen('title-screen');
        }
    },

    // Update save slot displays
    updateSaveSlots() {
        const saves = SaveSystem.getAllSaves();
        document.querySelectorAll('.save-slot').forEach((slot, i) => {
            const info = slot.querySelector('.slot-info');
            info.textContent = SaveSystem.formatSaveInfo(saves[i]);
        });
    },

    // Handle save slot click
    handleSaveSlot(slot) {
        if (this.saveMode === 'save') {
            this.saveGame(slot);
        } else {
            this.loadGame(slot);
        }
    },

    // Save game
    saveGame(slot) {
        // Update inventory in state
        const invData = Inventory.getSaveData();
        this.state.inventory = invData.inventory;
        this.state.equippedItem = invData.equippedItem;

        if (SaveSystem.save(slot, this.state)) {
            this.updateSaveSlots();
            Dialogue.showMessage('存檔成功！', () => {
                this.hideSaveScreen();
            });
        } else {
            Dialogue.showMessage('存檔失敗...');
        }
    },

    // Load game
    loadGame(slot) {
        const save = SaveSystem.getSave(slot);
        if (!save) {
            Dialogue.showMessage('此存檔槽是空的。');
            return;
        }

        this.state = { ...save, tempBuffs: [] };
        this.startGame();
    },

    // Game over
    gameOver() {
        this.isRunning = false;
        Utils.switchScreen('gameover-screen');
    },

    // Retry from game over
    retry() {
        // Restore from last save or restart
        this.state.hp = this.state.maxHp;
        this.startGame();
    },

    // Show ending
    showEnding(title, text) {
        this.isRunning = false;
        Utils.$('ending-title').textContent = title;
        Utils.$('ending-text').textContent = text;
        Utils.switchScreen('ending-screen');
    },

    // Quit to title
    quitToTitle() {
        this.isRunning = false;
        this.isPaused = false;
        Utils.hide('pause-menu');
        Input.setEnabled(true);
        Input.clear();
        Utils.switchScreen('title-screen');

        // Play menu music
        AudioManager.play('menu');
    },

    // Show achievement screen
    showAchievementScreen() {
        const stats = AchievementSystem.getUnlockedCount();
        Utils.$('achievement-stats').innerHTML = `
            <div class="stat-item">🏆 結局: ${stats.endings}/${stats.totalEndings}</div>
            <div class="stat-item">🎖️ 成就: ${stats.achievements}/${stats.totalAchievements}</div>
        `;
        Utils.$('achievement-list').innerHTML = AchievementSystem.generateScreenHTML();
        Utils.switchScreen('achievement-screen');
    },

    // Hide achievement screen
    hideAchievementScreen() {
        Utils.switchScreen('title-screen');
    },

    // Show password modal for developer character unlock
    showPasswordModal(card) {
        const modal = Utils.$('password-modal');
        const input = Utils.$('password-input');
        const error = Utils.$('password-error');
        const confirmBtn = Utils.$('btn-password-confirm');
        const cancelBtn = Utils.$('btn-password-cancel');

        // Reset state
        input.value = '';
        input.classList.remove('error');
        Utils.hide(error);
        Utils.show(modal);

        // Focus input after animation
        setTimeout(() => input.focus(), 100);

        // Handle confirm
        const handleConfirm = () => {
            const password = input.value;
            if (password === '8964') {
                // Success! Unlock character
                this.selectCharacter(3);

                // Update card UI
                const avatar = card.querySelector('.char-avatar');
                const name = card.querySelector('.char-name');
                const stats = card.querySelector('.char-stats');
                const desc = card.querySelector('.char-desc');

                avatar.textContent = '👨‍💻';
                name.textContent = '開發者專屬';
                stats.textContent = 'HP:100 ATK:100 CR:100%';
                desc.textContent = '神一般的存在';
                card.classList.remove('locked');

                this.hidePasswordModal();
                cleanup();
            } else {
                // Error - wrong password
                input.classList.add('error');
                Utils.show(error);
                input.value = '';
                input.focus();

                // Remove error state after animation
                setTimeout(() => {
                    input.classList.remove('error');
                }, 500);
            }
        };

        // Handle cancel
        const handleCancel = () => {
            this.hidePasswordModal();
            cleanup();
        };

        // Handle Enter key
        const handleKeydown = (e) => {
            if (e.key === 'Enter') {
                handleConfirm();
            } else if (e.key === 'Escape') {
                handleCancel();
            }
        };

        // Cleanup event listeners
        const cleanup = () => {
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            input.removeEventListener('keydown', handleKeydown);
        };

        // Attach event listeners
        confirmBtn.onclick = handleConfirm;
        cancelBtn.onclick = handleCancel;
        input.addEventListener('keydown', handleKeydown);
    },

    // Hide password modal
    hidePasswordModal() {
        const modal = Utils.$('password-modal');
        const input = Utils.$('password-input');
        const error = Utils.$('password-error');

        Utils.hide(modal);
        input.value = '';
        input.classList.remove('error');
        Utils.hide(error);
    }
};

// Start the game when page loads
window.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
