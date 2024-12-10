import os
import math
import streamlit as st
import pandas as pd
import numpy as np
from PIL import Image, ImageSequence, ImageDraw
import plotly.express as px
import matplotlib.pyplot as plt
from ultralytics import YOLO
from sort import Sort
from dotenv import load_dotenv

# Load API key (if applicable)
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize YOLOv8 model
yolo_model = YOLO("yolov8n.pt")

# Initialize SORT tracker
tracker = Sort()

# Function to extract frames from GIF
def extract_frames_from_gif(file):
    frames = []
    gif = Image.open(file)
    for frame_idx, frame in enumerate(ImageSequence.Iterator(gif)):
        frame = frame.convert("RGB")  # Convert to RGB format
        frames.append((frame_idx, frame))
    return frames

# Function to detect players using YOLO
def detect_players(frame):
    frame_np = np.array(frame)  # Convert to NumPy array
    results = yolo_model.predict(frame_np, save=False, conf=0.5)
    detections = [
        [box[0], box[1], box[2], box[3], box[4]]  # x1, y1, x2, y2, confidence
        for box in results[0].boxes.data.tolist() if int(box[5]) == 0
    ]  # Filter for "person" class only
    return np.array(detections)

# Function to calculate velocity and acceleration
def calculate_motion_metrics(tracked_positions):
    metrics = []
    for idx in range(1, len(tracked_positions)):
        prev = tracked_positions[idx - 1]
        curr = tracked_positions[idx]

        # Calculate distance
        dist = math.sqrt((curr["X"] - prev["X"])**2 + (curr["Y"] - prev["Y"])**2)

        # Calculate velocity (distance per frame)
        velocity = dist / (curr["Frame"] - prev["Frame"])

        # Calculate acceleration
        if idx > 1:
            prev_velocity = metrics[-1]["Velocity"]
            acceleration = (velocity - prev_velocity) / (curr["Frame"] - prev["Frame"])
        else:
            acceleration = 0

        metrics.append({
            "Frame": curr["Frame"],
            "ID": curr["ID"],
            "X": curr["X"],
            "Y": curr["Y"],
            "Velocity": velocity,
            "Acceleration": acceleration
        })
    return metrics

# Function to overlay bounding boxes and motion metrics
def overlay_annotations(frame, tracked_objects, metrics):
    draw = ImageDraw.Draw(frame)
    for obj in tracked_objects:
        x1, y1, x2, y2, track_id = obj[:5]
        draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
        draw.text((x1, y1 - 10), f"ID: {int(track_id)}", fill="blue")

    for metric in metrics:
        draw.text((metric["X"], metric["Y"]), f"V: {metric['Velocity']:.2f}", fill="green")
    return frame

# Streamlit app
def main():
    # Add logo
    st.sidebar.image("/Volumes/G-DRIVE/Dec24/GridironAI/Static/Logo.png", use_column_width=True)

    st.title("Optimized Motion Tracking for Football Analysis")
    st.write("Upload GIF files to analyze motion, trajectories, and advanced player tracking.")

    uploaded_files = st.file_uploader("Upload GIF Files", type=["gif"], accept_multiple_files=True)

    if uploaded_files:
        for uploaded_file in uploaded_files:
            st.write(f"Processing: {uploaded_file.name}")
            frames = extract_frames_from_gif(uploaded_file)
            tracked_positions = []  # Store tracked player positions

            for idx, frame in frames:
                st.write(f"Analyzing Frame {idx}...")
                detections = detect_players(frame)

                # Track players using SORT
                tracked_objects = tracker.update(detections)

                # Store tracked positions
                for obj in tracked_objects:
                    x1, y1, x2, y2, track_id = obj
                    center_x = (x1 + x2) / 2
                    center_y = (y1 + y2) / 2
                    tracked_positions.append({
                        "Frame": idx,
                        "ID": int(track_id),
                        "X": center_x,
                        "Y": center_y
                    })

                # Calculate motion metrics
                metrics = calculate_motion_metrics(tracked_positions)

                # Overlay annotations and motion metrics
                annotated_frame = overlay_annotations(frame, tracked_objects, metrics)
                st.image(annotated_frame, caption=f"Frame {idx} with Motion Analysis", use_column_width=True)

            # Convert tracked positions to DataFrame
            position_df = pd.DataFrame(tracked_positions)

            # Visualize player trajectories
            st.subheader("Player Trajectories")
            fig = px.line(
                position_df,
                x="X",
                y="Y",
                color="ID",
                line_group="ID",
                title="Player Trajectories",
                labels={"X": "Horizontal Position", "Y": "Vertical Position"},
            )
            st.plotly_chart(fig, use_container_width=True)

if __name__ == "__main__":
    main()
