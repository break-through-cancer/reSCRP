#!/usr/bin/env python3
"""
Split a large SQL dump file into multiple smaller files by table.
Each table's CREATE TABLE statement and INSERT statements will be saved to a separate file.
"""

import re
import sys
import os
from pathlib import Path


def split_sql_dump(input_file, output_dir="sql_split"):
    """
    Split a SQL dump file into separate files per table.

    Args:
        input_file: Path to the SQL dump file
        output_dir: Directory where split files will be saved
    """
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(exist_ok=True)

    current_table = None
    current_file = None
    header_lines = []
    in_header = True

    print(f"Processing {input_file}...")

    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            # Collect header comments and settings (before first CREATE TABLE)
            if in_header and (line.startswith('--') or
                            line.startswith('/*') or
                            line.strip().startswith('SET') or
                            line.strip().startswith('/*!') or
                            line.strip() == ''):
                header_lines.append(line)
                continue

            # Detect CREATE TABLE statement
            create_match = re.match(r'CREATE TABLE\s+`?(\w+)`?', line, re.IGNORECASE)
            if create_match:
                in_header = False

                # Close previous file if open
                if current_file:
                    current_file.close()
                    print(f"  Saved {current_table}.sql")

                # Start new table file
                current_table = create_match.group(1)
                output_path = os.path.join(output_dir, f"{current_table}.sql")
                current_file = open(output_path, 'w', encoding='utf-8')

                # Write header to new file
                for header_line in header_lines:
                    current_file.write(header_line)
                if header_lines:
                    current_file.write('\n')

                print(f"  Processing table: {current_table}")

            # Write line to current file
            if current_file:
                current_file.write(line)

    # Close last file
    if current_file:
        current_file.close()
        print(f"  Saved {current_table}.sql")

    print(f"\nDone! Split files saved to '{output_dir}/' directory")


def main():
    if len(sys.argv) < 2:
        print("Usage: python split_sql_dump.py <sql_dump_file> [output_directory]")
        print("Example: python split_sql_dump.py dump.sql sql_split")
        sys.exit(1)

    input_file = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "sql_split"

    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found")
        sys.exit(1)

    split_sql_dump(input_file, output_dir)


if __name__ == "__main__":
    main()
