// ============================================
// Audio Manager - Background Music System
// ============================================

const AudioManager = {
    tracks: {
        menu: null,
        intro: null,
        exploration: null,
        combat: null,
        wrath: null
    },
    currentTrack: null,
    currentTrackName: null,
    previousTrackName: null,
    volume: 0.5,
    sfxVolume: 0.7,
    isMuted: false,
    isInitialized: false,
    userInteracted: false,
    audioContext: null,

    // Music URLs - using local music files (Kevin MacLeod - incompetech.com)
    musicUrls: {
        // 8bit Dungeon Level - Tetris-style chiptune for menu
        menu: 'assets/audio/menu.mp3',
        // Heroic Age - Epic cinematic orchestral for intro
        intro: 'assets/audio/intro_orchestra.mp3',
        // Darkness is Coming - Dark ambient atmospheric for exploration
        exploration: 'assets/audio/exploration_orchestra.mp3',
        // All This - Fast orchestral battle music
        combat: 'assets/audio/combat_orchestra.mp3',
        // Gregorian Chant - Sacred music for Jesus's Wrath
        wrath: 'assets/audio/wrath_music.mp3'
    },

    // Initialize audio system
    init() {
        // Create audio elements
        for (const trackName in this.musicUrls) {
            const audio = new Audio();
            audio.src = this.musicUrls[trackName];
            audio.loop = (trackName !== 'wrath'); // Wrath doesn't loop
            audio.volume = this.volume;
            audio.preload = 'auto';
            this.tracks[trackName] = audio;
        }
        this.isInitialized = true;

        // Initialize Web Audio API for sound effects
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }

        // Add click handler to enable audio (bypass autoplay policy)
        const enableAudio = () => {
            this.userInteracted = true;
            // Resume audio context if suspended
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            // Try to play pending track
            if (this.pendingTrack) {
                this.play(this.pendingTrack);
                this.pendingTrack = null;
            }
            // Remove listener after first interaction
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };

        document.addEventListener('click', enableAudio);
        document.addEventListener('keydown', enableAudio);

        console.log('AudioManager initialized!');
    },

    // Play a specific track with fade transition
    play(trackName, fadeTime = 1000) {
        if (!this.isInitialized || this.isMuted) return;

        const newTrack = this.tracks[trackName];
        if (!newTrack) return;

        // If same track is already playing, do nothing
        if (this.currentTrackName === trackName && this.currentTrack && !this.currentTrack.paused) return;

        // Store pending track if user hasn't interacted yet
        if (!this.userInteracted) {
            this.pendingTrack = trackName;
            return;
        }

        // Remember previous track for resuming later
        if (this.currentTrackName && this.currentTrackName !== trackName) {
            this.previousTrackName = this.currentTrackName;
        }

        // Fade out current track
        if (this.currentTrack && !this.currentTrack.paused) {
            this.fadeOut(this.currentTrack, fadeTime);
        }

        // Start new track with fade in
        newTrack.volume = 0;
        newTrack.currentTime = 0;
        newTrack.play().catch(e => {
            console.log('Audio play failed:', e);
            this.pendingTrack = trackName;
        });

        this.fadeIn(newTrack, fadeTime);
        this.currentTrack = newTrack;
        this.currentTrackName = trackName;
    },

    // Play Jesus's Wrath effect (roar + sacred music)
    playWrath() {
        if (!this.userInteracted) return;

        // Play synthesized roar sound effect
        this.playRoar();

        // After short delay, play sacred music
        setTimeout(() => {
            this.play('wrath', 500);
        }, 300);
    },

    // Resume previous music after wrath ends
    resumePreviousMusic() {
        const trackToResume = this.previousTrackName || 'exploration';
        this.play(trackToResume, 1000);
    },

    // Synthesize a roar/growl sound using Web Audio API
    playRoar() {
        if (!this.audioContext || !this.userInteracted) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Create oscillators for a deep growl/roar sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Low frequency growl
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(80, now);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 0.5);

        // Second oscillator for texture
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(60, now);
        osc2.frequency.exponentialRampToValueAtTime(30, now + 0.5);

        // Low-pass filter for rumble effect
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        filter.Q.value = 10;

        // Envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.sfxVolume, now + 0.05);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.8, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        // Connect
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        // Play
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.8);
        osc2.stop(now + 0.8);
    },

    // Fade in effect
    fadeIn(audio, duration) {
        const targetVolume = this.volume;
        const step = targetVolume / (duration / 50);

        const fadeInterval = setInterval(() => {
            if (audio.volume < targetVolume - step) {
                audio.volume = Math.min(targetVolume, audio.volume + step);
            } else {
                audio.volume = targetVolume;
                clearInterval(fadeInterval);
            }
        }, 50);
    },

    // Fade out effect
    fadeOut(audio, duration) {
        const step = audio.volume / (duration / 50);

        const fadeInterval = setInterval(() => {
            if (audio.volume > step) {
                audio.volume = Math.max(0, audio.volume - step);
            } else {
                audio.volume = 0;
                audio.pause();
                clearInterval(fadeInterval);
            }
        }, 50);
    },

    // Stop all music
    stop(fadeTime = 500) {
        if (this.currentTrack && !this.currentTrack.paused) {
            this.fadeOut(this.currentTrack, fadeTime);
            this.currentTrack = null;
            this.currentTrackName = null;
        }
    },

    // Pause current track
    pause() {
        if (this.currentTrack && !this.currentTrack.paused) {
            this.currentTrack.pause();
        }
    },

    // Resume current track
    resume() {
        if (this.currentTrack && this.currentTrack.paused && this.userInteracted) {
            this.currentTrack.play().catch(e => console.log('Resume blocked'));
        }
    },

    // Set volume (0.0 to 1.0)
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        for (const trackName in this.tracks) {
            if (this.tracks[trackName]) {
                this.tracks[trackName].volume = this.volume;
            }
        }
    },

    // Toggle mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.pause();
        } else if (this.currentTrack) {
            this.resume();
        }
        return this.isMuted;
    }
};
