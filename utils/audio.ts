

let audioCtx: AudioContext | null = null;

const getCtx = () => {
    try {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        return audioCtx;
    } catch (e) {
        console.error("Web Audio API initialization failed", e);
        return null;
    }
}

const safeResume = (ctx: AudioContext) => {
    try {
        if (ctx.state === 'suspended') {
            ctx.resume().catch(e => console.warn("Audio resume failed", e));
        }
    } catch (e) {
        // Ignore resume errors
    }
}

export const playTinSound = () => {
    try {
        const ctx = getCtx();
        if (!ctx) return;
        safeResume(ctx);
        const t = ctx.currentTime;

        // 1. Orchestral Swell (Lower Register - Cello/Bass section feeling)
        // Increased gain for better audibility
        const notes = [130.81, 196.00, 261.63, 329.63]; 
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, t);
            // Boosted volume from 0.02 to 0.15
            gain.gain.linearRampToValueAtTime(0.15, t + 0.3 + (i * 0.05)); 
            gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 3.0);
        });

        // 2. The "Breath" of the Sea (Air/Water texture)
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; 
        }

        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = buffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(100, t);
        noiseFilter.frequency.exponentialRampToValueAtTime(800, t + 1.5); 

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, t);
        // Boosted volume from 0.015 to 0.1
        noiseGain.gain.linearRampToValueAtTime(0.1, t + 0.5); 
        noiseGain.gain.linearRampToValueAtTime(0, t + 2.0);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSrc.start(t);
        noiseSrc.stop(t + 2.0);

        // 3. Deep Impact (Soft Timpani)
        const drumOsc = ctx.createOscillator();
        drumOsc.type = 'sine';
        drumOsc.frequency.setValueAtTime(80, t);
        drumOsc.frequency.exponentialRampToValueAtTime(40, t + 0.3);

        const drumGain = ctx.createGain();
        // Boosted volume from 0.08 to 0.25
        drumGain.gain.setValueAtTime(0.25, t);
        drumGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        drumOsc.connect(drumGain);
        drumGain.connect(ctx.destination);
        drumOsc.start(t);
        drumOsc.stop(t + 0.6);
    } catch (e) {
        console.error("Error playing tin sound", e);
    }
};

export const playMysticalSound = () => {
    try {
        const ctx = getCtx();
        if (!ctx) return;
        safeResume(ctx);
        const t = ctx.currentTime;

        // Ethereal chord (Pentatonic spread)
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; 
        
        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = f;
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, t);
            // Boosted volume from 0.05 to 0.15
            gain.gain.linearRampToValueAtTime(0.15, t + 0.1 + (i * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.0);
            gain.gain.linearRampToValueAtTime(0, t + 4.1);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(t);
            osc.stop(t + 4.1);
        });

        // High sparkle (FM bell-like tone)
        const carrier = ctx.createOscillator();
        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(2000, t);
        
        const modulator = ctx.createOscillator();
        modulator.type = 'triangle';
        modulator.frequency.setValueAtTime(40, t); 
        
        const modGain = ctx.createGain();
        modGain.gain.value = 500;
        
        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        
        const carrierGain = ctx.createGain();
        carrierGain.gain.setValueAtTime(0, t);
        // Boosted volume to 0.1
        carrierGain.gain.linearRampToValueAtTime(0.1, t + 0.2);
        carrierGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);
        carrierGain.gain.linearRampToValueAtTime(0, t + 2.6);
        
        carrier.connect(carrierGain);
        carrierGain.connect(ctx.destination);
        
        carrier.start(t);
        modulator.start(t);
        carrier.stop(t + 2.6);
        modulator.stop(t + 2.6);
    } catch (e) {
        console.error("Error playing mystical sound", e);
    }
};

export const playAcceptFateSound = () => {
    try {
        const ctx = getCtx();
        if (!ctx) return;
        safeResume(ctx);
        const t = ctx.currentTime;

        const notes = [220.00, 277.18, 329.63, 415.30];

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(freq, t);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, t);
            // Boosted volume from 0.04 to 0.15
            gain.gain.linearRampToValueAtTime(0.15, t + 0.05 + (i * 0.02)); 
            gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 1.6);
        });

        const bufferSize = ctx.sampleRate * 1.0;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(2000, t); 

        const noiseGain = ctx.createGain();
        // Boosted to 0.1
        noiseGain.gain.setValueAtTime(0.1, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4); 

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t);
        noise.stop(t + 0.5);
    } catch (e) {
        console.error("Error playing fate sound", e);
    }
};

export const playResetSound = () => {
    try {
        const ctx = getCtx();
        if (!ctx) return;
        safeResume(ctx);
        const t = ctx.currentTime;

        const bufferSize = ctx.sampleRate * 2.0;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(80, t);
        filter.frequency.exponentialRampToValueAtTime(800, t + 1.2);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, t);
        // Boosted volume from 0.15 to 0.3
        noiseGain.gain.linearRampToValueAtTime(0.3, t + 0.5); 
        noiseGain.gain.linearRampToValueAtTime(0, t + 1.5);   

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t);
        noise.stop(t + 1.6);

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, t);
        osc.frequency.linearRampToValueAtTime(90, t + 1.2); 

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0, t);
        // Boosted to 0.4
        oscGain.gain.linearRampToValueAtTime(0.4, t + 0.6);
        oscGain.gain.linearRampToValueAtTime(0, t + 1.4);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 1.5);
    } catch (e) {
        console.error("Error playing reset sound", e);
    }
};

// New sound for Page Turn / Modal Open
export const playPageTurnSound = () => {
    try {
        const ctx = getCtx();
        if (!ctx) return;
        safeResume(ctx);
        const t = ctx.currentTime;

        // Friction sound (Noise) to simulate paper sliding
        // Gentle, filtered noise
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Amplitude at 0.8
            data[i] = (Math.random() * 2 - 1) * 0.8;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        // Widened frequency sweep for more presence
        filter.frequency.setValueAtTime(200, t);
        filter.frequency.linearRampToValueAtTime(800, t + 0.3); 

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        // Raised Peak Gain to 0.2 (Louder)
        gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(t);
        noise.stop(t + 0.5);
    } catch (e) {
        console.error("Error playing page turn", e);
    }
}

// New sound for Close / Mechanical Thud
export const playCloseClickSound = () => {
     try {
        const ctx = getCtx();
        if (!ctx) return;
        safeResume(ctx);
        const t = ctx.currentTime;
        
        // A "thock" sound, dull and quick
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
     } catch (e) {
         console.error("Error playing close click", e);
     }
}