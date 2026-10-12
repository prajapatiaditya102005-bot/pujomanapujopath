import wave
import struct
import math
import random
import os

SAMPLE_RATE = 44100
DURATION = 15.0
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)

# Stereo buffers
left_channel = [0.0] * TOTAL_SAMPLES
right_channel = [0.0] * TOTAL_SAMPLES

def clamp(val, low=-1.0, high=1.0):
    return max(low, min(high, val))

def add_sample(ch, idx, val):
    if 0 <= idx < TOTAL_SAMPLES:
        ch[idx] += val

# 1. Authentic Dhak Deep Bass Strike (ধা / DHA)
def play_dha(t_start, vel=1.0, pan=-0.15):
    start_idx = int(t_start * SAMPLE_RATE)
    duration_s = 0.42
    n_samples = int(duration_s * SAMPLE_RATE)
    
    # Random slight pitch variation (+/- 2%) for organic live human dhaki feel
    pitch_mod = 1.0 + (random.random() - 0.5) * 0.04
    f_start = 165.0 * pitch_mod
    f_end = 82.0 * pitch_mod
    
    for i in range(n_samples):
        idx = start_idx + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SAMPLE_RATE
        
        # Pitch envelope (rapid exponential drop)
        freq = f_end + (f_start - f_end) * math.exp(-32.0 * t)
        phase = 2.0 * math.pi * (f_end * t + ((f_start - f_end) / 32.0) * (1.0 - math.exp(-32.0 * t)))
        
        # Main drum body fundamental + wood harmonic + sub thump
        drum_env = math.exp(-12.0 * t)
        drum_sub = math.sin(phase * 0.6) * math.exp(-16.0 * t) * 0.4
        drum_harm = math.sin(phase * 2.1) * math.exp(-22.0 * t) * 0.25
        drum_main = math.sin(phase) + drum_sub + drum_harm
        
        # Initial stick strike snap (first 18ms)
        stick_click = 0.0
        if t < 0.025:
            click_env = (1.0 - t / 0.025) ** 2
            stick_click = (random.random() * 2.0 - 1.0) * click_env * 0.35 + math.sin(2.0 * math.pi * 540.0 * t) * click_env * 0.3
            
        sample_val = (drum_main * drum_env * 0.85 + stick_click) * vel
        # Soft saturation / warmth
        sample_val = math.tanh(sample_val * 1.3) * 0.75
        
        # Stereo panning
        l_gain = math.cos((pan + 1.0) * math.pi / 4.0)
        r_gain = math.sin((pan + 1.0) * math.pi / 4.0)
        
        add_sample(left_channel, idx, sample_val * l_gain)
        add_sample(right_channel, idx, sample_val * r_gain)

# 2. Crisp Dhak Stick Slap on Rim/Taut Hide (তা / TA)
def play_ta(t_start, vel=0.85, pan=0.2):
    start_idx = int(t_start * SAMPLE_RATE)
    duration_s = 0.12
    n_samples = int(duration_s * SAMPLE_RATE)
    pitch_mod = 1.0 + (random.random() - 0.5) * 0.05
    f0 = 620.0 * pitch_mod
    
    for i in range(n_samples):
        idx = start_idx + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SAMPLE_RATE
        
        env = math.exp(-38.0 * t)
        tone = math.sin(2.0 * math.pi * f0 * t) * 0.6 + math.sin(2.0 * math.pi * f0 * 1.8 * t) * 0.3
        
        noise = 0.0
        if t < 0.035:
            noise_env = (1.0 - t / 0.035) ** 1.8
            noise = (random.random() * 2.0 - 1.0) * noise_env * 0.45
            
        sample_val = (tone * env + noise) * vel * 0.65
        
        l_gain = math.cos((pan + 1.0) * math.pi / 4.0)
        r_gain = math.sin((pan + 1.0) * math.pi / 4.0)
        add_sample(left_channel, idx, sample_val * l_gain)
        add_sample(right_channel, idx, sample_val * r_gain)

