const sqlite3 = require('sqlite3').verbose();

class VilleQuartierManager {
    constructor(dbPath = './villes_cameroun.db') {
        this.db = new sqlite3.Database(dbPath);
    }

    /*
     * Créer les tables
     */
    async createTables() {
        const queries = [
            // Table Ville
            `CREATE TABLE IF NOT EXISTS ville (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT UNIQUE NOT NULL,
                region TEXT,
                population INTEGER DEFAULT 0
            )`,

            // Table Quartier
            `CREATE TABLE IF NOT EXISTS quartier (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ville_id INTEGER NOT NULL,
                nom TEXT NOT NULL,
                arrondissement TEXT,
                UNIQUE(ville_id, nom),
                FOREIGN KEY (ville_id) REFERENCES ville(id) ON DELETE CASCADE
            )`,

            // Index pour performances
            `CREATE INDEX IF NOT EXISTS idx_ville_nom ON ville(nom)`,
            `CREATE INDEX IF NOT EXISTS idx_quartier_ville ON quartier(ville_id)`,
            `CREATE INDEX IF NOT EXISTS idx_quartier_arrondissement ON quartier(arrondissement)`
        ];

        for (const query of queries) {
            await this.runQuery(query);
        }
        console.log('✅ Tables créées avec succès');
    }

    /**
     * Exécuter une requête
     */
    runQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

    /**
     * Exécuter une requête de sélection
     */
    selectQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Insérer une ville
     */
    async insertVille(nom, region = null, population = null) {
        try {
            await this.runQuery(
                'INSERT OR IGNORE INTO ville (nom, region, population) VALUES (?, ?, ?)',
                [nom, region, population]
            );
            
            const result = await this.selectQuery(
                'SELECT id FROM ville WHERE nom = ?',
                [nom]
            );
            
            return result[0]?.id;
        } catch (error) {
            console.error(`Erreur insertion ville ${nom}:`, error);
            throw error;
        }
    }

    /**
     * Insérer plusieurs quartiers pour une ville
     */
    async insertQuartiers(villeId, quartiers) {
        try {
            for (const quartier of quartiers) {
                await this.runQuery(
                    'INSERT OR IGNORE INTO quartier (ville_id, nom, arrondissement) VALUES (?, ?, ?)',
                    [villeId, quartier.nom, quartier.arrondissement || null]
                );
            }
            console.log(`✅ ${quartiers.length} quartiers insérés`);
        } catch (error) {
            console.error('Erreur insertion quartiers:', error);
            throw error;
        }
    }

