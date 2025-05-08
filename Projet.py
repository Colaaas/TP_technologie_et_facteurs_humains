import pygame
import numpy as np
from bitalino import BITalino
import threading
import time
from collections import deque
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# =============================
# BITalino Setup
# =============================
macAddress = "98:D3:C1:FE:04:BB"
device = BITalino(macAddress)
device.start(1000, [0, 1])  # canal 0(A1) = EMG, canal 1(A2) = EDA

emg_value = 0
eda_value = 0

emg_history = deque([0]*500, maxlen=500)
eda_history = deque([0]*500, maxlen=500)

running = True
start_time = time.time()

# =============================
# Lecture BITalino
# =============================
def read_biosignals():
    global emg_value, eda_value
    while running:
        data = device.read(100)
        emg_signal = data[:, 5]  # Canal 0 pour EMG
        eda_signal = data[:, 6]  # Canal 1 pour EDA

        # Filtrage et normalisation du signal EMG
        emg_filtered = np.abs(emg_signal - np.mean(emg_signal))
        emg_value = np.clip(np.mean(emg_filtered), 0, 1023)

        # Lecture directe du signal EDA
        eda_value = np.clip(np.mean(eda_signal), 200, 800)

        # Historique pour les graphes
        emg_history.append(emg_value)
        eda_history.append(eda_value)

        time.sleep(0.01)

# =============================
# Matplotlib Graph
# =============================
def plot_signals():
    plt.style.use('ggplot')
    fig, (ax1, ax2) = plt.subplots(2, 1)
    fig.suptitle("Biosignaux en temps réel")

    line1, = ax1.plot([], [], label="EMG")
    line2, = ax2.plot([], [], label="EDA", color='orange')

    ax1.set_ylim(0, 300)
    ax2.set_ylim(200, 800)
    ax1.set_xlim(0, 500)
    ax2.set_xlim(0, 500)

    ax1.set_ylabel("EMG")
    ax2.set_ylabel("EDA")

    def update(frame):
        line1.set_ydata(emg_history)
        line1.set_xdata(np.arange(len(emg_history)))
        line2.set_ydata(eda_history)
        line2.set_xdata(np.arange(len(eda_history)))
        return line1, line2

    ani = FuncAnimation(fig, update, interval=100)
    plt.tight_layout()
    plt.show()

# =============================
# Pygame Setup
# =============================
pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong EMG + EDA")
font = pygame.font.Font(None, 48)
clock = pygame.time.Clock()

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

ball = pygame.Rect(WIDTH // 2, HEIGHT // 2, 20, 20)
ball_speed = [5, 5]
base_speed = 5
current_speed = base_speed
max_speed = base_speed + 3
min_speed = base_speed - 2

player = pygame.Rect(50, HEIGHT // 2 - 60, 10, 120)
opponent = pygame.Rect(WIDTH - 60, HEIGHT // 2 - 60, 10, 120)
player_score = 0
opponent_score = 0

def get_emg_position():
    max_emg = 80
    norm = np.clip(emg_value / max_emg, 0, 1)
    return int((1 - norm) * (HEIGHT - player.height))

def opponent_ai():
    if opponent.centery < ball.centery:
        opponent.y += 5
    else:
        opponent.y -= 5
    opponent.y = max(0, min(HEIGHT - opponent.height, opponent.y))

# =============================
# Lancer les threads
# =============================
threading.Thread(target=read_biosignals, daemon=True).start()
threading.Thread(target=plot_signals, daemon=True).start()

# =============================
# Boucle principale du jeu
# =============================
while running:
    elapsed_time = time.time() - start_time

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Couleur selon stress
    stress_norm = np.clip((eda_value - 300) / 300, 0, 1)
    stress_color = (int(255 * stress_norm), 0, 0)

    # Vitesse dynamique
    if elapsed_time > 10:
        if eda_value > 205:
            current_speed = max(min_speed, current_speed - 0.05)
        else:
            current_speed = min(max_speed, current_speed + 0.05)
    else:
        current_speed = base_speed

    ball_speed = [np.sign(ball_speed[0]) * current_speed,
                  np.sign(ball_speed[1]) * current_speed]

    # Contrôle EMG
    player.y = get_emg_position()
    player.y = max(0, min(HEIGHT - player.height, player.y))
    opponent_ai()

    # Déplacement balle
    ball.x += ball_speed[0]
    ball.y += ball_speed[1]

    if ball.top <= 0 or ball.bottom >= HEIGHT:
        ball_speed[1] *= -1
    if ball.colliderect(player) or ball.colliderect(opponent):
        ball_speed[0] *= -1

    if ball.left <= 0:
        opponent_score += 1
        ball.center = (WIDTH // 2, HEIGHT // 2)
    if ball.right >= WIDTH:
        player_score += 1
        ball.center = (WIDTH // 2, HEIGHT // 2)

    # Affichage
    screen.fill(stress_color)
    pygame.draw.rect(screen, WHITE, player)
    pygame.draw.rect(screen, WHITE, opponent)
    pygame.draw.ellipse(screen, WHITE, ball)
    pygame.draw.aaline(screen, WHITE, (WIDTH // 2, 0), (WIDTH // 2, HEIGHT))

    player_text = font.render(str(player_score), True, WHITE)
    opponent_text = font.render(str(opponent_score), True, WHITE)
    timer_text = font.render(f"{int(elapsed_time)}s", True, WHITE)

    screen.blit(player_text, (WIDTH // 2 - 60, 20))
    screen.blit(opponent_text, (WIDTH // 2 + 20, 20))
    screen.blit(timer_text, (WIDTH // 2 - 30, HEIGHT - 50))

    pygame.display.flip()
    clock.tick(60)

# =============================
# Fin
# =============================
running = False
device.stop()
device.close()
pygame.quit()