# 3. Fast Kathi Stick Tap (তি / কিটিং / KITING)
def play_kiting(t_start, vel=0.75, pan=0.25):
    start_idx = int(t_start * SAMPLE_RATE)
    duration_s = 0.08
    n_samples = int(duration_s * SAMPLE_RATE)
    pitch_mod = 1.0 + (random.random() - 0.5) * 0.06
    f0 = 760.0 * pitch_mod
    
    for i in range(n_samples):
        idx = start_idx + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SAMPLE_RATE
        
        env = math.exp(-55.0 * t)
        tone = math.sin(2.0 * math.pi * f0 * t) * 0.5
        noise = (random.random() * 2.0 - 1.0) * math.exp(-60.0 * t) * 0.5
        sample_val = (tone + noise) * vel * 0.55
        
        l_gain = math.cos((pan + 1.0) * math.pi / 4.0)
        r_gain = math.sin((pan + 1.0) * math.pi / 4.0)
        add_sample(left_channel, idx, sample_val * l_gain)
        add_sample(right_channel, idx, sample_val * r_gain)

# 4. Rapid Dhak Roll (গুর-গুর / GUR-GUR)
def play_roll(t_start, duration_s, count, vel=0.6, pan=0.0):
    interval = duration_s / count
    for c in range(count):
        t_hit = t_start + c * interval
        # Alternate left-right kathi flutter
        p = -0.1 if (c % 2 == 0) else 0.15
        v = vel * (0.8 + 0.4 * (c / count))
        play_kiting(t_hit, vel=v, pan=p)

# 5. Metallic Resonant Kanshor Bell / Gong (কাঁসর ঘণ্টা / KANSHOR)
def play_kanshor(t_start, vel=0.65, pan=0.35):
    start_idx = int(t_start * SAMPLE_RATE)
    duration_s = 1.1
    n_samples = int(duration_s * SAMPLE_RATE)
    
    f1 = 1530.0
    f2 = 2415.0
    f3 = 3720.0
    f4 = 925.0
    
    for i in range(n_samples):
        idx = start_idx + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SAMPLE_RATE
        
        # Bell sustain with slow flutter
        flutter = 1.0 + 0.08 * math.sin(2.0 * math.pi * 5.5 * t)
        env = math.exp(-4.2 * t) * flutter
        
        b1 = math.sin(2.0 * math.pi * f1 * t) * 0.5
        b2 = math.sin(2.0 * math.pi * f2 * t) * 0.35
        b3 = math.sin(2.0 * math.pi * f3 * t) * 0.18
        b4 = math.sin(2.0 * math.pi * f4 * t) * 0.25
        
        # Initial strike click
        strike = 0.0
        if t < 0.015:
            strike = (random.random() * 2.0 - 1.0) * (1.0 - t / 0.015) * 0.3
            
        sample_val = ((b1 + b2 + b3 + b4) * env + strike) * vel * 0.45
        
        l_gain = math.cos((pan + 1.0) * math.pi / 4.0)
        r_gain = math.sin((pan + 1.0) * math.pi / 4.0)
        add_sample(left_channel, idx, sample_val * l_gain)
        add_sample(right_channel, idx, sample_val * r_gain)

# --- SCORE COMPOSITION: 15-SECOND AUTHENTIC DURGA PUJA DHAK & KANSHOR BOL ---
print("Arranging 15-Second Durga Puja Dhak & Kanshor Symphony...")

# PHASE 1 (0.0s to 4.2s): Traditional Sacred Agomoni Puja Opening (Tempo ~ 124 BPM)
# Bol: Ta-kiting ta-kiting DHA! Ta-kiting ta-kiting DHA!
bpm_p1 = 124.0
beat_p1 = 60.0 / bpm_p1  # ~0.484s per beat

t = 0.25
# Kanshor keeping sacred metric beat
for k in range(8):
    play_kanshor(t + k * beat_p1, vel=0.55 if k % 2 == 0 else 0.4)