    /**
     * Insérer toutes les données de Yaoundé
     */
    async insertYaounde() {
        try {
            // Insérer la ville
            const villeId = await this.insertVille(
                'Yaoundé',
                'Centre',
                2800000
            );

            // Quartiers de Yaoundé par arrondissement
            const quartiersYaounde = [
                // Yaoundé I
                { nom: 'Briqueterie', arrondissement: 'Yaoundé I' },
                { nom: 'Mvog-Betsi', arrondissement: 'Yaoundé I' },
                { nom: 'Élig-Edzoa', arrondissement: 'Yaoundé I' },
                { nom: 'Étoudi', arrondissement: 'Yaoundé I' },
                { nom: 'Nkongmondo', arrondissement: 'Yaoundé I' },
                { nom: 'Mvolyé', arrondissement: 'Yaoundé I' },
                { nom: 'Mimboman', arrondissement: 'Yaoundé I' },
                { nom: 'Nkol-Ebogo', arrondissement: 'Yaoundé I' },

                // Yaoundé II
                { nom: 'Mvog-Mbi', arrondissement: 'Yaoundé II' },
                { nom: 'Messa', arrondissement: 'Yaoundé II' },
                { nom: 'Carrière', arrondissement: 'Yaoundé II' },
                { nom: 'Mendong', arrondissement: 'Yaoundé II' },
                { nom: 'Nkolbisson', arrondissement: 'Yaoundé II' },
                { nom: 'Éfoulan', arrondissement: 'Yaoundé II' },
                { nom: 'Nkol-Eton', arrondissement: 'Yaoundé II' },
                { nom: 'Nkolmesseng', arrondissement: 'Yaoundé II' },
                { nom: 'Nkoabang', arrondissement: 'Yaoundé II' },
                { nom: 'Nkolbikok', arrondissement: 'Yaoundé II' },
                { nom: 'Melen', arrondissement: 'Yaoundé II' },

                // Yaoundé III
                { nom: 'Biyem-Assi', arrondissement: 'Yaoundé III' },
                { nom: 'Cité Verte', arrondissement: 'Yaoundé III' },
                { nom: 'Nlongkak', arrondissement: 'Yaoundé III' },
                { nom: 'Mvan', arrondissement: 'Yaoundé III' },
                { nom: 'Nkolmengong', arrondissement: 'Yaoundé III' },
                { nom: 'Mfandena', arrondissement: 'Yaoundé III' },
                { nom: 'Tsinga', arrondissement: 'Yaoundé III' },
                { nom: 'Obili', arrondissement: 'Yaoundé III' },
                { nom: 'Nkolndongo', arrondissement: 'Yaoundé III' },

                // Yaoundé IV
                { nom: 'Essos', arrondissement: 'Yaoundé IV' },
                { nom: 'Nkolndongo', arrondissement: 'Yaoundé IV' },
                { nom: 'Djoungolo', arrondissement: 'Yaoundé IV' },
                { nom: 'Tsinga', arrondissement: 'Yaoundé IV' },
                { nom: 'Quartier Fouda', arrondissement: 'Yaoundé IV' },
                { nom: 'Nkol-Ewo', arrondissement: 'Yaoundé IV' },
                { nom: 'Mokolo', arrondissement: 'Yaoundé IV' },
                { nom: 'Mvog-Ada', arrondissement: 'Yaoundé IV' },

                // Yaoundé V
                { nom: 'Plateau', arrondissement: 'Yaoundé V' },
                { nom: 'Quartier du Lac', arrondissement: 'Yaoundé V' },
                { nom: 'Ahala', arrondissement: 'Yaoundé V' },
                { nom: 'Nkomkana', arrondissement: 'Yaoundé V' },
                { nom: 'Ekié', arrondissement: 'Yaoundé V' },
                { nom: 'Mballa II', arrondissement: 'Yaoundé V' },
                { nom: 'Mfoudi', arrondissement: 'Yaoundé V' },
                { nom: 'Bastos', arrondissement: 'Yaoundé V' },
                { nom: 'Hippodrome', arrondissement: 'Yaoundé V' },
                { nom: 'Ngoa-Ekellé', arrondissement: 'Yaoundé V' },
                { nom: 'Camp SIC', arrondissement: 'Yaoundé V' },

                // Yaoundé VI
                { nom: 'Simbock', arrondissement: 'Yaoundé VI' },
                { nom: 'Olembé', arrondissement: 'Yaoundé VI' },
                { nom: 'Ekounou', arrondissement: 'Yaoundé VI' },
                { nom: 'Emombo', arrondissement: 'Yaoundé VI' },
                { nom: 'Mbankomo', arrondissement: 'Yaoundé VI' },
                { nom: 'Ntougou', arrondissement: 'Yaoundé VI' },
                { nom: 'Nkolmeyang', arrondissement: 'Yaoundé VI' },
                { nom: 'Minkoameyos', arrondissement: 'Yaoundé VI' },

                // Yaoundé VII
                { nom: 'Nkolbisson', arrondissement: 'Yaoundé VII' },
                { nom: 'Nkolmengong', arrondissement: 'Yaoundé VII' },
                { nom: 'Nkolbikok', arrondissement: 'Yaoundé VII' },
                { nom: 'Nkolmeyang', arrondissement: 'Yaoundé VII' },
                { nom: 'Awae', arrondissement: 'Yaoundé VII' },
                { nom: 'Minkoameyos', arrondissement: 'Yaoundé VII' },
                { nom: 'Nkol-Nguet', arrondissement: 'Yaoundé VII' }
            ];

            await this.insertQuartiers(villeId, quartiersYaounde);
            console.log('✅ Yaoundé insérée avec succès');

        } catch (error) {
            console.error('Erreur insertion Yaoundé:', error);
            throw error;
        }
    }

