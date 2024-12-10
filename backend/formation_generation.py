import matplotlib.pyplot as plt
import random
import json

# Field dimensions
FIELD_LENGTH = 100  # Yards
FIELD_WIDTH = 50    # Yards

# Predefined formations
formations = {
    "Shotgun": {
        "QB": (25, 5),
        "RB": (25, 10),
        "WR1": (5, 0),
        "WR2": (45, 0),
        "WR3": (10, 15),
        "WR4": (40, 15),
        "OL1": (20, 20),
        "OL2": (22, 20),
        "OL3": (25, 20),
        "OL4": (28, 20),
        "OL5": (30, 20),
    },
    "4-3 Defense": {
        "DL1": (20, 25),
        "DL2": (25, 25),
        "DL3": (30, 25),
        "LB1": (20, 30),
        "LB2": (25, 30),
        "LB3": (30, 30),
        "CB1": (5, 5),
        "CB2": (45, 5),
        "S1": (15, 40),
        "S2": (35, 40),
    }
}

# Function to add random variation to positions
def add_variation(position, x_variation=1, y_variation=1):
    x, y = position
    return (x + random.uniform(-x_variation, x_variation),
            y + random.uniform(-y_variation, y_variation))

# Function to adjust formation for field position
def adjust_for_field_position(formation, line_of_scrimmage):
    return {pos: (coords[0], coords[1] + line_of_scrimmage) for pos, coords in formation.items()}

# Function to plot a formation
def plot_formation(formation_name, formation_data):
    plt.figure(figsize=(12, 6))
    
    # Draw field boundaries
    plt.plot([0, FIELD_WIDTH], [0, 0], 'g-', linewidth=3)  # End zone
    plt.plot([0, FIELD_WIDTH], [FIELD_LENGTH, FIELD_LENGTH], 'g-', linewidth=3)
    plt.plot([0, 0], [0, FIELD_LENGTH], 'g-', linewidth=3)
    plt.plot([FIELD_WIDTH, FIELD_WIDTH], [0, FIELD_LENGTH], 'g-', linewidth=3)
    plt.title(f"Formation: {formation_name}")
    plt.xlim(0, FIELD_WIDTH)
    plt.ylim(0, FIELD_LENGTH)
    
    # Draw hash marks
    for y in range(0, FIELD_LENGTH + 1, 10):
        plt.plot([20, 30], [y, y], 'k--', alpha=0.5)
    
    # Plot players
    for position, coords in formation_data.items():
        x, y = coords
        plt.scatter(x, y, s=100, label=position)
        plt.text(x, y + 1, position, fontsize=8, ha='center')
    
    plt.legend(loc='upper right', fontsize=8)
    plt.gca().invert_yaxis()  # Invert y-axis to match football field perspective
    plt.show()

# Function to generate a random formation
def generate_random_formation(base_formation, x_variation=5, y_variation=5):
    return {pos: add_variation(coords, x_variation, y_variation) for pos, coords in base_formation.items()}

# Save formations to JSON
def save_formations_to_json(formations, filename="formations.json"):
    with open(filename, "w") as f:
        json.dump(formations, f, indent=4)
    print(f"Formations saved to {filename}")

# Load formations from JSON
def load_formations_from_json(filename="formations.json"):
    with open(filename, "r") as f:
        return json.load(f)

# Main function to demonstrate functionality
def main():
    print("Available formations:")
    for name in formations.keys():
        print(f"- {name}")
    
    formation_name = input("Enter a formation name (e.g., 'Shotgun', '4-3 Defense'): ").strip()
    
    if formation_name not in formations:
        print(f"Formation '{formation_name}' not found.")
        return

    # Generate random formation
    base_formation = formations[formation_name]
    random_formation = generate_random_formation(base_formation)

    # Adjust for field position
    line_of_scrimmage = int(input("Enter line of scrimmage (in yards, 0-100): ").strip())
    adjusted_formation = adjust_for_field_position(random_formation, line_of_scrimmage)

    # Plot the formation
    plot_formation(formation_name, adjusted_formation)

    # Save the formation
    save_formations_to_json({formation_name: adjusted_formation})

    # Optionally load formations back
    loaded_formations = load_formations_from_json()
    print(f"Loaded formations: {loaded_formations}")

# Run the script
if __name__ == "__main__":
    main()
