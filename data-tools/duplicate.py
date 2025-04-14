#!/usr/bin/env python3
# filepath: find_duplicates.py

import json
import collections
from pathlib import Path

def find_duplicates(json_file_path):
    """Find duplicate entries in services.json based on slug field."""
    
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as file:
        services = json.load(file)
    
    # Extract all slugs
    slugs = [service['slug'] for service in services]
    
    # Count occurrences of each slug
    slug_counts = collections.Counter(slugs)
    
    # Filter slugs that appear more than once
    duplicates = {slug: count for slug, count in slug_counts.items() if count > 1}
    
    if duplicates:
        print(f"Found {len(duplicates)} duplicate slugs:")
        for slug, count in duplicates.items():
            print(f"  '{slug}' appears {count} times")
            
            # Find the indices of each occurrence
            indices = [i for i, service in enumerate(services) if service['slug'] == slug]
            for idx in indices:
                print(f"    - Index {idx}: {services[idx]['name']}")
    else:
        print("No duplicates found.")
    
    return duplicates

if __name__ == "__main__":
    json_path = Path("../public/data/services.json")
    find_duplicates(json_path)