// ============================================
// Achievement System
// ============================================

const AchievementSystem = {
    // All available endings (per difficulty)
    endings: {
        ending_normal: {
            id: 'ending_normal',
            name: '普通結局',
            icon: '🎉',
            description: '成功登上十字架'
        },
        ending_good: {
            id: 'ending_good',
            name: '好結局',
            icon: '✨',
            description: '擊敗姍姍老師並獲得魔法石後登上十字架'
        },
        ending_true: {
            id: 'ending_true',
            name: '真結局',
            icon: '🌟',
            description: '完美通關：收集所有彩蛋並擊敗所有Boss'
        },
        ending_octopus: {
            id: 'ending_octopus',
            name: '隱藏結局 - 汙穢的閣王',
            icon: '👑',
            description: '擊敗汙水章魚王並坐上王座'
        }
    },

    // All available achievements
    achievements: {
        first_blood: {
            id: 'first_blood',
            name: '初次戰鬥',
            icon: '⚔️',
            description: '贏得第一場戰鬥',
            hidden: false
        },
        boss_slayer: {
            id: 'boss_slayer',
            name: 'Boss獵人',
            icon: '👹',
            description: '擊敗任意一個Boss',
            hidden: false
        },
        all_bosses: {
            id: 'all_bosses',
            name: '無敵王者',
            icon: '👑',
            description: '擊敗所有Boss（姍姍老師、足夠強的Boss、汙水章魚王）',
            hidden: false
        },
        divine_punishment: {
            id: 'divine_punishment',
            name: '褻瀆者',
            icon: '⚡',
            description: '觸發耶穌之怒',
            hidden: true
        },
        stone_collector: {
            id: 'stone_collector',
            name: '碎片收集者',
            icon: '💎',
            description: '收集5片魔法石碎片並合成神秘的魔法石',
            hidden: false
        },
        explorer: {
            id: 'explorer',
            name: '探索者',
            icon: '🗺️',
            description: '進入隱藏的下水道',
            hidden: false
        },
        survivor: {
            id: 'survivor',
            name: '生存專家',
            icon: '❤️',
            description: '在HP只剩1點時贏得戰鬥',
            hidden: true
        },
        speed_runner: {
            id: 'speed_runner',
            name: '速通高手',
            icon: '⏱️',
            description: '在10分鐘內通關遊戲',
            hidden: false
        },
        full_inventory: {
            id: 'full_inventory',
            name: '囤積狂',
            icon: '🎒',
            description: '背包塞滿10個物品',
            hidden: false
        },
        flawless_combat: {
            id: 'flawless_combat',
            name: '完美戰鬥',
            icon: '💯',
            description: '在整場遊戲中沒有答錯任何題目',
            hidden: false
        },
        self_destructive: {
            id: 'self_destructive',
            name: '玩火自焚',
            icon: '🔥',
            description: '因燃燒掃把的反噬效果受到傷害3次',
            hidden: true
        },
        egg_hunter: {
            id: 'egg_hunter',
            name: '彩蛋獵人',
            icon: '🥚',
            description: '收集3個彩蛋',
            hidden: false
        },
        cheater: {
            id: 'cheater',
            name: '你作弊!',
            icon: '😈',
            description: '使用開發者專屬角色遊玩',
            hidden: true
        },
        hard_clear: {
            id: 'hard_clear',
            name: '困難征服者',
            icon: '💀',
            description: '在困難難度下通關遊戲',
            hidden: false
        },
        nightmare_clear: {
            id: 'nightmare_clear',
            name: '惡夢終結者',
            icon: '👹',
            description: '在惡夢難度下通關遊戲',
            hidden: false
        },
        elite_slayer: {
            id: 'elite_slayer',
            name: '菁英獵人',
            icon: '⭐',
            description: '擊敗一個菁英型態敵人',
            hidden: false
        },
        nightmare_slayer: {
            id: 'nightmare_slayer',
            name: '惡夢殺手',
            icon: '🔥',
            description: '擊敗一個惡夢型態敵人',
            hidden: false
        },
        bird_watcher: {
            id: 'bird_watcher',
            name: '賞鳥協會會員',
            icon: '🐦',
            description: '使用望遠鏡觀察樹上的鳥',
            hidden: true
        },
        yu_liang_rivalry: {
            id: 'yu_liang_rivalry',
            name: '既生瑜，何生亮',
            icon: '🤝',
            description: '通過何昇諒的考驗並將信物交給季昇瑜',
            hidden: true
        },
        fuqiang_pride: {
            id: 'fuqiang_pride',
            name: '富強的驕傲!',
            icon: '📖',
            description: '使用懦夫講義',
            hidden: false
        }
    },

    // Storage key
    STORAGE_KEY: 'crossquest_achievements',

    // Get saved achievement data
    getData() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            unlockedEndings: {},  // Now keyed by difficulty
            unlockedAchievements: [],
            stats: {
                combatWins: 0,
                bossDefeats: 0,
                selfBurnCount: 0,
                perfectCombats: 0
            },
            hardCleared: false,
            nightmareUnlocked: false
        };
    },

    // Save achievement data
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Unlock an ending (per difficulty)
    unlockEnding(endingId, difficulty = 'normal') {
        const data = this.getData();

        // Migration: Convert array to object if needed
        if (Array.isArray(data.unlockedEndings)) {
            const oldEndings = data.unlockedEndings;
            data.unlockedEndings = {
                normal: oldEndings // Assume old endings were normal
            };
        }

        if (!data.unlockedEndings[difficulty]) {
            data.unlockedEndings[difficulty] = [];
        }
        if (!data.unlockedEndings[difficulty].includes(endingId)) {
            data.unlockedEndings[difficulty].push(endingId);

            // Check for difficulty clear achievements
            if (difficulty === 'hard') {
                data.hardCleared = true;
                data.nightmareUnlocked = true;
                this.saveData(data);
                this.unlock('hard_clear');
            } else if (difficulty === 'nightmare') {
                this.saveData(data);
                this.unlock('nightmare_clear');
            } else {
                this.saveData(data);
            }

            console.log('Ending unlocked:', endingId, 'on', difficulty);
        }
    },

    // Unlock an achievement
    unlock(achievementId) {
        const data = this.getData();
        if (!data.unlockedAchievements.includes(achievementId)) {
            data.unlockedAchievements.push(achievementId);
            this.saveData(data);

            const achievement = this.achievements[achievementId];
            if (achievement) {
                this.showUnlockNotification(achievement);
            }
            console.log('Achievement unlocked:', achievementId);
        }
    },

    // Check if achievement is unlocked
    isUnlocked(achievementId) {
        const data = this.getData();
        return data.unlockedAchievements.includes(achievementId);
    },

    // Check if ending is unlocked
    isEndingUnlocked(endingId) {
        const data = this.getData();
        return data.unlockedEndings.includes(endingId);
    },

    // Update stats and check achievements
    updateStats(statName, value = 1) {
        const data = this.getData();
        data.stats[statName] = (data.stats[statName] || 0) + value;
        this.saveData(data);

        // Check stat-based achievements
        this.checkStatAchievements(data);
    },

    // Check achievements based on stats
    checkStatAchievements(data) {
        // First blood
        if (data.stats.combatWins >= 1) {
            this.unlock('first_blood');
        }

        // Boss slayer
        if (data.stats.bossDefeats >= 1) {
            this.unlock('boss_slayer');
        }

        // Self destructive
        if (data.stats.selfBurnCount >= 3) {
            this.unlock('self_destructive');
        }
    },

    // Check all bosses defeated
    checkAllBosses() {
        if (Game.state &&
            Game.state.flags['boss_defeated'] &&
            Game.state.flags['rooftop_boss_defeated'] &&
            Game.state.flags['octopus_defeated']) {
            this.unlock('all_bosses');
        }
    },

    // Check speed runner (called at ending) - 3 minutes = 180000ms
    checkSpeedRunner() {
        if (Game.state && Game.state.playTime <= 180000) {
            this.unlock('speed_runner');
        }
    },

    // Check if nightmare difficulty is unlocked
    isNightmareUnlocked() {
        const data = this.getData();
        return data.nightmareUnlocked || data.hardCleared;
    },

    // Show unlock notification
    showUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-label">成就解鎖！</div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
        `;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    },

    // Get unlocked count
    getUnlockedCount() {
        const data = this.getData();
        // Count all unique endings across difficulties
        const allEndings = new Set();
        for (const diff of Object.values(data.unlockedEndings)) {
            if (Array.isArray(diff)) {
                diff.forEach(e => allEndings.add(e));
            }
        }
        // Legacy support for old array format
        if (Array.isArray(data.unlockedEndings)) {
            data.unlockedEndings.forEach(e => allEndings.add(e));
        }
        return {
            endings: allEndings.size,
            totalEndings: Object.keys(this.endings).length,
            achievements: data.unlockedAchievements.length,
            totalAchievements: Object.keys(this.achievements).length
        };
    },

    // Generate HTML for achievement screen
    generateScreenHTML() {
        const data = this.getData();

        let html = '<div class="achievements-content">';

        // Endings section
        html += '<div class="achievements-section"><h3>🏆 結局收集</h3><div class="achievements-grid">';
        for (const [id, ending] of Object.entries(this.endings)) {
            // Determine highest difficulty unlocked
            let highestDiff = null;
            const diffs = ['nightmare', 'hard', 'normal', 'easy'];

            // Check new object format
            if (!Array.isArray(data.unlockedEndings)) {
                for (const diff of diffs) {
                    if (data.unlockedEndings[diff] && data.unlockedEndings[diff].includes(id)) {
                        highestDiff = diff;
                        break;
                    }
                }
            }
            // Legacy array format check
            else if (data.unlockedEndings.includes(id)) {
                highestDiff = 'normal'; // Assume normal for legacy
            }

            const unlocked = highestDiff !== null;

            let diffBadge = '';
            if (highestDiff) {
                const diffNames = { easy: '新手', normal: '普通', hard: '困難', nightmare: '惡夢' };
                const diffColors = { easy: '#4ade80', normal: '#60a5fa', hard: '#f87171', nightmare: '#c084fc' };
                diffBadge = `<span style="color: ${diffColors[highestDiff]}; font-size: 0.8em; border: 1px solid ${diffColors[highestDiff]}; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">${diffNames[highestDiff]}</span>`;
            }

            html += `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${unlocked ? ending.icon : '🔒'}</div>
                    <div class="achievement-details">
                        <div class="achievement-name">
                            ${unlocked ? ending.name : '???'}
                            ${diffBadge}
                        </div>
                        <div class="achievement-desc">${unlocked ? ending.description : '尚未解鎖'}</div>
                    </div>
                </div>
            `;
        }
        html += '</div></div>';

        // Separate achievements into general and hidden
        const generalAchievements = Object.entries(this.achievements).filter(([id, a]) => !a.hidden);
        const hiddenAchievements = Object.entries(this.achievements).filter(([id, a]) => a.hidden);

        // General Achievements section
        html += '<div class="achievements-section"><h3>🎖️ 一般成就</h3><div class="achievements-grid">';
        for (const [id, achievement] of generalAchievements) {
            const unlocked = data.unlockedAchievements.includes(id);
            html += `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${unlocked ? achievement.icon : '🔒'}</div>
                    <div class="achievement-details">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                </div>
            `;
        }
        html += '</div></div>';

        // Hidden Achievements section
        html += '<div class="achievements-section"><h3>❓ 隱藏成就</h3><div class="achievements-grid">';
        for (const [id, achievement] of hiddenAchievements) {
            const unlocked = data.unlockedAchievements.includes(id);
            html += `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${unlocked ? achievement.icon : '❓'}</div>
                    <div class="achievement-details">
                        <div class="achievement-name">${unlocked ? achievement.name : '隱藏成就'}</div>
                        <div class="achievement-desc">${unlocked ? achievement.description : '達成特定條件解鎖'}</div>
                    </div>
                </div>
            `;
        }
        html += '</div></div>';

        html += '</div>';
        return html;
    }
};
