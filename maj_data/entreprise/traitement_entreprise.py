import pandas as pd

# Lire le fichier Excel
df = pd.read_excel('data.xlsx')

# Nettoyer les données
df = df.replace({
    ';': ',',       # Virgules
    '\n': ' ',      # Retours à la ligne
    '\r': ' ',      # Retours chariot
    ',': '',       # Virgules
    '\t': ' ',      # Tabulations
    '"': '',        # Guillemets doubles
    # "'": '',        # Guillemets simples
    '\"': '',       # Guillemets doubles échappés
    # "\'": ''        # Guillemets simples échappés
}, regex=True)

# Nettoyer les espaces multiples
df = df.replace(r'\s+', ' ', regex=True)

# Exporter en CSV
df.to_csv(
    'fichier_propre.csv',
    sep=';',           # Utilise ; comme séparateur
    index=False,       # Ne pas inclure l'index
    encoding='utf-8'   # Encodage UTF-8
)