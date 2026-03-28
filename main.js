import pygame
import math

# --- CONFIGURATION (Matching Scratch Project Logic) ---
SCREEN_WIDTH = 640
SCREEN_HEIGHT = 480
FPS = 60
FOV = math.pi / 3  # 60 Degrees
HALF_FOV = FOV / 2
CASTED_RAYS = 120  # Number of vertical "Pen" lines (Adjust for performance)
STEP_ANGLE = FOV / CASTED_RAYS

# The Map (1 = Wall, 0 = Empty) - Based on the project's grid
MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]
TILE_SIZE = 64

# --- INITIALIZE ---
pygame.init()
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
clock = pygame.time.Clock()

# Player Variables (Scratch 'X', 'Y', 'Direction')
player_x = 150
player_y = 150
player_angle = 0

def draw_world():
    start_angle = player_angle - HALF_FOV
    
    for ray in range(CASTED_RAYS):
        for depth in range(1, 800, 2):  # Raymarching "Move 2 steps" loop
            target_x = player_x + math.cos(start_angle) * depth
            target_y = player_y + math.sin(start_angle) * depth
            
            # Identify which grid cell the ray is in
            col = int(target_x / TILE_SIZE)
            row = int(target_y / TILE_SIZE)
            
            # Check for Wall Hit
            if MAP[row][col] == 1:
                # Fix Fish-eye (Scratch logic: distance * cos(relative_angle))
                depth *= math.cos(player_angle - start_angle)
                
                # Calculate Wall Height (The "Pen" vertical size)
                wall_height = (TILE_SIZE * SCREEN_HEIGHT) / (depth + 0.0001)
                
                # Color shading (Darker further away)
                color_val = 255 / (1 + depth * depth * 0.0001)
                color = (color_val, color_val, color_val)
                
                # Draw the "Pen Line" (Vertical Rect)
                line_width = SCREEN_WIDTH / CASTED_RAYS
                pygame.draw.rect(screen, color, (
                    ray * line_width, 
                    (SCREEN_HEIGHT / 2) - (wall_height / 2),
                    line_width + 1, 
                    wall_height
                ))
                break
        
        start_angle += STEP_ANGLE

# --- MAIN LOOP ---
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Movement Logic (Matching Scratch Arrow Key Sensing)
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]: player_angle -= 0.05
    if keys[pygame.K_RIGHT]: player_angle += 0.05
    if keys[pygame.K_UP]:
        player_x += math.cos(player_angle) * 3
        player_y += math.sin(player_angle) * 3
    if keys[pygame.K_DOWN]:
        player_x -= math.cos(player_angle) * 3
        player_y -= math.sin(player_angle) * 3

    # Rendering
    screen.fill((20, 20, 20)) # Ceiling
    pygame.draw.rect(screen, (50, 50, 50), (0, SCREEN_HEIGHT/2, SCREEN_WIDTH, SCREEN_HEIGHT/2)) # Floor
    
    draw_world()
    
    pygame.display.flip()
    clock.tick(FPS)

pygame.quit()
