#!/usr/bin/env python3
# filepath: /Users/jeremy.pastouret/Sites/Unlock/reboot/scripts/sort_services_alphabetically.py

import json
import os
from pathlib import Path

# Define paths
data_path = Path("../public/data/services.json")
backup_path = Path("../public/data/services_backup.json")

def main():
    print("Loading services data...")
    
    # Create a backup of the original file
    if not backup_path.exists():
        with open(data_path, 'r', encoding='utf-8') as original:
            with open(backup_path, 'w', encoding='utf-8') as backup:
                backup.write(original.read())
        print(f"Created backup at {backup_path}")
    
    # Read the services.json file
    with open(data_path, 'r', encoding='utf-8') as file:
        services = json.load(file)
    
    print(f"Loaded {len(services)} services.")
    
    # Sort services alphabetically by name
    # Use a case-insensitive sort for better results
    sorted_services = sorted(services, key=lambda s: s.get('name', '').lower() if s.get('name') else '')
    
    print("Services sorted alphabetically by name.")
    
    # Save the sorted services
    with open(data_path, 'w', encoding='utf-8') as file:
        json.dump(sorted_services, file, ensure_ascii=False, indent=2)
    
    print(f"Sorted services saved to {data_path}")
    
    # Display first few and last few services to confirm sort worked
    print("\nFirst 5 services after sorting:")
    for service in sorted_services[:5]:
        print(f"- {service.get('name', 'Unknown')}")
    
    print("\nLast 5 services after sorting:")
    for service in sorted_services[-5:]:
        print(f"- {service.get('name', 'Unknown')}")

if __name__ == "__main__":
    main()