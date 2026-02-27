import {FormData} from "../types/form"

interface ContributionEntry {
    author: string;
    date: string;
    type: 'create' | 'update';
}

interface ContributionsHistory {
    version: number;
    lastUpdated: string;
    contributions: Record<string, ContributionEntry[]>;
}

const createSecureBranchName = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '')       // Remove leading/trailing hyphens
        .substring(0, 10)              // Limit to 30 characters
        .replace(/-+$/g, '');          // Remove trailing hyphen if substring cut in middle of word
};

export const generateSlug = (name: string) => {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

export const createGitHubPR = async (
    formData: FormData,
    filename: string,
    content: string,
    title: string,
    message: string,
    type: string,
    isUpdate: boolean = false,
    slug?: string,
    additionalFiles: Array<{ path: string, content: string, isBinary?: boolean }> = []
) => {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
        throw new Error("Token GitHub manquant");
    }

    const owner = "les-enovateurs";
    const repo = "unlock-my-data";
    const branch = "fiche-" + createSecureBranchName(formData.name) + '-' + Date.now();
    const serviceSlug = slug || filename.replace('.json', '');

    try {
        // 1. Récupérer la référence de la branche master
        const masterRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/master`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).then(r => r.json());

        // 2. Créer une nouvelle branche
        await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: `refs/heads/${branch}`,
                sha: masterRef.object.sha
            })
        });

        let requestBody: any = {
            message: message,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: branch
        };

        // 3. Pour une mise à jour, récupérer le SHA du fichier existant
        if (isUpdate) {
            try {
                const existingFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/public/data/manual/${filename}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/vnd.github+json'
                    }
                });

                if (existingFileResponse.ok) {
                    const existingFile = await existingFileResponse.json();
                    requestBody.sha = existingFile.sha;
                }
            } catch (error) {
                console.warn('Fichier existant non trouvé, création d\'un nouveau fichier');
            }
        }

        // 3.5 Upload additional files if any
        for (const file of additionalFiles) {
            await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Add ${file.path}`,
                    content: file.isBinary ? file.content : btoa(unescape(encodeURIComponent(file.content))),
                    branch: branch
                })
            });
        }

        // 4. Créer ou mettre à jour le fichier de la fiche
        const createFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/public/data/manual/${filename}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!createFileResponse.ok) {
            const errorResponse = await createFileResponse.text();
            throw new Error(`Erreur lors de la ${isUpdate ? 'mise à jour' : 'création'} du fichier: ${errorResponse}`);
        }

        // 5. Mettre à jour le fichier contributions-history.json
        await updateContributionsHistory(
            token,
            owner,
            repo,
            branch,
            serviceSlug,
            formData.author || 'Unknown',
            isUpdate ? 'update' : 'create'
        );

        // 6. Créer la Pull Request
        const prResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                "X-GitHub-Api-Version": '2022-11-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                head: branch,
                base: 'master',
                body: `${type} d'une fiche pour ${formData.name}.`
            })
        });

        if (!prResponse.ok) {
            const errorResponse = await prResponse.text();
            throw new Error(`Erreur lors de la création de la PR: ${errorResponse}`);
        }

        const pr = await prResponse.json();
        return pr.html_url;

    } catch (error) {
        console.error('Erreur GitHub:', error);
        throw error;
    }
};

async function updateContributionsHistory(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    slug: string,
    author: string,
    contributionType: 'create' | 'update'
): Promise<void> {
    const historyPath = 'public/data/contributions-history.json';

    try {
        // Récupérer le fichier contributions-history.json existant
        const existingFileResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${historyPath}?ref=${branch}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json'
                }
            }
        );

        let history: ContributionsHistory;
        let existingSha: string | undefined;

        if (existingFileResponse.ok) {
            const existingFile = await existingFileResponse.json();
            existingSha = existingFile.sha;
            const content = decodeURIComponent(escape(atob(existingFile.content)));
            history = JSON.parse(content);
        } else {
            // Créer une nouvelle structure si le fichier n'existe pas
            history = {
                version: 1,
                lastUpdated: new Date().toISOString(),
                contributions: {}
            };
        }

        // Ajouter la nouvelle contribution
        if (!history.contributions[slug]) {
            history.contributions[slug] = [];
        }

        const newContribution: ContributionEntry = {
            author: author,
            date: new Date().toISOString().split('T')[0],
            type: contributionType
        };

        history.contributions[slug].push(newContribution);
        history.lastUpdated = new Date().toISOString();

        // Préparer le contenu mis à jour
        const updatedContent = JSON.stringify(history, null, 2);

        // Mettre à jour le fichier
        const updateBody: any = {
            message: `Update contributions history for ${slug}`,
            content: btoa(unescape(encodeURIComponent(updatedContent))),
            branch: branch
        };

        if (existingSha) {
            updateBody.sha = existingSha;
        }

        const updateResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${historyPath}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateBody)
            }
        );

        if (!updateResponse.ok) {
            console.warn('Could not update contributions history:', await updateResponse.text());
        }
    } catch (error) {
        console.warn('Error updating contributions history:', error);
        // Ne pas faire échouer la PR principale si l'historique échoue
    }
}
