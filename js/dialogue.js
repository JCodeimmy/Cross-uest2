// ============================================
// Dialogue System (Fixed - Cooldown to prevent double-trigger)
// ============================================

const Dialogue = {
    active: false,
    queue: [],
    currentDialogue: null,
    currentIndex: 0,
    choices: null,
    selectedChoiceIndex: 0, // For keyboard navigation
    onComplete: null,
    lastEndTime: 0,
    cooldownMs: 500, // Cooldown after dialogue ends

    // DOM elements
    box: null,
    speaker: null,
    text: null,
    choicesContainer: null,
    continueHint: null,


    init() {
        this.box = Utils.$('dialogue-box');
        this.speaker = Utils.$('dialogue-speaker');
        this.text = Utils.$('dialogue-text');
        this.choicesContainer = Utils.$('dialogue-choices');
        this.continueHint = Utils.$('dialogue-continue');

        // Add click handler to advance dialogue
        this.box.onclick = () => {
            if (this.active && !this.choices) {
                this.continue();
            }
        };

        // Note: Keyboard input is handled by handleInput() which is called from game loop
        // This prevents double-trigger issues from having multiple listeners
    },

    // Check if dialogue is on cooldown
    isOnCooldown() {
        return Date.now() - this.lastEndTime < this.cooldownMs;
    },

    // Start a dialogue sequence
    // If force is false (default), will not interrupt an active dialogue
    start(dialogueData, onComplete = null, force = false) {
        // Prevent starting if on cooldown
        if (this.isOnCooldown()) return;

        // Prevent overwriting active dialogue unless forced
        if (this.active && !force) {
            console.log('Dialogue.start blocked: dialogue already active');
            return;
        }

        this.active = true;
        this.currentIndex = 0;
        this.onComplete = onComplete;

        if (typeof dialogueData === 'string') {
            this.queue = [{ text: dialogueData }];
        } else if (Array.isArray(dialogueData)) {
            this.queue = dialogueData.map(d => typeof d === 'string' ? { text: d } : d);
        } else {
            this.queue = [dialogueData];
        }

        Utils.show(this.box);
        this.showNext();
    },

    // Show next dialogue in queue
    showNext() {
        if (this.currentIndex >= this.queue.length) {
            this.end();
            return;
        }

        const current = this.queue[this.currentIndex];
        this.currentDialogue = current;

        // Set speaker if present
        if (current.speaker) {
            this.speaker.textContent = current.speaker;
            Utils.show(this.speaker);
        } else {
            this.speaker.textContent = '';
            Utils.hide(this.speaker);
        }

        // Set text immediately
        this.text.textContent = current.text;

        // Handle choices
        if (current.choices) {
            this.showChoices(current.choices);
        } else {
            Utils.hide(this.choicesContainer);
            Utils.show(this.continueHint);
        }

        this.currentIndex++;
    },

    // Show choice buttons
    showChoices(choices) {
        Utils.hide(this.continueHint);
        Utils.show(this.choicesContainer);
        this.choicesContainer.innerHTML = '';
        this.choices = choices;
        this.selectedChoiceIndex = 0; // Reset to first choice

        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'dialogue-choice';
            // No default selection for mouse-only interaction
            btn.textContent = choice.text;
            btn.onclick = (e) => {
                e.stopPropagation();
                this.selectChoice(index);
            };
            this.choicesContainer.appendChild(btn);
        });
    },

    // Update choice highlight for keyboard navigation - REMOVED
    // updateChoiceHighlight() { ... }

    // Handle choice selection
    selectChoice(index) {
        const choice = this.choices[index];
        Utils.hide(this.choicesContainer);
        Utils.show(this.continueHint);
        this.choices = null;

        // Capture current queue reference to detect changes
        const currentQueue = this.queue;

        // IMPORTANT: We must allow the action to start a new dialogue (e.g. "You got an item!")
        // So we temporarily set active to false to bypass the protection in start()
        this.active = false;

        if (choice.action) {
            choice.action();
        }

        // If action started a new dialogue, this.active will be true AND queue will be different
        // In that case, we stop here and let the new dialogue control flow
        if (this.active && this.queue !== currentQueue) {
            return;
        }

        // If action didn't start a new dialogue (or it failed), we resume control
        this.active = true;

        if (choice.next) {
            if (typeof choice.next === 'string') {
                this.queue = [{ text: choice.next }];
                this.currentIndex = 0;
            } else if (Array.isArray(choice.next)) {
                this.queue = choice.next.map(d => typeof d === 'string' ? { text: d } : d);
                this.currentIndex = 0;
            }
            this.showNext();
        } else {
            // Choice chain ended
            this.end();
        }
    },

    // Continue to next dialogue
    continue() {
        if (!this.active) return;
        if (this.choices) return;

        this.showNext();
    },

    // End dialogue
    end() {
        this.active = false;
        this.queue = [];
        this.currentDialogue = null;
        this.currentIndex = 0;
        this.choices = null;
        this.lastEndTime = Date.now(); // Set cooldown timer

        Utils.hide(this.box);
        Utils.hide(this.choicesContainer);

        // Clear any held keys to prevent immediate re-trigger
        Input.clear();

        if (this.onComplete) {
            const callback = this.onComplete;
            this.onComplete = null;
            // Delay callback slightly to prevent re-trigger
            setTimeout(() => callback(), 100);
        }
    },

    // Show a simple message
    showMessage(text, onComplete = null) {
        if (this.isOnCooldown()) return;
        this.start([text], onComplete);
    },

    // Show a yes/no prompt
    showPrompt(text, onYes, onNo = null) {
        if (this.isOnCooldown()) return;
        this.start([{
            text: text,
            choices: [
                { text: '是', action: onYes },
                { text: '否', action: onNo || (() => { }) }
            ]
        }]);
    },

    // Handle input - called every frame
    handleInput() {
        if (!this.active) return;

        // Check for key presses (from buffer to avoid repeat)
        const buffer = Input.consumeKeyBuffer();

        // Ignore keyboard when choices are active
        if (this.choices) return;

        // Normal dialogue continuation
        if (buffer.includes('z') || buffer.includes('enter') || buffer.includes(' ')) {
            this.continue();
        }
    }
};