    /**
     * Insérer toutes les données de Douala
     */
    async insertDouala() {
        try {
            // Insérer la ville
            const villeId = await this.insertVille(
                'Douala',
                'Littoral',
                3500000
            );

            // Quartiers de Douala par arrondissement
            const quartiersDouala = [
                // Douala I
                { nom: 'Bonapriso', arrondissement: 'Douala I' },
                { nom: 'Bépanda', arrondissement: 'Douala I' },
                { nom: 'Bassa', arrondissement: 'Douala I' },
                { nom: 'New-Bell', arrondissement: 'Douala I' },
                { nom: 'Nkongmondo', arrondissement: 'Douala I' },
                { nom: 'Ndogbong', arrondissement: 'Douala I' },
                { nom: 'Bonnefoy', arrondissement: 'Douala I' },
                { nom: 'Camp-Sic', arrondissement: 'Douala I' },
                { nom: 'Marché Congo', arrondissement: 'Douala I' },
                { nom: 'Marché Sandaga', arrondissement: 'Douala I' },
                { nom: 'Cité Sotega', arrondissement: 'Douala I' },
                { nom: 'Akwa', arrondissement: 'Douala I' },

                // Douala II
                { nom: 'Kotto', arrondissement: 'Douala II' },
                { nom: 'Logpom', arrondissement: 'Douala II' },
                { nom: 'Ndogbong', arrondissement: 'Douala II' },
                { nom: 'Sable', arrondissement: 'Douala II' },
                { nom: 'Bonamoussadi', arrondissement: 'Douala II' },
                { nom: 'Nyalla', arrondissement: 'Douala II' },
                { nom: 'Sardinerie', arrondissement: 'Douala II' },
                { nom: 'Logbessou', arrondissement: 'Douala II' },
                { nom: 'Logbessou Plateau', arrondissement: 'Douala II' },
                { nom: 'Makepe', arrondissement: 'Douala II' },

                // Douala III
                { nom: 'Logbaba', arrondissement: 'Douala III' },
                { nom: 'Bonaléa', arrondissement: 'Douala III' },
                { nom: 'Mabanda', arrondissement: 'Douala III' },
                { nom: 'Mboppi', arrondissement: 'Douala III' },
                { nom: 'Bois des Singes', arrondissement: 'Douala III' },
                { nom: 'Ndogpassi', arrondissement: 'Douala III' },
                { nom: 'Ndogpassi III', arrondissement: 'Douala III' },
                { nom: 'Village', arrondissement: 'Douala III' },
                { nom: 'Deïdo', arrondissement: 'Douala III' },

                // Douala IV
                { nom: 'Bonassama', arrondissement: 'Douala IV' },
                { nom: 'Mambanda', arrondissement: 'Douala IV' },
                { nom: 'Moungué', arrondissement: 'Douala IV' },
                { nom: 'Mambang', arrondissement: 'Douala IV' },
                { nom: 'Mambanda Sud', arrondissement: 'Douala IV' },
                { nom: 'Koutaba', arrondissement: 'Douala IV' },
                { nom: 'Mambanda Village', arrondissement: 'Douala IV' },
                { nom: 'Mambanda Nord', arrondissement: 'Douala IV' },

                // Douala V
                { nom: 'Kpwa', arrondissement: 'Douala V' },
                { nom: 'Kpwa-Bonandog', arrondissement: 'Douala V' },
                { nom: 'Bonabéri', arrondissement: 'Douala V' },
                { nom: 'Bwassadi', arrondissement: 'Douala V' },
                { nom: 'Makepe', arrondissement: 'Douala V' },
                { nom: 'Missoké', arrondissement: 'Douala V' },
                { nom: 'Bonandog', arrondissement: 'Douala V' },
                { nom: 'Kpwa Village', arrondissement: 'Douala V' },

                // Douala VI
                { nom: 'Manoka', arrondissement: 'Douala VI' },
                { nom: 'Mouti', arrondissement: 'Douala VI' },
                { nom: 'Soumou', arrondissement: 'Douala VI' },
                { nom: 'Pété', arrondissement: 'Douala VI' },
                { nom: 'Cap-Cameroun', arrondissement: 'Douala VI' },
                { nom: 'Nguele', arrondissement: 'Douala VI' },
                { nom: 'Yoyo', arrondissement: 'Douala VI' },

                // Douala VII
                { nom: 'Bassa', arrondissement: 'Douala VII' },
                { nom: 'Bonabéri', arrondissement: 'Douala VII' },
                { nom: 'Logbaba', arrondissement: 'Douala VII' },
                { nom: 'Bonapriso', arrondissement: 'Douala VII' },
                { nom: 'Deïdo', arrondissement: 'Douala VII' },
                { nom: 'Akwa Nord', arrondissement: 'Douala VII' },
                { nom: 'Akwa Sud', arrondissement: 'Douala VII' },
                { nom: 'Bali', arrondissement: 'Douala VII' }
            ];

            await this.insertQuartiers(villeId, quartiersDouala);
            console.log('✅ Douala insérée avec succès');

        } catch (error) {
            console.error('Erreur insertion Douala:', error);
            throw error;
        }
    }

    /**
     * Obtenir tous les quartiers d'une ville
     */
async getQuartiersByVille(villeNom) {
    try {
        const results = await this.selectQuery(`
            SELECT q.nom
            FROM quartier q
            JOIN ville v ON q.ville_id = v.id
            WHERE v.nom = ?
            ORDER BY q.nom COLLATE NOCASE ASC
        `, [villeNom]);

        // Retourne seulement les noms des quartiers dans un tableau
        return results.map(row => row.nom);
        
    } catch (error) {
        console.error('Erreur récupération quartiers:', error);
        return [];
    }
}
    
