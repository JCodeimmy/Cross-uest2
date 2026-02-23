// ============================================
// NPC System (with special Virgin Mary event)
// ============================================

const NPCSystem = {
    npcs: [],
    currentNPC: null,

    // Load NPCs for current map
    loadMapNPCs(mapData) {
        this.npcs = [];
        if (!mapData.npcs) return;

        mapData.npcs.forEach(npcData => {
            this.npcs.push({
                ...npcData,
                talked: false
            });
        });
    },

    // Get NPC at position
    getNPCAt(x, y) {
        return this.npcs.find(npc => npc.x === x && npc.y === y);
    },

    // Check if player is adjacent to any NPC
    getAdjacentNPC(playerX, playerY) {
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];

        for (const dir of directions) {
            const npc = this.getNPCAt(playerX + dir.dx, playerY + dir.dy);
            if (npc) return npc;
        }
        return null;
    },

    // Interact with NPC
    interact(npc) {
        if (!npc) return;

        this.currentNPC = npc;

        // Special case: Virgin Mary Statue (聖母像)
        if (npc.id === 'statue') {
            this.handleStatueInteraction(npc);
            return;
        }

        // Special case: NPC gives fragment (季昇瑜)
        if (npc.giveFragment) {
            this.handleFragmentGiver(npc);
            return;
        }

        // Special case: NPC gives hair (林OO)
        if (npc.giveHair) {
            this.handleHairGiver(npc);
            return;
        }

        // Special case: He Shengliang (Test Master)
        if (npc.testMaster) {
            this.handleHeShengliang(npc);
            return;
        }

        // Special case: Mimic
        if (npc.id === 'mimic') {
            this.handleMimic(npc);
            return;
        }

        // Check for special NPC types
        if (npc.heal) {
            // Regular healing NPC
            const dialogues = [...npc.dialogue];
            dialogues.push({
                text: '你的傷口得到了治癒。',
                choices: [
                    {
                        text: '謝謝',
                        action: () => {
                            Game.state.hp = Game.state.maxHp;
                            Game.updateHUD();
                        }
                    }
                ]
            });
            Dialogue.start(dialogues.map(d =>
                typeof d === 'string' ? { speaker: npc.name, text: d } : { speaker: npc.name, ...d }
            ));
        } else if (npc.quest) {
            this.handleQuest(npc);
        } else {
            // Regular dialogue
            const dialogues = npc.dialogue.map(d => ({
                speaker: npc.name,
                text: d
            }));
            Dialogue.start(dialogues);
        }

        npc.talked = true;
    },

    // Special handling for Virgin Mary Statue
    handleStatueInteraction(npc) {
        // Track interaction count
        Game.state.statueCount = (Game.state.statueCount || 0) + 1;
        const count = Game.state.statueCount;

        if (count <= 2) {
            // First and second time: heal 10 HP
            const healAmount = 10;
            const newHp = Math.min(Game.state.hp + healAmount, Game.state.maxHp);
            const actualHeal = newHp - Game.state.hp;
            Game.state.hp = newHp;
            Game.updateHUD();

            Dialogue.start([
                { speaker: npc.name, text: '聖母亭...感覺很寧靜。' },
                { speaker: npc.name, text: '願你的旅途平安。' },
                { speaker: '', text: `恢復了 ${actualHeal} 點生命值！(${count}/2)` }
            ]);
        } else if (count === 3) {
            // Third time: Wrath of Jesus!
            Dialogue.start([
                { speaker: '???', text: '......' },
                { speaker: '耶穌', text: '禁止玷汙聖母！' },
                { speaker: '耶穌', text: '你的行為將招致毀滅！' },
                {
                    speaker: '',
                    text: '【耶穌之怒】發動！',
                    choices: [{
                        text: '...',
                        action: () => {
                            // Show wrath overlay with dramatic effect
                            this.showWrathEffect();
                        }
                    }]
                }
            ]);
        } else {
            // After the wrath, statue is silent
            Dialogue.start([
                { speaker: '', text: '聖母像沉默不語...' }
            ]);
        }
    },

    // Show Jesus's Wrath visual effect
    showWrathEffect() {
        const overlay = document.getElementById('wrath-overlay');
        overlay.classList.remove('hidden');

        // Play wrath audio effects (roar + sacred music)
        AudioManager.playWrath();

        // Trigger fade in
        requestAnimationFrame(() => {
            overlay.classList.add('active');

            // Add screen shake after a brief moment
            setTimeout(() => {
                overlay.classList.add('shake');
            }, 500);

            // After 2.5 seconds, start fade out
            setTimeout(() => {
                overlay.classList.remove('shake');
                overlay.classList.add('fade-out');

                // After fade out complete, hide overlay and apply damage
                setTimeout(() => {
                    overlay.classList.remove('active', 'fade-out');
                    overlay.classList.add('hidden');

                    // Resume previous music
                    AudioManager.resumePreviousMusic();

                    // Apply the actual damage
                    Game.state.maxHp = Math.max(10, Game.state.maxHp - 50);
                    Game.state.hp = Math.max(1, Game.state.hp - 50);
                    Game.state.hp = Math.min(Game.state.hp, Game.state.maxHp);
                    Game.updateHUD();

                    // Unlock achievement for triggering divine punishment
                    AchievementSystem.unlock('divine_punishment');

                    Dialogue.showMessage(`受到了神聖制裁！\nHP -50，最大HP -50！\n當前 HP: ${Game.state.hp}/${Game.state.maxHp}`);
                }, 500);
            }, 2500);
        });
    },

    // Handle NPC that gives fragment (季昇瑜)
    handleFragmentGiver(npc) {
        // Special interaction: Check for He Shengliang's Token
        // Removed achievement check to allow re-triggering in new games
        if (Inventory.hasItem('he_msg_token')) {
            Dialogue.start([
                { speaker: npc.name, text: '嗯？這是...' },
                { speaker: npc.name, text: '何昇諒的信物？你通過了他的考驗？' },
                { speaker: npc.name, text: '看來他終於承認了有人能繼承他的智慧...' },
                { speaker: npc.name, text: '「既生瑜，何生亮」...沒想到我們之間的競爭，會被你打破。' },
                {
                    speaker: npc.name,
                    text: '為了感謝你帶來這個消息，接受這份來自歷史的祝福吧！',
                    choices: [{
                        text: '接受祝福',
                        action: () => {
                            // Unlock hidden achievement
                            AchievementSystem.unlock('yu_liang_rivalry');

                            // Grant +10 ATK buff (stored in flags)
                            Game.state.flags['yu_liang_buff'] = true;

                            // Remove token
                            Inventory.removeItem('he_msg_token');

                            Dialogue.showMessage('獲得來自歷史的祝福！\n本局遊戲攻擊力上升 10 點！');
                        }
                    }]
                }
            ]);
            return;
        }

        // Check if already gave fragment
        if (Game.state.flags['fragment_from_npc']) {
            Dialogue.start([
                { speaker: npc.name, text: '我的魔法石碎片已經給你了！' },
                { speaker: npc.name, text: '聽說校園裡還有很多，去找找看吧！' }
            ]);
            return;
        }

        // Show dialogue with choice to receive fragment
        Dialogue.start([
            { speaker: npc.name, text: npc.dialogue[0] },
            { speaker: npc.name, text: npc.dialogue[1] },
            {
                speaker: npc.name,
                text: npc.dialogue[2],
                choices: [
                    {
                        text: '謝謝你！太感謝了！',
                        action: () => {
                            if (Inventory.addItem('fragment')) {
                                Game.state.flags['fragment_from_npc'] = true;
                                Game.state.fragmentCount = (Game.state.fragmentCount || 0) + 1;
                                const item = getItem('fragment');

                                if (SceneManager.checkFragmentMerge()) return;

                                Dialogue.showMessage(`獲得了 ${item.icon} ${item.name}！\n季昇瑜：聽說集齊5片可以開啟神秘入口喔！`);
                            } else {
                                Dialogue.showMessage('背包已滿！先清理一下再來找我。');
                            }
                        }
                    },
                    {
                        text: '我先不需要',
                        action: () => { }
                    }
                ]
            }
        ]);
    },

    // Handle NPC that gives hair (林OO)
    handleHairGiver(npc) {
        // Check if already gave hair
        if (Game.state.flags['hair_from_npc']) {
            Dialogue.start([
                { speaker: npc.name, text: '好好保管它...' },
                { speaker: npc.name, text: '這可是我珍貴的...' }
            ]);
            return;
        }

        // Show dialogue with choice to receive hair
        Dialogue.start([
            { speaker: npc.name, text: npc.dialogue[0] },
            { speaker: npc.name, text: npc.dialogue[1] },
            {
                speaker: npc.name,
                text: npc.dialogue[2],
                choices: [
                    {
                        text: '呃...好吧',
                        action: () => {
                            if (Inventory.addItem('hair')) {
                                Game.state.flags['hair_from_npc'] = true;
                                const item = getItem('hair');
                                Dialogue.showMessage(`獲得了 ${item.icon} ${item.name}！\n林OO：嘿嘿...`);
                            } else {
                                Dialogue.showMessage('背包已滿！');
                            }
                        }
                    },
                    {
                        text: '不用了謝謝',
                        action: () => {
                            Dialogue.showMessage('林OO：真可惜...');
                        }
                    }
                ]
            }
        ]);
    },

    // Handle He Shengliang's Test
    handleHeShengliang(npc) {
        // Check if player has token or already got the buff (completed quest this run)
        // We removed AchievementSystem.isUnlocked check to allow re-playing in new games
        if (Inventory.hasItem('he_msg_token') || Game.state.flags['yu_liang_buff']) {
            Dialogue.start([
                { speaker: npc.name, text: '你已經證明了自己的實力。' },
                { speaker: npc.name, text: '去找季昇瑜吧，他應該會感興趣的。' }
            ]);
            return;
        }

        Dialogue.start([
            { speaker: npc.name, text: '哼...看你的身手，似乎還太嫩了。' },
            { speaker: npc.name, text: '想挑戰我的智慧嗎？這可是極難的考驗。' },
            {
                speaker: npc.name,
                text: '準備好了嗎？答錯的話會有嚴厲的懲罰(生命上限-10)...',
                choices: [
                    {
                        text: '放馬過來！(開始測驗)',
                        action: () => {
                            this.startHeShengliangQuiz(npc);
                        }
                    },
                    {
                        text: '我再準備一下',
                        action: () => { }
                    }
                ]
            }
        ]);
    },

    startHeShengliangQuiz(npc) {
        // Question 1
        Dialogue.start([
            {
                speaker: npc.name,
                text: '第一題：\n「既生瑜，何生亮」這句話出自哪裡？',
                choices: [
                    { text: 'A. 三國志', action: () => this.handleQuizFail(npc, '錯！《三國志》是正史，這句話出自小說！') },
                    { text: 'B. 三國演義', action: () => this.handleQuizQ2(npc) },
                    { text: 'C. 水滸傳', action: () => this.handleQuizFail(npc, '錯！這是完全不同的朝代！') },
                    { text: 'D. 西遊記', action: () => this.handleQuizFail(npc, '錯！這裡沒有孫悟空！') }
                ]
            }
        ]);
    },

    handleQuizQ2(npc) {
        // Question 2
        Dialogue.start([
            {
                speaker: npc.name,
                text: '不錯...第二題：\n周瑜和諸葛亮，誰的年紀比較大？',
                choices: [
                    { text: 'A. 周瑜', action: () => this.handleQuizQ3(npc) },
                    { text: 'B. 諸葛亮', action: () => this.handleQuizFail(npc, '錯！周瑜比諸葛亮大六歲！') },
                    { text: 'C. 一樣大', action: () => this.handleQuizFail(npc, '錯！') },
                    { text: 'D. 不知道', action: () => this.handleQuizFail(npc, '你的歷史老師在哭泣！') }
                ]
            }
        ]);
    },

    handleQuizQ3(npc) {
        // Question 3
        Dialogue.start([
            {
                speaker: npc.name,
                text: '哼，竟然能答對...最後一題：\n赤壁之戰中，諸葛亮藉東風是在哪個祭壇？',
                choices: [
                    { text: 'A. 天壇', action: () => this.handleQuizFail(npc, '錯！那是北京的！') },
                    { text: 'B. 七星壇', action: () => this.handleQuizSuccess(npc) },
                    { text: 'C. 社稷壇', action: () => this.handleQuizFail(npc, '錯！') },
                    { text: 'D. 拜將壇', action: () => this.handleQuizFail(npc, '那是韓信的！') }
                ]
            }
        ]);
    },

    handleQuizFail(npc, reason) {
        // Punishment: Reduce Max HP by 10
        const penalty = 10;
        Game.state.maxHp = Math.max(1, Game.state.maxHp - penalty);
        // Ensure current HP doesn't exceed new Max HP
        Game.state.hp = Math.min(Game.state.hp, Game.state.maxHp);
        Game.updateHUD();

        Dialogue.start([
            { speaker: npc.name, text: reason },
            { speaker: npc.name, text: '太令人失望了。這就是失敗的代價。' },
            { speaker: '', text: `受到嚴厲懲罰！最大生命值減少了 ${penalty} 點！` }
        ]);
    },

    handleQuizSuccess(npc) {
        Dialogue.start([
            { speaker: npc.name, text: '......' },
            { speaker: npc.name, text: '竟然...全對了？' },
            { speaker: npc.name, text: '看來我也遇到了我的對手。' },
            {
                speaker: npc.name,
                text: '拿去吧，這是強者的證明。',
                choices: [{
                    text: '收下信物',
                    action: () => {
                        if (Inventory.addItem('he_msg_token')) {
                            const item = getItem('he_msg_token');
                            Dialogue.showMessage(`獲得了 ${item.icon} ${item.name}！\n何昇諒：把它拿給那個自以為是的傢伙看看。`);
                        } else {
                            Dialogue.showMessage('背包已滿！請清理空間後再來。');
                        }
                    }
                }]
            }
        ]);
    },

    // Handle quest NPCs
    handleQuest(npc) {
        const quest = npc.quest;

        if (Game.state.flags[quest.completeFlag]) {
            Dialogue.start([{
                speaker: npc.name,
                text: quest.completedDialogue || '謝謝你的幫助！'
            }]);
        } else if (Inventory.hasItem(quest.requireItem)) {
            Dialogue.start([
                { speaker: npc.name, text: quest.turnInDialogue || '太好了，你找到了！' },
                {
                    speaker: npc.name,
                    text: '作為回報，這個給你。',
                    choices: [{
                        text: '謝謝',
                        action: () => {
                            Inventory.removeItem(quest.requireItem);
                            if (quest.rewardItem) {
                                Inventory.addItem(quest.rewardItem);
                                const item = getItem(quest.rewardItem);
                                Dialogue.showMessage(`獲得 ${item.icon} ${item.name}！`);
                            }
                            Game.state.flags[quest.completeFlag] = true;
                        }
                    }]
                }
            ]);
        } else {
            Dialogue.start(npc.dialogue.map(d => ({
                speaker: npc.name,
                text: d
            })));
        }
    },

    // Handle Mimic interaction
    handleMimic(npc) {
        if (Game.state.flags['mimic_defeated']) {
            Dialogue.start([{ speaker: '寶箱', text: '這是一個已經壞掉的寶箱。' }]);
            return;
        }

        Dialogue.showPrompt('發現了一個寶箱！要打開嗎？', () => {
            Dialogue.start([
                { speaker: '寶箱', text: '...' },
                {
                    speaker: '寶箱',
                    text: '嘎！！！',
                    choices: [{
                        text: '戰鬥！',
                        action: () => {
                            Combat.start('mimic', (victory) => {
                                if (victory) {
                                    Game.state.flags['mimic_defeated'] = true;
                                    npc.name = '壞掉的寶箱';
                                    npc.icon = '🗑️';
                                }
                            });
                        }
                    }]
                }
            ]);
        });
    },

    // Touch trigger for NPCs
    checkTouchTrigger(playerX, playerY) {
        const npc = this.getNPCAt(playerX, playerY);
        if (npc) {
            this.interact(npc);
            return true;
        }
        return false;
    }
};
