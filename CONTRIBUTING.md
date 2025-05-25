[🇬🇧 English](CONTRIBUTING.md) | [🇫🇷 Français](CONTRIBUTING_FR.md)

# How to Contribute: Updating or Adding a Company Fiche

This guide explains how to update an existing company fiche or add a new one in the repository, using the GitHub web interface and the `update-contributing` branch.

## 1. Understanding the Company Fiche File

Each company fiche is a JSON file located in `public/data/manual/[name].json`, where `[name]` is the company name (e.g., `amazon.json`).  
Below are the fields with explanations:

| Field | Description |
|-------|-------------|
| `name` | Name of the company. |
| `logo` | URL to the company logo. |
| `nationality` | Nationality of the company (e.g., `Américaine`). |
| `country_name` | Country where the company is based. |
| `country_code` | ISO country code (e.g., `us`). |
| `belongs_to_group` | Boolean: does the company belong to a group? (`true` or `false`) |
| `group_name` | Name of the parent group, if applicable. |
| `Applications` | Names of major applications or services of the company. |
| `permissions` | Data access permissions required or granted. |
| `contact_mail_export` | Email address used for data export requests. |
| `easy_access_data` | Information about easy access to data (if any). |
| `need_id_card` | Boolean: is an ID card required for requests? |
| `details_required_documents` | Details about required documents for data access. |
| `data_access_via_postal` | Boolean: is data access possible via postal mail? |
| `data_access_via_form` | Boolean: is data access possible via an online form? |
| `data_access_type` | Details on data access type (if not covered above). |
| `data_access_via_email` | Boolean: is data access possible via email? |
| `response_format` | Format of the response (file, zip, PDF, etc.). |
| `example_data_export` | Example of data export, if available. |
| `response_delay` | Usual response delay (e.g., `Réponse en 2 jours`). |
| `sanctioned_by_cnil` | Boolean: has the CNIL sanctioned the company? |
| `sanction_details` | Details and references to CNIL sanctions. |
| `data_transfer_policy` | Boolean: does the company have a data transfer policy? |
| `privacy_policy_quote` | Relevant quote from the privacy policy. |
| `transfer_destination_countries` | List of countries data may be transferred to. |
| `outside_eu_storage` | Is personal data stored outside the EU? |
| `comments` | Additional comments. |
| `created_at` | Date the fiche was created. |
| `created_by` | Author of the fiche. |
| `updated_at` | Last update date. |
| `updated_by` | Author of last update. |
| `app` | (Optional object) Application details: `{ "name": "...", "link": "..." }` |

---

## 2. Editing an Existing Fiche

1. **Go to the Repository on GitHub**  
   Open the repository and select the `update-contributing` branch using the branch selector.

2. **Navigate to the Fiche Directory**  
   Go to `public/data/manual/`.

3. **Find and Select the File**  
   Click on the JSON file you want to update (for example, `amazon.json`).

4. **Edit the File**  
   Click the pencil (✏️) icon (“Edit this file”).  
   Make your changes following the field explanations above.

5. **Commit the Changes**
    - Scroll to the bottom of the page.
    - Add a brief and descriptive commit message (e.g., "Update Amazon contact email").
    - Make sure "Commit directly to the update-contributing branch" is selected.
    - Click "Commit changes".

---

## 3. Adding a New Company Fiche

1. **Go to `public/data/manual/` Directory**  
   While on the `update-contributing` branch, navigate to this directory.

2. **Create a New File**
    - Click the “Add file” > “Create new file” button.
    - Name your file as `[companyname].json` (all lowercase; e.g., `newcompany.json`).

3. **Use the Fiche Skeleton**  
   Copy and paste this skeleton into the new file, and fill in the fields:

   ```json
   {
     "name": "",
     "logo": "",
     "nationality": "",
     "country_name": "",
     "country_code": "",
     "belongs_to_group": false,
     "group_name": "",
     "Applications": "",
     "permissions": "",
     "contact_mail_export": "",
     "easy_access_data": "",
     "need_id_card": false,
     "details_required_documents": "",
     "data_access_via_postal": false,
     "data_access_via_form": false,
     "data_access_type": "",
     "data_access_via_email": false,
     "response_format": "",
     "example_data_export": "",
     "response_delay": "",
     "sanctioned_by_cnil": false,
     "sanction_details": "",
     "data_transfer_policy": false,
     "privacy_policy_quote": "",
     "transfer_destination_countries": "",
     "outside_eu_storage": "",
     "comments": "",
     "created_at": "",
     "created_by": "",
     "updated_at": "",
     "updated_by": "",
     "app": {
       "name": "",
       "link": ""
     }
   }
   ```
   Fill in each field as completely as possible.

4. **Commit the New File**  
   As before, add a descriptive commit message, and commit directly to the `update-contributing` branch.

5. **Update the `slugs.json` File**
    - Go to `public/data/manual/slugs.json`.
    - Edit the file to add your new company's slug (the filename without `.json`) to the list or object as appropriate.
    - Commit your change.

---

## 4. Final Steps

- After your changes, you can create a Pull Request from the `update-contributing` branch to the main branch.
- Provide a summary of what you updated or added for easy review.

**Thank you for contributing!**