# Bar 1
play_ta(t, vel=0.75)
play_kiting(t + 0.12, vel=0.7)
play_kiting(t + 0.24, vel=0.75)
play_dha(t + beat_p1, vel=0.95)

play_ta(t + 2 * beat_p1, vel=0.8)
play_kiting(t + 2 * beat_p1 + 0.12, vel=0.7)
play_kiting(t + 2 * beat_p1 + 0.24, vel=0.75)
play_dha(t + 3 * beat_p1, vel=1.0)

# Bar 2 with roll transition
t2 = t + 4 * beat_p1
play_ta(t2, vel=0.8)
play_kiting(t2 + 0.12, vel=0.7)
play_dha(t2 + beat_p1, vel=0.95)
play_roll(t2 + 2 * beat_p1, beat_p1 * 0.9, count=6, vel=0.7)
play_dha(t2 + 3 * beat_p1, vel=1.05)


# PHASE 2 (4.2s to 10.4s): Energetic Festive Dhunuchi & Pandal Chalan (Tempo ~ 142 BPM)
# Bol: DHA-kiting-kiting DHA! DHA-kiting-kiting DHA! 
# Ta-kiting DHA, Ta-kiting DHA, DHA-kiting-kiting-kiting DHA!
bpm_p2 = 142.0
beat_p2 = 60.0 / bpm_p2  # ~0.422s per beat
sixteenth = beat_p2 / 4.0

t_p2 = 4.35
# Kanshor driving the fast energetic festival pace
n_beats_p2 = 14
for k in range(n_beats_p2):
    play_kanshor(t_p2 + k * beat_p2, vel=0.65 if k % 2 == 0 else 0.45)

# 4 Bars of rhythmic acceleration
for bar in range(3):
    bar_start = t_p2 + bar * (4 * beat_p2)
    # Beat 1: DHA - kiting - kiting
    play_dha(bar_start, vel=1.0)
    play_kiting(bar_start + sixteenth * 2, vel=0.75)
    play_kiting(bar_start + sixteenth * 3, vel=0.8)
    
    # Beat 2: DHA
    play_dha(bar_start + beat_p2, vel=0.95)
    
    # Beat 3: Ta - kiting
    play_ta(bar_start + beat_p2 * 2, vel=0.85)
    play_kiting(bar_start + beat_p2 * 2 + sixteenth * 2, vel=0.75)
    
    # Beat 4: DHA with roll or double slap
    if bar == 2:
        play_roll(bar_start + beat_p2 * 3, beat_p2 * 0.9, count=7, vel=0.8)
    else:
        play_kiting(bar_start + beat_p2 * 3, vel=0.75)
        play_kiting(bar_start + beat_p2 * 3 + sixteenth * 2, vel=0.8)
        play_dha(bar_start + beat_p2 * 3 + sixteenth * 3, vel=0.9)


# PHASE 3 (10.4s to 15.0s): Grand Tihai Finale & Celebratory Climax (Tempo ~ 152 BPM)
# Bol: Dha-kiting-DHA! (1), Dha-kiting-DHA! (2), Dha-kiting-DHA! (3) - DHA! DHA! DHAAA!
bpm_p3 = 152.0
beat_p3 = 60.0 / bpm_p3  # ~0.395s
t_p3 = 10.4

# Fast ringing Kanshor bell
for k in range(9):
    play_kanshor(t_p3 + k * beat_p3, vel=0.75)

# Tihai iteration 1
play_dha(t_p3, vel=1.05)
play_kiting(t_p3 + 0.1, vel=0.8)
play_ta(t_p3 + 0.2, vel=0.85)
play_dha(t_p3 + beat_p3, vel=1.1)

# Tihai iteration 2
t_ti2 = t_p3 + beat_p3 * 2
play_dha(t_ti2, vel=1.1)
play_kiting(t_ti2 + 0.1, vel=0.85)
play_ta(t_ti2 + 0.2, vel=0.9)
play_dha(t_ti2 + beat_p3, vel=1.15)

