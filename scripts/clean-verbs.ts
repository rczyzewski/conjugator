#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';


interface VerbData {
    verbo: string;
    perfecto?: any;
    progresivo?: any;
    perfecto_subjuntivo?: any;
    [key: string]: any;
}

// Mapping of Spanish pronouns to shorter English equivalents
const pronounMapping: { [key: string]: string } = {
    'yo': '1s',
    'tú': '2s',
    'nosotros': '1p',
    'vosotros': '2p',
    'él/ella/Ud.': '3s',
    'ellos/ellas/Uds.': '3p'
};

// Common Spanish verbs with their approximate frequency rank (lower = more frequent)
// This is a simplified frequency list - you can expand this with more comprehensive data
const verbFrequency: { [key: string]: number } = {
    'ser': 1,
    'estar': 2,
    'tener': 3,
    'hacer': 4,
    'poder': 5,
    'decir': 6,
    'ir': 7,
    'ver': 8,
    'dar': 9,
    'saber': 10,
    'querer': 11,
    'llegar': 12,
    'pasar': 13,
    'deber': 14,
    'poner': 15,
    'parecer': 16,
    'quedar': 17,
    'creer': 18,
    'hablar': 19,
    'llevar': 20,
    'dejar': 21,
    'seguir': 22,
    'encontrar': 23,
    'llamar': 24,
    'venir': 25,
    'pensar': 26,
    'salir': 27,
    'volver': 28,
    'tomar': 29,
    'conocer': 30,
    'vivir': 31,
    'sentir': 32,
    'tratar': 33,
    'mirar': 34,
    'contar': 35,
    'empezar': 36,
    'esperar': 37,
    'buscar': 38,
    'existir': 39,
    'entrar': 40,
    'trabajar': 41,
    'escribir': 42,
    'perder': 43,
    'producir': 44,
    'ocurrir': 45,
    'entender': 46,
    'pedir': 47,
    'recibir': 48,
    'recordar': 49,
    'terminar': 50,
    'permitir': 51,
    'aparecer': 52,
    'conseguir': 53,
    'comenzar': 54,
    'servir': 55,
    'sacar': 56,
    'necesitar': 57,
    'mantener': 58,
    'resultar': 59,
    'leer': 60,
    'caer': 61,
    'cambiar': 62,
    'presentar': 63,
    'crear': 64,
    'abrir': 65,
    'considerar': 66,
    'oír': 67,
    'acabar': 68,
    'convertir': 69,
    'ganar': 70,
    'formar': 71,
    'traer': 72,
    'partir': 73,
    'morir': 74,
    'aceptar': 75,
    'realizar': 76,
    'suponer': 77,
    'comprender': 78,
    'lograr': 79,
    'explicar': 80,
    'preguntar': 81,
    'tocar': 82,
    'reconocer': 83,
    'estudiar': 84,
    'alcanzar': 85,
    'nacer': 86,
    'dirigir': 87,
    'correr': 88,
    'utilizar': 89,
    'pagar': 90,
    'ayudar': 91,
    'gustar': 92,
    'jugar': 93,
    'escuchar': 94,
    'cumplir': 95,
    'ofrecer': 96,
    'descubrir': 97,
    'levantar': 98,
    'intentar': 99,
    'usar': 100
};

function replacePronouns(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(replacePronouns);
    }
    
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
        // Check if this key is a pronoun that needs to be replaced
        const newKey = pronounMapping[key] || key;
        
        if (typeof value === 'object' && value !== null) {
            result[newKey] = replacePronouns(value);
        } else {
            result[newKey] = value;
        }
    }
    
    return result;
}

function removeRedundantUdForms(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(removeRedundantUdForms);
    }
    
    const result: any = {};
    
    // Check if this object has both 3s and Ud. forms
    if (obj['3s'] && obj['Ud.']) {
        // If they're the same, keep only 3s
        if (obj['3s'] === obj['Ud.']) {
            for (const [key, value] of Object.entries(obj)) {
                if (key !== 'Ud.') {
                    result[key] = typeof value === 'object' ? removeRedundantUdForms(value) : value;
                }
            }
        } else {
            // If they're different, keep both but process nested objects
            for (const [key, value] of Object.entries(obj)) {
                result[key] = typeof value === 'object' ? removeRedundantUdForms(value) : value;
            }
        }
    }
    // Check if this object has both 3p and Uds. forms
    else if (obj['3p'] && obj['Uds.']) {
        // If they're the same, keep only 3p
        if (obj['3p'] === obj['Uds.']) {
            for (const [key, value] of Object.entries(obj)) {
                if (key !== 'Uds.') {
                    result[key] = typeof value === 'object' ? removeRedundantUdForms(value) : value;
                }
            }
        } else {
            // If they're different, keep both but process nested objects
            for (const [key, value] of Object.entries(obj)) {
                result[key] = typeof value === 'object' ? removeRedundantUdForms(value) : value;
            }
        }
    }
    // If no Ud./Uds. forms, just process nested objects
    else {
        for (const [key, value] of Object.entries(obj)) {
            result[key] = typeof value === 'object' ? removeRedundantUdForms(value) : value;
        }
    }
    
    return result;
}

