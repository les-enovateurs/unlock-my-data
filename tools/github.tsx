import {FormData} from "../types/form"

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
    isUpdate: boolean = false
) => {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!token) {
        throw new Error("Token GitHub manquant");
    }

    const owner = "les-enovateurs";
    const repo = "unlock-my-data";
    const branch = "fiche-" + createSecureBranchName(formData.name) + '-' + Date.now();

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

        // 4. Créer ou mettre à jour le fichier
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

        // 5. Créer la Pull Request
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

        const pr = await prResponse.json();
        return pr.html_url;

    } catch (error) {
        console.error('Erreur GitHub:', error);
        throw error;
    }
};
