# Verb Cleaning Script

This script removes the "progresivo", "perfecto", and "perfecto_subjuntivo" properties from Spanish verb conjugation data.

## Usage

```bash
npx ts-node scripts/clean-verbs.ts <input-file> [output-file]
```

## Examples

```bash
# Clean esp_verbos.json and save as esp_verbos_cleaned.json
npm run clean-verbs esp_verbos.json

# Clean esp_verbos.json and save with custom name
npm run clean-verbs esp_verbos.json cleaned_verbs.json

# Clean the public directory file
npm run clean-verbs public/esp_verbos.json public/esp_verbos_cleaned.json
```

## What it does

The script:
1. Reads the input JSON file containing Spanish verb conjugations
2. Removes the following properties from each verb:
   - `progresivo` (progressive tense)
   - `perfecto` (perfect tense)
   - `perfecto_subjuntivo` (perfect subjunctive)
3. Replaces Spanish pronouns with shorter English equivalents:
   - `yo` → `1s` (1st person singular)
   - `tú` → `2s` (2nd person singular)
   - `nosotros` → `1p` (1st person plural)
   - `vosotros` → `2p` (2nd person plural)
   - `él/ella/Ud.` → `3s` (3rd person singular)
   - `ellos/ellas/Uds.` → `3p` (3rd person plural)
4. Removes redundant Ud./Uds. forms when they're identical to 3s/3p forms
5. Sorts verbs by frequency of appearance in Spanish (most frequent first)
6. Splits the data into batches of 100 verbs each
7. Writes both individual batch files and a complete file in compact format (no whitespaces)

## Output

The script will show:
- Number of verbs processed
- Confirmation of removed properties
- Output file location
- Success message with count of processed verbs

## Batch Files

The script creates multiple files:
- **Complete file**: Contains all processed verbs (e.g., `esp_verbos_cleaned.json`)
- **Batch files**: Contains 100 verbs each, named with padded numbers:
  - `esp_verbos_cleaned_batch_001.json` (verbs 1-100)
  - `esp_verbos_cleaned_batch_002.json` (verbs 101-200)
  - `esp_verbos_cleaned_batch_003.json` (verbs 201-300)
  - etc.

Each batch file contains exactly 100 verbs (except possibly the last one), sorted by frequency. 