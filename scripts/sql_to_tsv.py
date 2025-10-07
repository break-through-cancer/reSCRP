#!/usr/bin/env python3
"""
Convert INSERT statements from a SQL file into a TSV (Tab-Separated Values) file.
Extracts column names from CREATE TABLE and data from INSERT statements.
"""

import re
import sys
import os
from pathlib import Path


def extract_column_names(create_table_line, file_handle):
    """
    Extract column names from CREATE TABLE statement.

    Args:
        create_table_line: First line of CREATE TABLE
        file_handle: Open file handle to read continuation lines

    Returns:
        List of column names
    """
    columns = []

    # Read until we find the closing parenthesis
    content = create_table_line
    if ')' not in content:
        for line in file_handle:
            content += ' ' + line
            if ')' in line:
                break

    # Extract content between parentheses
    match = re.search(r'\((.*?)\)', content, re.DOTALL)
    if not match:
        return columns

    table_def = match.group(1)

    # Parse each line for column definitions
    for line in table_def.split(','):
        line = line.strip()
        # Skip constraints and keys
        if any(keyword in line.upper() for keyword in ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'KEY ', 'CONSTRAINT', 'INDEX']):
            continue

        # Extract column name (first word, removing backticks)
        col_match = re.match(r'`?(\w+)`?', line)
        if col_match:
            columns.append(col_match.group(1))

    return columns


def parse_insert_values(insert_line):
    """
    Parse VALUES from INSERT statement.

    Args:
        insert_line: INSERT statement line

    Returns:
        List of rows, where each row is a list of values
    """
    rows = []

    # Extract everything after VALUES
    values_match = re.search(r'VALUES\s*(.+)', insert_line, re.IGNORECASE)
    if not values_match:
        return rows

    values_str = values_match.group(1).rstrip(';').strip()

    # Split by ),( to get individual rows
    # Handle the outer parentheses
    values_str = values_str.strip()
    if values_str.startswith('('):
        values_str = values_str[1:]
    if values_str.endswith(')'):
        values_str = values_str[:-1]

    # Split on "),(" pattern
    row_strings = re.split(r'\)\s*,\s*\(', values_str)

    for row_str in row_strings:
        row_str = row_str.strip()
        values = []

        # Parse values handling quotes and escapes
        current_value = ''
        in_quote = False
        quote_char = None
        escaped = False

        i = 0
        while i < len(row_str):
            char = row_str[i]

            if escaped:
                current_value += char
                escaped = False
                i += 1
                continue

            if char == '\\':
                escaped = True
                current_value += char
                i += 1
                continue

            if char in ("'", '"') and not in_quote:
                in_quote = True
                quote_char = char
                i += 1
                continue

            if char == quote_char and in_quote:
                in_quote = False
                quote_char = None
                i += 1
                continue

            if char == ',' and not in_quote:
                # End of value
                value = current_value.strip()
                # Handle NULL
                if value.upper() == 'NULL':
                    value = ''
                # Unescape common SQL escapes
                value = value.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
                values.append(value)
                current_value = ''
                i += 1
                continue

            current_value += char
            i += 1

        # Add last value
        if current_value or not values:
            value = current_value.strip()
            if value.upper() == 'NULL':
                value = ''
            value = value.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
            values.append(value)

        if values:
            rows.append(values)

    return rows


def sql_to_tsv(input_file, output_file=None):
    """
    Convert SQL INSERT statements to TSV format.

    Args:
        input_file: Path to SQL file
        output_file: Path to output TSV file (optional)
    """
    if output_file is None:
        output_file = Path(input_file).stem + '.tsv'

    columns = []
    rows_written = 0

    print(f"Converting {input_file} to {output_file}...")

    with open(input_file, 'r', encoding='utf-8', errors='ignore') as infile:
        with open(output_file, 'w', encoding='utf-8') as outfile:

            for line in infile:
                # Extract column names from CREATE TABLE
                if re.match(r'CREATE TABLE', line, re.IGNORECASE):
                    columns = extract_column_names(line, infile)
                    if columns:
                        # Write header
                        outfile.write('\t'.join(columns) + '\n')
                        print(f"  Found {len(columns)} columns: {', '.join(columns[:5])}" +
                              ('...' if len(columns) > 5 else ''))

                # Parse INSERT statements
                if re.match(r'INSERT INTO', line, re.IGNORECASE):
                    rows = parse_insert_values(line)
                    for row in rows:
                        # Pad or trim row to match column count
                        if len(row) < len(columns):
                            row.extend([''] * (len(columns) - len(row)))
                        elif len(row) > len(columns):
                            row = row[:len(columns)]

                        outfile.write('\t'.join(row) + '\n')
                        rows_written += 1

    print(f"  Wrote {rows_written} rows")
    print(f"Done! TSV file saved to '{output_file}'")


def main():
    if len(sys.argv) < 2:
        print("Usage: python sql_to_tsv.py <sql_file> [output_tsv_file]")
        print("Example: python sql_to_tsv.py users.sql users.tsv")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found")
        sys.exit(1)

    sql_to_tsv(input_file, output_file)


if __name__ == "__main__":
    main()
