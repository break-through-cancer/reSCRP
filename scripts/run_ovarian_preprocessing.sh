#!/bin/bash

# reSCRP Ovarian Cancer Data Preprocessing Script
# ===============================================
# This script runs the R preprocessing pipeline in a Docker container

set -e  # Exit on any error

echo "=== reSCRP Ovarian Cancer Data Preprocessing ==="
echo "Starting R preprocessing container..."

# Build the R processor image if it doesn't exist
echo "Building R processor Docker image..."
docker compose -f docker-compose-r.yml build r-processor

# Create necessary directories
echo "Creating output directories..."
mkdir -p data/processed/ovarian

# Run the preprocessing script
echo "Running ovarian cancer preprocessing..."
docker compose -f docker-compose-r.yml run --rm r-processor \
  Rscript /app/scripts/preprocess_scrna_ovarian.R

# Check if processing was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "=== Preprocessing Complete! ==="
    echo "Output files created in: ./data/processed/ovarian/"
    echo ""
    echo "Generated files:"
    ls -la data/processed/ovarian/ 2>/dev/null || echo "  (No files generated - check for errors above)"
    echo ""
    echo "To view processing logs, run:"
    echo "  docker compose -f docker-compose-r.yml logs r-processor"
else
    echo ""
    echo "=== Preprocessing Failed! ==="
    echo "Check the error messages above."
    echo "For debugging, run:"
    echo "  docker compose -f docker-compose-r.yml run --rm r-processor /bin/bash"
    exit 1
fi