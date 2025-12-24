import servicesData from "@/public/data/services.json";
import Manual from "@/components/company/manual";
import fs from "fs/promises";
import path from "path";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// Types for permissions data
type Permission = {
    permission_id: number;
    permission_title?: string;
    permission_description?: string;
    category_id?: number;
    category_icon?: string;
    category_title?: string;
    category_risk_level?: number;
};

type CompanyApp = {
    app_title: string;
    app_icon: string;
    app_last_update: string;
    list_permissions: Permission[];
};

// Function to check if permission data exists for a company
async function permissionDataExists(normalizedName: string): Promise<boolean> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'oldway', `${normalizedName}.json`);
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Function to load permission data statically
async function getPermissionData(normalizedName: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'oldway', `${normalizedName}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');

    // Remove the outer quotes from the file content if they exist
    const jsonContent = fileContent.startsWith('"') && fileContent.endsWith('"')
      ? JSON.parse(fileContent) // Parse the JSON string
      : fileContent;

    return JSON.parse(jsonContent);
  } catch (error) {
    console.warn(`No permissions data file found for ${normalizedName}`);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    // Generate parameters for each company
    return servicesData
      .map((company) => ({
          slug: company.slug
      }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    // In case of error, return at least one empty parameter
    return [{ slug: "default" }];
  }
}

// Generate dynamic metadata for each company detail page
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const company = servicesData.find((service) => service.slug === slug);

  if (!company) {
    return {
      title: "Company not found | Unlock My Data",
      description:
        "The requested company could not be found in the Unlock My Data database.",
    };
  }

  return {
    title: `${company.name} | Unlock My Data`,
    description: `See privacy details for ${company.name}: data exports, permissions, trackers, and tips to better protect your personal data.`,
    openGraph: {
      title: `${company.name} | Unlock My Data`,
      description: `Privacy profile for ${company.name}: how it handles your personal data, what permissions it uses and how to exercise your rights.`,
      url: `https://unlock-my-data.com/list-app/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.name} | Unlock My Data`,
      description: `Check the privacy score of ${company.name} and compare how it handles your data.`,
    },
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;

  // English detail page, lang fixed to 'en' here
  const lang: "en" = "en";

  // Find the company data by slug
  const companyIndex = servicesData.findIndex(
    (service) => service.slug === slug
  );

  if (companyIndex === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
          <h1 className="text-2xl text-red-600 mb-2">Company not found</h1>
          <p className="text-gray-700">
            The company &quot;{slug}&quot; does not exist in our database.
          </p>
        </div>
      </div>
    );
  }

  // Clone the company to avoid modifying the original data
  const company = JSON.parse(JSON.stringify(servicesData[companyIndex]));

  // Statically check if the company is using the new or old way
  const isNew = company.mode === 1; // 1 for new way, 0 for old way

  // Pre-load permissions data if this is an oldway company
  if (!isNew) {
    // Check if permission data exists
    const hasPermissionData = await permissionDataExists(slug);
    
    // If permission data exists, load it and attach to the company object
    if (hasPermissionData) {
      try {
        const permissionsData = await getPermissionData(slug);
        
        if (permissionsData) {
          // Attach the permissions data to the company object
          company.permissions_data = permissionsData;
        }
      } catch (error) {
        console.error("Error loading permissions data:", error);
      }
    }
  }

  // Return the appropriate component, now passing the entire company object
  return <Manual slug={slug} lang={lang} />;
}
