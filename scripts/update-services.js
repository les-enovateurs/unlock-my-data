#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Chemins vers les dossiers de données
const MANUAL_DIR = './public/data/manual';
const COMPARE_DIR = './public/data/compare';
const SERVICES_FILE = './public/data/services.json';
const REVIEWS_FILE = './public/data/reviews.json';
const SLUGS_FILE = path.join(MANUAL_DIR, 'slugs.json');

/**
 * Lit et parse un fichier JSON
 */
async function readJsonFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.warn(`Erreur lecture ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Lit tous les fichiers JSON d'un dossier
 */
async function readJsonFilesFromDir(dirPath) {
    try {
        const files = await fs.readdir(dirPath);
        const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'slugs.json');

        const data = {};
        for (const file of jsonFiles) {
            const slug = path.basename(file, '.json');
            const filePath = path.join(dirPath, file);
            const content = await readJsonFile(filePath);
            // Ignore drafts
            if (content && content.status !== 'draft') {
                data[slug] = content;
            }
        }
        return data;
    } catch (error) {
        console.warn(`Erreur lecture dossier ${dirPath}:`, error.message);
        return {};
    }
}

/**
 * Génère reviews.json avec les services en draft ou changes_requested
 */
async function generateReviewsFile() {
    try {
        const files = await fs.readdir(MANUAL_DIR);
        const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'slugs.json');

        const reviews = [];
        for (const file of jsonFiles) {
            const slug = path.basename(file, '.json');
            const filePath = path.join(MANUAL_DIR, file);
            const content = await readJsonFile(filePath);

            // Only include draft and changes_requested services
            if (content && (content.status === 'draft' || content.status === 'changes_requested')) {
                reviews.push({
                    slug,
                    name: content.name || 'Unknown',
                    logo: content.logo || null,
                    status: content.status,
                    created_at: content.created_at,
                    created_by: content.created_by,
                    review: content.review || [],
                });
            }
        }

        // Sort by created_at descending (newest first)
        reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        await fs.mkdir(path.dirname(REVIEWS_FILE), { recursive: true });
        await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
        console.log(`✅ reviews.json mis à jour avec ${reviews.length} service(s) en attente`);
    } catch (error) {
        console.warn('⚠️ Impossible de générer reviews.json:', error.message);
    }
}

/**
 * Transforme les données du format manual/compare vers services.json
 */
function transformToServiceFormat(slug, manualData, compareData) {
    // Données de base depuis manual (prioritaire)
    const baseData = manualData || {};

    // Complément depuis compare si disponible
    const additional = compareData || {};

    // Mode : 1 si données manuelles existent, sinon 0
    const mode = manualData ? 1 : 0;

    return {
        mode,
        slug,
        name: baseData.name || additional.name || slug,
        logo: baseData.logo || additional.logo || '',
        easy_access_data: baseData.easy_access_data || additional.easy_access_data || '',
        contact_mail_export: baseData.contact_mail_export || additional.contact_mail_export || '',
        contact_mail_delete: baseData.contact_mail_delete || additional.contact_mail_delete || baseData.contact_mail_export || additional.contact_mail_export || '',
        recipient_address: baseData.recipient_address || additional.address_export || null,
        how_to_export: baseData.how_to_export || additional.response_format || '',
        url_delete: baseData.url_delete || null,
        need_id_card: baseData.need_id_card || null,
        data_access_via_postal: baseData.data_access_via_postal || null,
        data_access_via_form: baseData.data_access_via_form || null,
        data_access_via_email: baseData.data_access_via_email || null,
        url_export: baseData.url_export || additional.url_export || '',
        last_update_breach: baseData.last_update_breach || null,
        country_name: baseData.country_name || additional.country_name || '',
        country_code: baseData.country_code || additional.country_code || '',
        nationality: baseData.nationality || additional.nationality || '',
        exodus: ("" !== baseData.exodus || additional.exodus),
        better_alternative: baseData.better_alternative || false,
        better_alternative_explication: baseData.better_alternative_explication || '',
        better_alternative_explication_en: baseData.better_alternative_explication_en || ''
    };
}

/**
 * Fonction principale
 */
async function updateServices() {
    console.log('🔄 Mise à jour du fichier services.json...');

    try {
        // Lecture des données depuis tous les dossiers
        console.log('📖 Lecture des données...');
        const [manualData, compareData] = await Promise.all([
            readJsonFilesFromDir(MANUAL_DIR),
            readJsonFilesFromDir(COMPARE_DIR)
        ]);

        // Récupération de tous les slugs uniques
        const allSlugs = new Set([
            ...Object.keys(manualData),
            ...Object.keys(compareData)
        ]);

        console.log(`📊 ${allSlugs.size} services trouvés`);

        // Génération des services
        const services = [];
        for (const slug of allSlugs) {
            const service = transformToServiceFormat(
                slug,
                manualData[slug],
                compareData[slug]
            );
            if (service.logo && service.logo !== '') {
                services.push(service);
            }
        }

        // Tri par nom pour un ordre cohérent
        services.sort((a, b) => a.name.localeCompare(b.name));

        // Écriture du fichier services.json
        console.log('💾 Écriture du fichier services.json...');
        // Assure que le dossier existe
        await fs.mkdir(path.dirname(SERVICES_FILE), { recursive: true });
        await fs.writeFile(SERVICES_FILE, JSON.stringify(services, null, 2), 'utf8');

        console.log(`✅ services.json mis à jour avec ${services.length} services`);

        // Génération du fichier reviews.json
        console.log('💾 Génération du fichier reviews.json...');
        await generateReviewsFile();

        // Mise à jour du fichier slugs.json dans public/data/manual
        try {
            const manualSlugs = Object.keys(manualData).sort();
            const slugsArray = manualSlugs.map(s => ({ slug: s }));
            await fs.mkdir(path.dirname(SLUGS_FILE), { recursive: true });
            await fs.writeFile(SLUGS_FILE, JSON.stringify(slugsArray, null, 2), 'utf8');
            console.log(`✅ ${path.relative('.', SLUGS_FILE)} mis à jour avec ${slugsArray.length} slugs`);
        } catch (e) {
            console.warn('⚠️ Impossible de mettre à jour slugs.json:', e.message);
        }

        // Affichage des statistiques
        const stats = {
            total: services.length,
            withManual: services.filter(s => s.mode === 1).length,
            withCompare: services.filter(s => Object.keys(compareData).includes(s.slug)).length
        };

        console.log(`📈 Statistiques:
  - Total: ${stats.total}
  - Avec données manuelles: ${stats.withManual}
  - Avec données compare: ${stats.withCompare}`);

    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
        process.exit(1);
    }
}

// Exécution si appelé directement
if (require.main === module) {
    updateServices();
}

module.exports = { updateServices };