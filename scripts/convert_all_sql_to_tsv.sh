#!/bin/bash
# Convert all SQL files in sql_split directory to TSV format

SQL_DIR="sql_split"
TSV_DIR="tsv_output"

# Create output directory if it doesn't exist
mkdir -p "$TSV_DIR"

# Check if sql_split directory exists
if [ ! -d "$SQL_DIR" ]; then
    echo "Error: Directory '$SQL_DIR' not found"
    exit 1
fi

# Count total files
total_files=$(find "$SQL_DIR" -name "*.sql" | wc -l)
if [ "$total_files" -eq 0 ]; then
    echo "No SQL files found in '$SQL_DIR' directory"
    exit 0
fi

echo "Found $total_files SQL files to convert"
echo "Output will be saved to '$TSV_DIR/' directory"
echo ""

# Process each SQL file
count=0
for sql_file in "$SQL_DIR"/*.sql; do
    if [ -f "$sql_file" ]; then
        count=$((count + 1))
        filename=$(basename "$sql_file" .sql)
        output_file="$TSV_DIR/${filename}.tsv"

        echo "[$count/$total_files] Converting $filename.sql..."
        uv run python sql_to_tsv.py "$sql_file" "$output_file"
        echo ""
    fi
done

echo "All files converted successfully!"
