# Migrate from Notion to Anytype

## Step 1: Create a Notion Integration
1. In Notion, go to **Settings** > **Connections** > **Develop or manage integrations**.
2. Click **New integration** and give it a name. Set the type to **Internal**.
3. Under **Capabilities**, enable **Read content** and **Read user information**. Save changes.
4. Under **Access**, select the Teamspace and all root pages you want to import. Update access.
5. Copy the **Internal Integration Secret**. You will need this for the import.

## Step 2: Import into Anytype
1. In Anytype, open your space's settings (top left), select **Import**, and choose **Notion**.
2. Enter the Integration Secret and click **Import data**.
3. Confirm and wait for the import to finish. For best results:
   - Use a stable internet connection.
   - Keep your computer plugged in.
   - Disable sleep mode.

**Note:** Some Notion features may not be fully supported in Anytype. Check your imported data for completeness.

For more details, see the [official Anytype documentation](https://doc.anytype.io/anytype-docs/advanced/data-and-security/import-export/migrate-from-notion).
