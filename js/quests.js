// ============================================
// Quest System - Track and display game quests
// ============================================

const QuestSystem = {
    quests: {
        find_key: {
            id: 'find_key',
            name: '找到鑰匙',
            description: '在聖心大樓廁所的置物櫃找到通往十字架的鑰匙',
            type: 'main',
            order: 1
        },
        climb_building: {
            id: 'climb_building',
            name: '登上會卿大樓',
            description: '使用鑰匙登上會卿大樓頂樓的十字架',
            type: 'main',
            order: 2
        },
        defeat_octopus: {
            id: 'defeat_octopus',
            name: '擊敗汙水章魚王',
            description: '在汙水之殿擊敗章魚王',
            type: 'hidden',
            order: 3
        }
    },

    activeQuests: [],
    completedQuests: [],

    // Initialize quest system
    init() {
        this.activeQuests = [];
        this.completedQuests = [];
    },

    // Load quests from save data
    loadFromSave(state) {
        this.activeQuests = state.activeQuests || [];
        this.completedQuests = state.completedQuests || [];
        this.updateUI();
    },

    // Get save data
    getSaveData() {
        return {
            activeQuests: [...this.activeQuests],
            completedQuests: [...this.completedQuests]
        };
    },

    // Start a new quest
    startQuest(questId) {
        if (this.activeQuests.includes(questId) || this.completedQuests.includes(questId)) {
            return; // Quest already active or completed
        }

        const quest = this.quests[questId];
        if (!quest) return;

        this.activeQuests.push(questId);
        this.updateUI();

        // Show notification
        // Show notification
        let typeText = '【支線任務】';
        if (quest.type === 'main') typeText = '【主線任務】';
        else if (quest.type === 'hidden') typeText = '【隱藏任務】';

        Dialogue.showMessage(`${typeText}\n新任務：${quest.name}`);
    },

    // Complete a quest
    completeQuest(questId) {
        const index = this.activeQuests.indexOf(questId);
        if (index === -1) return; // Quest not active

        this.activeQuests.splice(index, 1);
        this.completedQuests.push(questId);
        this.updateUI();

        const quest = this.quests[questId];
        if (quest) {
            Dialogue.showMessage(`✓ 任務完成：${quest.name}`);
        }
    },

    // Check if quest is active
    isActive(questId) {
        return this.activeQuests.includes(questId);
    },

    // Check if quest is completed
    isCompleted(questId) {
        return this.completedQuests.includes(questId);
    },

    // Update the quest tracker UI
    updateUI() {
        const tracker = document.getElementById('quest-tracker');
        const list = document.getElementById('quest-list');

        if (!tracker || !list) return;

        // Get all quests to display (active + recently completed)
        const displayQuests = [];

        // Add completed quests first (main quests only, to show progression)
        this.completedQuests.forEach(questId => {
            const quest = this.quests[questId];
            if (quest) {
                displayQuests.push({ ...quest, completed: true });
            }
        });

        // Add active quests
        this.activeQuests.forEach(questId => {
            const quest = this.quests[questId];
            if (quest) {
                displayQuests.push({ ...quest, completed: false });
            }
        });

        // Sort by type (main -> side -> hidden) then by order
        displayQuests.sort((a, b) => {
            const typeOrder = { main: 0, side: 1, hidden: 2 };
            if (a.type !== b.type) {
                return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
            }
            return a.order - b.order;
        });

        // Generate HTML
        if (displayQuests.length === 0) {
            tracker.classList.add('hidden');
            return;
        }

        tracker.classList.remove('hidden');

        list.innerHTML = displayQuests.map(quest => {
            const typeClass = quest.type === 'main' ? 'main-quest' : 'side-quest'; // Use side-quest style for hidden too
            const completedClass = quest.completed ? 'completed' : '';
            const checkbox = quest.completed ? '✓' : '○';

            let typeLabel = '';
            if (quest.type === 'side') typeLabel = '<span class="quest-type-label">支線</span>';
            else if (quest.type === 'hidden') typeLabel = '<span class="quest-type-label hidden-type">隱藏</span>';

            return `
                <div class="quest-item ${typeClass} ${completedClass}">
                    <span class="quest-checkbox">${checkbox}</span>
                    <span class="quest-name">${quest.name}</span>
                    ${typeLabel}
                </div>
            `;
        }).join('');
    },

    // Show the quest tracker with fade-in
    show() {
        const tracker = document.getElementById('quest-tracker');
        if (tracker) {
            tracker.classList.remove('hidden');
            tracker.classList.add('fade-in');
        }
    },

    // Hide the quest tracker
    hide() {
        const tracker = document.getElementById('quest-tracker');
        if (tracker) {
            tracker.classList.add('hidden');
        }
    }
};
