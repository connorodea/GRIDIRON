import os
import random
import cv2
import numpy as np
from faker import Faker
from PIL import Image, ImageDraw, ImageFont

# Set up Faker for metadata generation
fake = Faker()

# Output directories
IMAGE_DIR = "synthetic_dataset/images"
LABEL_DIR = "synthetic_dataset/labels"
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(LABEL_DIR, exist_ok=True)

# Constants for synthetic data
IMAGE_SIZE = (720, 1280)  # Height, Width
NUM_IMAGES = 100          # Number of synthetic images to generate
NUM_PLAYERS = 22          # Total players on the field (11 offense, 11 defense)

# Function to generate random bounding boxes
def generate_bounding_box(image_width, image_height):
    x_center = random.uniform(0.1, 0.9) * image_width
    y_center = random.uniform(0.1, 0.9) * image_height
    width = random.uniform(0.05, 0.1) * image_width
    height = random.uniform(0.05, 0.1) * image_height
    return x_center, y_center, width, height

# Function to generate synthetic image and labels
def create_synthetic_image(image_index):
    # Create a blank football field (green background)
    image = np.zeros((IMAGE_SIZE[0], IMAGE_SIZE[1], 3), dtype=np.uint8)
    image[:, :] = (34, 139, 34)  # RGB color for green (football field)

    # Add yard lines
    for y in range(50, IMAGE_SIZE[0], 100):
        cv2.line(image, (0, y), (IMAGE_SIZE[1], y), (255, 255, 255), 2)

    # Add hash marks
    for x in range(50, IMAGE_SIZE[1], 100):
        cv2.line(image, (x, 0), (x, IMAGE_SIZE[0]), (255, 255, 255), 1)

    # Synthetic labels for YOLO format
    labels = []

    # Add synthetic players (as colored circles)
    for player_id in range(NUM_PLAYERS):
        x_center, y_center, width, height = generate_bounding_box(IMAGE_SIZE[1], IMAGE_SIZE[0])
        
        # Draw a circle for the player
        player_color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        cv2.circle(image, (int(x_center), int(y_center)), int(width / 2), player_color, -1)
        
        # YOLO format: class_id, x_center, y_center, width, height (normalized)
        class_id = 0  # Use 0 for "Player" class
        labels.append(f"{class_id} {x_center / IMAGE_SIZE[1]:.6f} {y_center / IMAGE_SIZE[0]:.6f} {width / IMAGE_SIZE[1]:.6f} {height / IMAGE_SIZE[0]:.6f}")

    # Save the synthetic image
    image_path = os.path.join(IMAGE_DIR, f"synthetic_{image_index}.jpg")
    cv2.imwrite(image_path, image)

    # Save the corresponding YOLO labels
    label_path = os.path.join(LABEL_DIR, f"synthetic_{image_index}.txt")
    with open(label_path, "w") as label_file:
        label_file.write("\n".join(labels))

# Generate synthetic dataset
for i in range(NUM_IMAGES):
    create_synthetic_image(i)

print(f"Synthetic dataset created with {NUM_IMAGES} images and labels!")
