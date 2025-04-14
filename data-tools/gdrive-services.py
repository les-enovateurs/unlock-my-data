import json

def load_json_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)
    
def save_json_file(data, file_path):
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)


def transform_and_merge(new_data, existing_list):
    # Iterate over the list of new data
    for data in new_data:
        # Skip entries with missing required fields
        if not data.get("Nom"):
            continue
            
        # Handle country name transformation
        country_name = None
        if data.get("Nationalité"):
            country_name = "China" if data["Nationalité"] == "Chine" else data["Nationalité"]
            country_name = "United States" if data["Nationalité"] == "Américaine" or data["Nationalité"] == "Américiane" else country_name
            country_name = "United Kingdom" if data["Nationalité"] == "Anglaise" else country_name
            country_name = "Netherlands" if data["Nationalité"] == "Néerlandaise" else country_name
            country_name = "Ireland" if data["Nationalité"] == "Irlandaise" else country_name
            country_name = "Sweden" if data["Nationalité"] == "Suède" else country_name
            country_name = "France" if data["Nationalité"] == "Française" else country_name
        
        # Get country code
        country_code = ""
        if country_name == "China":
            country_code = "cn"
        elif country_name == "United States":
            country_code = "us"
        elif country_name == "United Kingdom":
            country_code = "gb"
        elif country_name == "Netherlands":
            country_code = "nl"
        elif country_name == "Ireland":
            country_code = "ie"
        elif country_name == "Sweden":
            country_code = "se"
        elif country_name == "France":
            country_code = "fr"
        
        # Transform each dictionary in the list
        transformed_data = {
            "slug": data["Nom"].lower(),
            "name": data["Nom"],
            "logo": data["Logo (lien)"],
            "short_description": "",  # No equivalent field, can be filled manually
            "risk_level": -1,  # Default as no equivalent field
            "accessibility": int(data["Accessibilité des données"].split()[0]) if data.get("Accessibilité des données") else 0,
            "need_account": 1 if data.get("Demande de droit d'accès via mail") == "OUI" else 0,
            "need_id_card": 1 if data.get("Documents demandés pour l'exercice des droits") == "OUI" else 0,
            "contact_mail_export": data.get("Adresse mail demande de droit", ""),
            "contact_mail_delete": data.get("Adresse mail demande de droit", ""),
            "recipient_address": None,  # No equivalent field
            "how_to_export": data.get("Rendu de la réponse au demande de droit", ""),
            "url_delete": None,  # No equivalent field
            "url_export": data.get("Export de la demande de droit", ""),
            "last_update_breach": None,  # No equivalent field
            "country_name": country_name,
            "country_code": country_code,
            "number_app": 1,  # Assuming one app
            "number_breach": 0,  # Default as no breach info available
            "number_permission": len(data.get("Permissions (autorisations)", "").split(',')) if data.get("Permissions (autorisations)") else 0,
            "number_website": 1,  # Default as one website presence
            "number_website_cookie": 0  # No equivalent field
        }

        
        # If no match found, append the new data
        if transformed_data.get("country_name"):
            existing_list.append(transformed_data)

    return existing_list

# Example usage:
if __name__ == "__main__":
    new_company = load_json_file("../maj_data/entreprise/entreprise.json")
    existing_companies = load_json_file("../public/data/services.json")
    
    updated_list = transform_and_merge(new_company, existing_companies)
    
    save_json_file(updated_list, "./temp-services.json")
    # print(json.dumps(updated_list, indent=4, ensure_ascii=False))
