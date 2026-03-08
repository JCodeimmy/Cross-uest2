// ============================================
// Combat System
// ============================================

const Combat = {
    active: false,
    enemy: null,
    currentQuestion: null,
    turnCount: 0,
    specialTriggered: false,
    onEnd: null,

    // DOM elements
    screen: null,
    playerHpBar: null,
    playerHpText: null,
    enemyHpBar: null,
    enemyHpText: null,
    message: null,
    questionBox: null,
    questionText: null,
    answerOptions: null,
    resultBox: null,

    init() {
        this.screen = Utils.$('combat-screen');
        this.playerHpBar = Utils.$('combat-player-hp');
        this.playerHpText = Utils.$('combat-player-hp-text');
        this.enemyHpBar = Utils.$('combat-enemy-hp');
        this.enemyHpText = Utils.$('combat-enemy-hp-text');
        this.message = Utils.$('combat-message');
        this.questionBox = Utils.$('question-box');
        this.questionText = Utils.$('question-text');
        this.questionCategory = Utils.$('question-category');
        this.answerOptions = Utils.$('answer-options');
        this.resultBox = Utils.$('combat-result');

        // Setup answer buttons
        this.answerOptions.querySelectorAll('.answer-btn').forEach(btn => {
            btn.onclick = () => this.selectAnswer(btn.dataset.answer);
        });

        Utils.$('btn-combat-continue').onclick = () => this.endCombat();
    },

    // Start combat with an enemy
    start(enemyId, onEnd = null) {
        this.enemy = getEnemy(enemyId);
        if (!this.enemy) return;

        this.active = true;
        this.turnCount = 0;
        this.specialTriggered = false;
        this.onEnd = onEnd;
        this.enemyIsElite = false;
        this.enemyIsNightmare = false;
        this.correctAnswers = 0;
        this.totalQuestions = 0;

        // Switch to combat music
        AudioManager.play('combat');

        // Apply difficulty transformations
        this.applyDifficultyToEnemy();

        // Setup UI
        Utils.$('combat-player-name').textContent = Game.state.characterName;
        Utils.$('combat-enemy-name').textContent = this.enemy.name;
        this.updateHP();

        Utils.hide(this.questionBox);
        Utils.hide(this.resultBox);
        Utils.show(this.screen);
        Input.setEnabled(false);

        // Show intro dialogue
        this.showMessage(this.enemy.dialogue.intro, async () => {
            // Show transformation message if applicable
            if (this.hasTransformed) {
                const transformMsg = this.enemyIsNightmare ? '⚠️ 警告：敵人發生了惡夢異變！' : '❗ 注意：敵人發生了菁英異變！';
                await this.showMessage(transformMsg);
            }

            // Check for boss special attack
            if (this.enemy.isBoss && this.enemy.specialAttack && !this.specialTriggered) {
                this.triggerSpecialAttack();
            } else {
                this.nextTurn();
            }
        });
    },

    // Apply difficulty-based transformations to enemy
    applyDifficultyToEnemy() {
        const diff = Game.state.difficulty;
        const isBoss = this.enemy.isBoss;
        this.hasTransformed = false;

        if (diff === 'hard') {
            // Hard: 25% elite chance (50% for boss)
            const eliteChance = isBoss ? 0.5 : 0.25;
            if (Utils.random() < eliteChance) {
                this.transformToElite();
                this.hasTransformed = true;
            }
        } else if (diff === 'nightmare') {
            // Nightmare: All enemies are elite, 25% nightmare chance (100% for boss)
            this.transformToElite();
            this.hasTransformed = true;
            const nightmareChance = isBoss ? 1.0 : 0.25;
            if (Utils.random() < nightmareChance) {
                this.transformToNightmare();
                // Still hasTransformed = true
            }
        }
    },

    // Transform enemy to elite
    transformToElite() {
        this.enemyIsElite = true;
        this.enemy.stats.hp += 20;
        this.enemy.stats.maxHp += 20;
        this.enemy.stats.atk += 1;
        this.enemy.name = '菁英-' + this.enemy.name;
    },

    // Transform enemy to nightmare
    transformToNightmare() {
        this.enemyIsNightmare = true;
        this.enemy.stats.hp += 40;
        this.enemy.stats.maxHp += 40;
        this.enemy.stats.atk += 3;
        this.enemy.name = '惡夢-' + this.enemy.name.replace('菁英-', '');
    },

    // Show message with delay
    async showMessage(text, callback = null) {
        this.message.textContent = text;
        await Utils.wait(1500);
        if (callback) callback();
    },

    // Trigger boss special attack
    async triggerSpecialAttack() {
        this.specialTriggered = true;
        const special = this.enemy.specialAttack;

        await this.showMessage(special.message);

        const damage = special.damage !== undefined ? special.damage : Utils.randomInt(special.damageMin, special.damageMax);

        // Apply damage using the new helper
        await this.applyDamageToPlayer(damage, false, true);

        // Apply debuff if any
        if (special.debuff) {
            this.playerDebuff = { ...special.debuff };
        }

        Utils.addClass('game-canvas', 'shake');
        await Utils.wait(300);
        Utils.removeClass('game-canvas', 'shake');

        if (special.debuff) {
            this.playerDebuff = { ...special.debuff };
            this.message.textContent += ` (你攻擊力下降了 ${Math.abs(special.debuff.amount)})`;
            await Utils.wait(1000);
        }

        if (Game.state.hp <= 0) {
            this.defeat();
        } else {
            await Utils.wait(500);
            this.nextTurn(true);
        }
    },

    // Next turn - show question
    async nextTurn(skipSpecialCheck = false) {
        // Check for boss special attack (periodic)
        // For Octopus: Every 4 turns (4, 8, 12...)
        if (!skipSpecialCheck && this.enemy.id === 'boss_octopus' && this.turnCount > 0 && this.turnCount % 4 === 0) {
            await this.triggerSpecialAttack();
            return;
        }

        this.turnCount++;
        this.currentQuestion = getRandomQuestion(this.enemy.difficulty);

        // Show category badge
        if (this.questionCategory) {
            this.questionCategory.textContent = getCategoryName(this.currentQuestion.category);
        }

        this.questionText.textContent = this.currentQuestion.question;

        const buttons = this.answerOptions.querySelectorAll('.answer-btn');
        buttons.forEach((btn, i) => {
            btn.textContent = this.currentQuestion.options[i];
            btn.className = 'answer-btn';
            btn.disabled = false;
        });

        Utils.show(this.questionBox);

        // Math Helper Effect: Remove one wrong option
        if (Game.state.flags['math_helper_active'] && this.currentQuestion.category === 'math') {
            const wrongButtons = [];
            buttons.forEach(btn => {
                if (btn.dataset.answer !== this.currentQuestion.answer) {
                    wrongButtons.push(btn);
                }
            });

            if (wrongButtons.length > 0) {
                const removeBtn = wrongButtons[Utils.randomInt(0, wrongButtons.length - 1)];
                removeBtn.style.visibility = 'hidden';
                // Also disable it to be safe
                removeBtn.disabled = true;

                // Show a small hint
                this.message.textContent = '數學小幫手發動！刪去了一個錯誤選項！';
            }
        }
    },

    // Select an answer
    async selectAnswer(answer) {
        const correct = this.currentQuestion.answer;
        const buttons = this.answerOptions.querySelectorAll('.answer-btn');

        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === correct) {
                btn.classList.add('correct');
            } else if (btn.dataset.answer === answer) {
                btn.classList.add('wrong');
            }
        });

        await Utils.wait(1000);
        Utils.hide(this.questionBox);

        if (answer === correct) {
            await this.playerAttack();
        } else {
            // Achievement tracking: invalidate flawless run on wrong answer
            if (Game.state) {
                Game.state.noWrongAnswers = false;
            }
            await this.enemyAttack();
        }
    },

    // Player attacks enemy
    async playerAttack() {
        // Equipment Bonus
        let bonus = Inventory.getEquipmentBonus();

        // Burning Broom Nerf in Sewage Palace
        if (Game.state.currentMap === 'sewage_palace' && Inventory.equippedItem === 'burning_broom') {
            bonus = { atk: 0, selfDamageChance: 0 };
            // Note: We'll show a notification at start of combat or map load, 
            // but here we just silence the effect. Maybe add a small text?
            this.message.textContent = '燃燒掃把在汙水中失效了！';
            await Utils.wait(1000);
        }

        // Apply Debuffs (e.g. from Octopus)
        let atkDebuff = 0;
        if (this.playerDebuff && this.playerDebuff.stat === 'atk') {
            atkDebuff = this.playerDebuff.amount;
            this.playerDebuff.duration--;
            if (this.playerDebuff.duration <= 0) this.playerDebuff = null;
        }

        // Apply Buffs (e.g. He Shengliang's Token)
        let atkBuff = 0;
        if (Game.state.flags['yu_liang_buff']) {
            atkBuff = 10;
        }

        const baseAtk = Game.state.atk + bonus.atk + atkDebuff + atkBuff;

        // Calculate damage
        let damage = Utils.randomInt(baseAtk - 5, baseAtk + 5);
        damage = Math.max(1, damage);

        // Magic Rampage (Mysterious Magic Stone Effect)
        let isRampage = false;
        if (Inventory.hasItem('mysterious_stone') && Utils.random() < 0.1) {
            isRampage = true;
            const rampageDmg = Utils.randomInt(10, 15);
            damage += rampageDmg;
        }

        // Check for crit
        const isCrit = Utils.random() * 100 < Game.state.cr;
        if (isCrit) {
            damage = Math.floor(damage * Game.state.cd);
        }

        // Easy difficulty: 1.5x damage multiplier
        if (Game.state.difficulty === 'easy') {
            damage = Math.floor(damage * 1.5);
        }

        this.enemy.stats.hp -= damage;
        this.updateHP();

        let msg = isCrit ? `暴擊！造成 ${damage} 傷害！` : `造成 ${damage} 傷害！`;
        if (isRampage) {
            msg = `魔力暴走！造成 ${damage} 傷害！`;
            Utils.showFirework(window.innerWidth / 2 + 100, window.innerHeight / 2 - 50);
        }
        this.message.textContent = msg;

        Utils.showDamageNumber(
            window.innerWidth / 2 + 100,
            window.innerHeight / 2 - 50,
            damage,
            isCrit,
            false
        );

        // Check for self-damage from equipment
        if (bonus.selfDamageChance > 0 && Utils.random() < bonus.selfDamageChance) {
            await Utils.wait(500);
            const selfDamage = Math.floor(baseAtk * bonus.selfDamageMultiplier);

            await this.applyDamageToPlayer(selfDamage, false, true);
            this.message.textContent += ` 但燃燒反噬！受到 ${selfDamage} 傷害！`;

            // Track self-burn for achievement
            AchievementSystem.updateStats('selfBurnCount');
        }

        await Utils.wait(1500);

        // Check victory
        if (this.enemy.stats.hp <= 0) {
            this.victory();
        } else if (Game.state.hp <= 0) {
            this.defeat();
        } else {
            this.nextTurn();
        }
    },

    // Enemy attacks player
    async enemyAttack() {
        const enemyAtk = this.enemy.stats.atk;
        let damage = Utils.randomInt(enemyAtk - 5, enemyAtk + 5);
        damage = Math.max(1, damage);

        // Check for enemy crit
        const isCrit = Utils.random() * 100 < this.enemy.stats.cr;
        if (isCrit) {
            damage = Math.floor(damage * this.enemy.stats.cd);
        }

        // Easy difficulty: reduce damage by 5
        if (Game.state.difficulty === 'easy') {
            damage = Math.max(1, damage - 5);
        }

        await this.applyDamageToPlayer(damage, isCrit, true);

        let msg = isCrit ? `敵人暴擊！你受到 ${damage} 傷害！` : `答錯了！你受到 ${damage} 傷害！`;

        // Nightmare lifesteal effect
        if (this.enemyIsNightmare) {
            const lifesteal = Math.ceil(damage * 0.25);
            this.enemy.stats.hp = Math.min(this.enemy.stats.maxHp, this.enemy.stats.hp + lifesteal);
            this.updateHP();
            msg += ` 敵人吸血 +${lifesteal}HP！`;
        }

        this.message.textContent = msg;

        Utils.addClass('game-screen', 'shake');
        await Utils.wait(300);
        Utils.removeClass('game-screen', 'shake');

        await Utils.wait(1500);

        // Check defeat
        if (Game.state.hp <= 0) {
            this.defeat();
        } else {
            this.nextTurn();
        }
    },

    // Apply damage to player with Mimic Shell protection
    async applyDamageToPlayer(damage, isCrit, isEnemySource) {
        let finalDamage = damage;
        let protectionTriggered = false;

        // Check for Mimic Shell protection
        if (Inventory.equippedItem === 'mimic_shell' && Game.state.hp - damage <= 0) {
            finalDamage = Game.state.hp - 1;
            protectionTriggered = true;
        }

        Game.state.hp -= finalDamage;
        this.updateHP();

        Utils.showDamageNumber(
            window.innerWidth / 2 - 100,
            window.innerHeight / 2 - 50,
            finalDamage,
            isCrit,
            true
        );

        if (protectionTriggered) {
            await Utils.wait(500);
            this.message.textContent = '🛡️ 寶箱怪的外殼碎裂了！保住了性命！';

            // Destroy the item
            Inventory.equippedItem = null;
            Game.state.equippedItem = null;
            Inventory.updateHUD();

            await Utils.wait(1500);
        }
    },

    // Update HP displays
    updateHP() {
        const playerPercent = (Game.state.hp / Game.state.maxHp) * 100;
        this.playerHpBar.style.width = playerPercent + '%';
        this.playerHpText.textContent = `${Math.max(0, Game.state.hp)}/${Game.state.maxHp}`;

        const enemyPercent = (this.enemy.stats.hp / this.enemy.stats.maxHp) * 100;
        this.enemyHpBar.style.width = Math.max(0, enemyPercent) + '%';
        this.enemyHpText.textContent = `${Math.max(0, this.enemy.stats.hp)}/${this.enemy.stats.maxHp}`;

        Game.updateHUD();
    },

    // Victory
    async victory() {
        Utils.hide(this.questionBox);
        this.message.textContent = this.enemy.dialogue.defeat;
        await Utils.wait(1500);

        // Calculate rewards
        let rewardText = '';
        const rewards = this.enemy.rewards;

        if (rewards && rewards.items && Utils.random() < rewards.itemChance) {
            const itemId = rewards.items[Utils.randomInt(0, rewards.items.length - 1)];
            if (Inventory.addItem(itemId)) {
                const item = getItem(itemId);
                rewardText = `獲得 ${item.icon} ${item.name}！`;
            }
        }

        // Update achievement stats
        AchievementSystem.updateStats('combatWins');

        // Check for boss defeat achievements
        if (this.enemy.isBoss) {
            AchievementSystem.updateStats('bossDefeats');
            AchievementSystem.checkAllBosses();
        }

        // Check for elite/nightmare slayer achievements
        if (this.enemyIsElite) {
            AchievementSystem.unlock('elite_slayer');
        }
        if (this.enemyIsNightmare) {
            AchievementSystem.unlock('nightmare_slayer');
        }

        // Check for survivor achievement (won with 1 HP)
        if (Game.state.hp === 1) {
            AchievementSystem.unlock('survivor');
        }

        Utils.$('result-text').textContent = '勝利！';
        Utils.$('result-text').className = 'victory';
        Utils.$('result-reward').textContent = rewardText || '戰鬥結束。';
        Utils.show(this.resultBox);
    },

    // Defeat
    async defeat() {
        Utils.hide(this.questionBox);
        this.message.textContent = '你被擊敗了...';
        await Utils.wait(1500);

        this.active = false;
        Utils.hide(this.screen);
        Input.setEnabled(true);

        // Switch back to exploration music
        AudioManager.play('exploration');

        Game.gameOver();
    },

    // End combat and return to game
    endCombat() {
        this.active = false;
        Utils.hide(this.screen);
        Input.setEnabled(true);

        // Switch back to exploration music
        AudioManager.play('exploration');

        if (this.onEnd) {
            this.onEnd(true);
            this.onEnd = null;
        }
    }
};
