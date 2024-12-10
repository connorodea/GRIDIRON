#!/bin/bash

# Ensure the script is executed inside the correct directory
if [ ! -f "README.md" ]; then
  echo "Error: This script must be run from the root of the GridironAI project. Exiting."
  exit 1
fi

# Create recommended directory structure
mkdir -p app/api
mkdir -p backend
mkdir -p components
mkdir -p corpus
mkdir -p dataset/train/images dataset/train/labels
mkdir -p dataset/val/images dataset/val/labels
mkdir -p lib
mkdir -p static
mkdir -p synthetic_dataset/images synthetic_dataset/labels

# Move files to appropriate directories
# Frontend files
mv app.py backend/ 2>/dev/null
mv sort.py backend/ 2>/dev/null
mv synthetic_data_generation.py backend/ 2>/dev/null
mv formation_generation.py backend/ 2>/dev/null
mv formations.json backend/ 2>/dev/null

# Components
mv components/*.tsx components/ 2>/dev/null

# Corpus (raw data)
mv corpus/*.pdf corpus/ 2>/dev/null
mv corpus/LaneKiffin corpus/ 2>/dev/null

# Static assets
mv Static/Logo.png static/ 2>/dev/null

# Utility scripts
mv lib/analysis.ts lib/ 2>/dev/null

# Synthetic dataset
mv synthetic_dataset/images synthetic_dataset/ 2>/dev/null
mv synthetic_dataset/labels synthetic_dataset/ 2>/dev/null

# Node.js and project-level files
mv *.json ./ 2>/dev/null
mv requirements.txt ./ 2>/dev/null
mv README.md ./ 2>/dev/null

# YOLOv8 weights and example files
mv yolov8n.pt ./ 2>/dev/null
mv SORT-MOT17-06-FRCNN.webm ./ 2>/dev/null
mv Gridiron_Data_Points.csv ./ 2>/dev/null

# Clean up empty directories
find . -type d -empty -delete

echo "Project reorganized successfully!"
