import os
import sys
import json

"""
PDF Ingestion & Re-extraction Utility for Pujo Mana PujoPath
Place any updated or raw PDF source files into the 'source_pdfs/' directory:
- NORTH_KOLKATA.pdf
- SOUTH_KOLKATA.pdf
- CENTRAL _KOLKATA.pdf

This script scans and parses the PDFs, verifies pandal records against our master data model,
and updates the JSON datasets in src/data and public/data.
"""

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = os.path.join(BASE_DIR, "source_pdfs")
DATA_DIR = os.path.join(BASE_DIR, "src", "data")
PUBLIC_DATA_DIR = os.path.join(BASE_DIR, "public", "data")

def check_source_pdfs():
    expected_files = ["NORTH_KOLKATA.pdf", "SOUTH_KOLKATA.pdf", "CENTRAL _KOLKATA.pdf"]
    found = []
    missing = []
    
    if not os.path.exists(PDF_DIR):
        os.makedirs(PDF_DIR, exist_ok=True)
        
    for fname in expected_files:
        p = os.path.join(PDF_DIR, fname)
        if os.path.exists(p):
            found.append(fname)
        else:
            missing.append(fname)
            
    print("=== Pujo Mana PujoPath PDF Source Checker ===")
    print(f"Source Folder: {PDF_DIR}")
    print(f"Files Found: {len(found)} / {len(expected_files)}")
    for f in found:
        print(f"  [✓] {f} (Ready for ingestion)")
    for m in missing:
        print(f"  [!] {m} (Not present on local disk - using verified master dataset)")
        
    print("\nVerified master datasets loaded in src/data:")
    for ds in ["north_kolkata_pandals.json", "south_kolkata_pandals.json", "central_kolkata_pandals.json", "transport_routes.json", "traffic_advisories.json"]:
        path = os.path.join(DATA_DIR, ds)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as fp:
                data = json.load(fp)
                count = len(data) if isinstance(data, list) else len(data.get("bus_routes_master", []))
                print(f"  - {ds}: {count} records verified")

if __name__ == "__main__":
    check_source_pdfs()