    /*async display_quarter(ville_name, groupByArrondissement = true){
    	try{
    		const results = await this.selectQuery(`
    			SELECT 
    		`);
    	
    	}catch(error){
    		console.error('Erreur récupération quartiers:', error);
    		return [];
    	}
    }*/

    /*
      Rechercher un quartier par nom
     
    async searchQuartier(nomQuartier) {
        try {
            const results = await this.selectQuery(`
                SELECT 
                    q.nom as quartier,
                    q.arrondissement,
                    v.nom as ville,
                    v.region
                FROM quartier q
                JOIN ville v ON q.ville_id = v.id
                WHERE q.nom LIKE ?
                ORDER BY v.nom, q.arrondissement
            `, [`%${nomQuartier}%`]);

            return results;
        } catch (error) {
            console.error('Erreur recherche quartier:', error);
            return [];
        }
    }*/

    /*
      Obtenir les statistiques
     
    async getStats() {
        try {
            const stats = await this.selectQuery(`
                SELECT 
                    v.nom as ville,
                    COUNT(q.id) as total_quartiers,
                    COUNT(DISTINCT q.arrondissement) as total_arrondissements,
                    v.population,
                    v.region
                FROM ville v
                LEFT JOIN quartier q ON v.id = q.ville_id
                GROUP BY v.id
                ORDER BY v.nom
            `);

            return stats;
        } catch (error) {
            console.error('Erreur statistiques:', error);
            return [];
        }
    }*/

    /*
      Afficher toutes les données
    
    async displayAllData() {
        try {
            console.log('\n📊 DONNÉES COMPLÈTES');
            console.log('====================');

            const stats = await this.getStats();
            
            for (const ville of stats) {
                console.log(`\n🏙️  ${ville.ville.toUpperCase()} (${ville.region})`);
                console.log(`   Population: ${ville.population?.toLocaleString() || 'N/A'}`);
                console.log(`   Arrondissements: ${ville.total_arrondissements}`);
                console.log(`   Quartiers: ${ville.total_quartiers}`);

                const quartiersParArrondissement = await this.getQuartiersByVille(ville.ville);
                
                for (const arr of quartiersParArrondissement) {
                    console.log(`\n   📍 ${arr.arrondissement || 'Sans arrondissement'}:`);
                    console.log(`      ${arr.nombre_quartiers} quartiers: ${arr.quartiers}`);
                }
            }

        } catch (error) {
            console.error('Erreur affichage données:', error);
        }
    } */


    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ Base de données fermée');
                    resolve();
                }
            });
        });
    }
}

// Fonction principale
async function main() {
    const manager = new VilleQuartierManager();

    try {
        // Créer les tables
        //await manager.createTables();

        // Insérer les données
        //await manager.insertYaounde();
        //await manager.insertDouala();

        /*Afficher les statistiques
        console.log('\n📈 STATISTIQUES');
        console.log('===============');
        const stats = await manager.getStats();
        stats.forEach(s => {
            console.log(`${s.ville}: ${s.total_quartiers} quartiers, ${s.total_arrondissements} arrondissements`);
        });*/

        // Exemples d'utilisation
        console.log('\n🔍 EXEMPLES DE RECHERCHE');
        console.log('=======================');

        // 1. Tous les quartiers de Yaoundé groupés par arrondissement
        console.log('\n1. Quartiers de Yaoundé par arrondissement:');
        const yaoundeQuartiers = await manager.getQuartiersByVille('Yaoundé');
        console.log(yaoundeQuartiers[0]);
        /*yaoundeQuartiers.forEach(arr => {
            console.log(`   ${arr.arrondissement}: ${arr.nombre_quartiers} quartiers`);
        });*/

        /* 2. Recherche d'un quartier spécifique
        console.log('\n2. Recherche du quartier "Akwa":');
        const akwaResults = await manager.searchQuartier('Akwa');
        akwaResults.forEach(result => {
            console.log(`   ${result.quartier} - ${result.ville} (${result.arrondissement})`);
        });

        // 3. Quartiers de Douala
        console.log('\n3. Nombre total de quartiers à Douala:');
        const doualaQuartiers = await manager.getQuartiersByVille('Douala');
        console.log(`   ${doualaQuartiers.length} arrondissements trouvés`);

        // Afficher toutes les données
        await manager.displayAllData();*/

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await manager.close();
    }
}

// Exécuter si lancé directement
if (require.main === module) {
    main();
}

// Exporter pour utilisation
module.exports = VilleQuartierManager;