# Tihai iteration 3
t_ti3 = t_ti2 + beat_p3 * 2
play_dha(t_ti3, vel=1.15)
play_kiting(t_ti3 + 0.09, vel=0.9)
play_ta(t_ti3 + 0.18, vel=0.95)
play_dha(t_ti3 + beat_p3 * 0.9, vel=1.2)

# Roll leading to final triple thunderous strike
t_final_roll = t_ti3 + beat_p3 * 1.8
play_roll(t_final_roll, 0.45, count=10, vel=0.9)

# Triple final accents: DHA! DHA! DHAAAA!
t_end = t_final_roll + 0.5
play_dha(t_end, vel=1.25)
play_kanshor(t_end, vel=0.85)

play_dha(t_end + 0.35, vel=1.3)
play_kanshor(t_end + 0.35, vel=0.9)

# Final Grand Climax Strike with booming bass and shimmering gong
t_grand = t_end + 0.72
play_dha(t_grand, vel=1.4)
play_kanshor(t_grand, vel=1.0)
play_kanshor(t_grand + 0.05, vel=0.85) # Resonant double bell


# --- PANDAL COURTYARD STEREO ACOUSTIC REVERB SIMULATION ---
print("Applying Festive Pandal Acoustic Reverb...")
delay_samples_l = int(0.048 * SAMPLE_RATE)
delay_samples_r = int(0.062 * SAMPLE_RATE)
feedback = 0.28

for i in range(TOTAL_SAMPLES):
    if i >= delay_samples_l:
        left_channel[i] += left_channel[i - delay_samples_l] * feedback * 0.5 + right_channel[i - delay_samples_l] * feedback * 0.5
    if i >= delay_samples_r:
        right_channel[i] += right_channel[i - delay_samples_r] * feedback * 0.5 + left_channel[i - delay_samples_r] * feedback * 0.5

# --- MASTERING: PEAK NORMALIZATION & SMOOTH 15.0s BOUNDARY FADES ---
print("Mastering and writing 16-bit 44.1kHz stereo WAV file...")

# Fade in (first 0.04s)
fade_in_samples = int(0.04 * SAMPLE_RATE)
for i in range(fade_in_samples):
    gain = i / fade_in_samples
    left_channel[i] *= gain
    right_channel[i] *= gain

# Fade out at the very tail (14.75s to 15.0s) so it ends gently with zero clicks
fade_out_start = int(14.75 * SAMPLE_RATE)
for i in range(fade_out_start, TOTAL_SAMPLES):
    gain = (TOTAL_SAMPLES - i) / (TOTAL_SAMPLES - fade_out_start)
    left_channel[i] *= gain
    right_channel[i] *= gain

# Peak normalization
max_peak = 0.0
for i in range(TOTAL_SAMPLES):
    max_peak = max(max_peak, abs(left_channel[i]), abs(right_channel[i]))

if max_peak > 0.0:
    norm_factor = 0.92 / max_peak
    for i in range(TOTAL_SAMPLES):
        left_channel[i] = clamp(left_channel[i] * norm_factor)
        right_channel[i] = clamp(right_channel[i] * norm_factor)

os.makedirs('public/audio', exist_ok=True)
output_path = 'public/audio/durga_puja_dhak_15s.wav'

with wave.open(output_path, 'w') as wav_file:
    wav_file.setnchannels(2)        # Stereo
    wav_file.setsampwidth(2)        # 16-bit
    wav_file.setframerate(SAMPLE_RATE)
    
    raw_frames = bytearray()
    for i in range(TOTAL_SAMPLES):
        l_int = int(left_channel[i] * 32767.0)
        r_int = int(right_channel[i] * 32767.0)
        raw_frames.extend(struct.pack('<hh', l_int, r_int))
        
    wav_file.writeframes(raw_frames)

file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
print(f"[SUCCESS] Successfully generated: {output_path}")
print(f"[INFO] Duration: {DURATION:.1f} seconds | File Size: {file_size_mb:.2f} MB")
