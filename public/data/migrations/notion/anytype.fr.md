# Migrer de Notion vers Anytype

## Étape 1 : Créer une intégration Notion
1. Dans Notion, allez dans **Paramètres** > **Connexions** > **Développer ou gérer les intégrations**.
2. Cliquez sur **Nouvelle intégration** et donnez-lui un nom. Choisissez le type **Interne**.
3. Dans **Capacités**, activez **Lire le contenu** et **Lire les informations utilisateur**. Enregistrez les modifications.
4. Dans **Accès**, sélectionnez l’espace d’équipe et toutes les pages racines à importer. Mettez à jour l’accès.
5. Copiez le **Secret d’intégration interne**. Vous en aurez besoin pour l’import.

## Étape 2 : Importer dans Anytype
1. Dans Anytype, ouvrez les paramètres de votre espace (en haut à gauche), sélectionnez **Importer** puis **Notion**.
2. Saisissez le Secret d’intégration et cliquez sur **Importer les données**.
3. Confirmez et attendez la fin de l’import. Pour de meilleurs résultats :
   - Utilisez une connexion internet stable.
   - Gardez l’ordinateur branché.
   - Désactivez le mode veille.

**Remarque :** Certaines fonctionnalités Notion peuvent ne pas être totalement prises en charge par Anytype. Vérifiez vos données importées.

Pour plus d’informations, consultez la [documentation officielle Anytype](https://doc.anytype.io/anytype-docs/advanced/data-and-security/import-export/migrate-from-notion).
