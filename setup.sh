#!/bin/bash

# Create asset directories
mkdir -p public/assets/bg
mkdir -p public/assets/chars
mkdir -p public/assets/cg

# Add .gitkeep to ensure empty directories are tracked
touch public/assets/bg/.gitkeep
touch public/assets/chars/.gitkeep
touch public/assets/cg/.gitkeep

echo "Asset directory structure created successfully."
