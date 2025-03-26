#!/usr/bin/env python3
# filepath: /Users/jeremy.pastouret/Sites/Unlock/reboot/scripts/order_services_by_risk.py

import json
import os
from pathlib import Path

# Define paths
project_root = Path("/Users/jeremy.pastouret/Sites/Unlock/reboot")
data_path = project_root / "public" / "data" / "services.json"
output_path = project_root / "public" / "data" / "services_ordered.json"

def main():
    print("Loading services data...")
    
    # Read the services.json file
    with open(data_path, 'r', encoding='utf-8') as file:
        services = json.load(file)
    
    print(f"Loaded {len(services)} services.")
    
    # Sort services by risk_level in descending order (-1 values will be at the end)
    # Use name as a secondary sort key for services with the same risk level
    def sort_key(service):
        # Place -1 (unknown risk level) at the end by converting to a tuple
        # (0: for known risk levels, 1: for unknown (-1))
        # Then actual risk level (negate for descending order)
        # Then name for alphabetical sorting within same risk level
        risk = service.get('risk_level', -1)
        return (1 if risk == -1 else 0, -risk if risk != -1 else 0, service.get('name', '').lower())
    
    sorted_services = sorted(services, key=sort_key)
    
    print("Services sorted by risk level (highest to lowest, unknown risk at end).")
    
    # Save the sorted services to a new file
    with open(output_path, 'w', encoding='utf-8') as file:
        json.dump(sorted_services, file, ensure_ascii=False, indent=2)
    
    print(f"Sorted services saved to {output_path}")
    
    # Show some stats about risk levels
    risk_levels = {}
    for service in services:
        risk = service.get('risk_level', -1)
        risk_levels[risk] = risk_levels.get(risk, 0) + 1
    
    print("\nRisk level distribution:")
    for risk in sorted(risk_levels.keys(), reverse=True):
        level_name = "Unknown" if risk == -1 else str(risk)
        print(f"  Risk level {level_name}: {risk_levels[risk]} services")
    
    # Option to replace the original file
    replace = input("\nDo you want to replace the original services.json file? (y/n): ")
    if replace.lower() == 'y':
        with open(data_path, 'w', encoding='utf-8') as file:
            json.dump(sorted_services, file, ensure_ascii=False, indent=2)
        print(f"Original file {data_path} has been replaced with sorted data.")
    else:
        print("Original file kept unchanged.")

if __name__ == "__main__":
    main()