function getVerbFrequencyRank(verbName: string): number {
    return verbFrequency[verbName] || 999; // Default high rank for unknown verbs
}

function cleanVerbData(verb: VerbData): VerbData {
    const cleanedVerb = { ...verb };
    
    // Remove the specified properties
    delete cleanedVerb.perfecto;
    delete cleanedVerb.progresivo;
    delete cleanedVerb.perfecto_subjuntivo;
    
    // Replace pronouns in all remaining properties
    const processedVerb = replacePronouns(cleanedVerb);
    
    // Remove redundant Ud./Uds. forms when they're the same as 3s/3p
    const finalVerb = removeRedundantUdForms(processedVerb);
    
    return finalVerb;
}

function processVerbsFile(inputPath: string, outputPath: string): void {
    try {
        console.log(`Reading file: ${inputPath}`);
        
        // Read the input file
        const fileContent = fs.readFileSync(inputPath, 'utf8');
        const verbs: VerbData[] = JSON.parse(fileContent);
        
        console.log(`Found ${verbs.length} verbs to process`);
        
        // Clean each verb
        const cleanedVerbs = verbs.map(cleanVerbData);
        
        // Sort verbs by frequency (most frequent first)
        const sortedVerbs = cleanedVerbs.sort((a, b) => {
            const rankA = getVerbFrequencyRank(a.verbo);
            const rankB = getVerbFrequencyRank(b.verbo);
            return rankA - rankB;
        });
        
        console.log('Removed "progresivo", "perfecto", and "perfecto_subjuntivo" properties');
        console.log('Replaced Spanish pronouns with shorter English equivalents (yo→1s, tú→2s, etc.)');
        console.log('Removed redundant Ud./Uds. forms when identical to 3s/3p');
        console.log('Sorted verbs by frequency of appearance in Spanish');
        console.log('Serialized without whitespaces for compact output');
        
        // Create output directory
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Split into batches of 100
        const batchSize = 100;
        const batches: VerbData[][] = [];
        
        for (let i = 0; i < sortedVerbs.length; i += batchSize) {
            batches.push(sortedVerbs.slice(i, i + batchSize));
        }
        
        // Write each batch to a separate file
        const baseName = path.basename(outputPath, path.extname(outputPath));
        const ext = path.extname(outputPath);
        const dir = path.dirname(outputPath);
        
        batches.forEach((batch, index) => {
            const batchNumber = index + 1;
            const batchFileName = `${baseName}_batch_${batchNumber.toString().padStart(3, '0')}${ext}`;
            const batchPath = path.join(dir, batchFileName);
            
            fs.writeFileSync(batchPath, JSON.stringify(batch), 'utf8');
            console.log(`Batch ${batchNumber}: ${batch.length} verbs written to ${batchFileName}`);
        });
        
        // Also write the complete file
        fs.writeFileSync(outputPath, JSON.stringify(sortedVerbs), 'utf8');
        
        console.log(`Complete file written to: ${outputPath}`);
        console.log(`Processed ${sortedVerbs.length} verbs in ${batches.length} batches successfully`);
        
    } catch (error) {
        console.error('Error processing file:', error);
        process.exit(1);
    }
}

// Main execution
function main(): void {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.log('Usage: ts-node clean-verbs.ts <input-file> [output-file]');
        console.log('Example: ts-node clean-verbs.ts esp_verbos.json esp_verbos_cleaned.json');
        process.exit(1);
    }
    
    const inputFile = args[0];
    const outputFile = args[1] || inputFile.replace('.json', '_cleaned.json');
    
    if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`);
        process.exit(1);
    }
    
    processVerbsFile(inputFile, outputFile);
}

// Run the script
if (require.main === module) {
    main();
} 
export {}