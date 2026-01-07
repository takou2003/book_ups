var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class VilleQuartierManager {
    constructor(dbPath = './villes_cameroun.db') {
        // Garder exactement votre chemin qui fonctionne
        console.log(`📂 Ouverture: ${dbPath}`);
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error(`❌ Erreur: ${err.message}`);
            } else {
                console.log('✅ Connecté');
            }
        });
    }
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
                    console.error(`❌ Erreur SQL: ${err.message}`);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    async getQuartiersByVille(villeNom) {
        try {
            const results = await this.selectQuery(`
                SELECT q.nom
                FROM quartier q
                JOIN ville v ON q.ville_id = v.id
                WHERE v.nom = ?
                ORDER BY q.nom COLLATE NOCASE ASC
            `, [villeNom]);

            return results.map(row => row.nom);
            
        } catch (error) {
            console.error('Erreur récupération quartiers:', error.message);
            return [];
        }
    }

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

}

async function main() {
    const manager = new VilleQuartierManager();

    try {
        // Créer les tables
        await manager.createTables();

        // Insérer les données
        await manager.insertYaounde();
        await manager.insertDouala();

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
//main();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/Authentification', function(req, res, next) {
  res.render('authentification', { title: 'Authentification' });
});


router.get('/Authentification/:town', async function(req, res, next){

	const manager = new VilleQuartierManager();
	let select_town = req.params.town;
	try {
        	const yaoundeQuartiers = await manager.getQuartiersByVille(select_town);
        	await manager.close();
        	console.log(yaoundeQuartiers);
    	} catch (error) {
        	console.error('❌ Erreur:', error);
    	}
		
});
router.get('/Parent', function(req, res, next) {
  res.render('parent_profil', { title: 'Parent' });
});
router.get('/view_teacher', function(req, res, next) {
  res.render('view_teacher', { title: 'Proximity' });
});
router.get('/my_teacher', function(req, res, next) {
  res.render('my_teacher', { title: 'informations' });
});
router.get('/my_request', function(req, res, next) {
  res.render('my_request', { title: 'Request' });
});
router.get('/my_profil', function(req, res, next) {
  res.render('my_profil', { title: 'Profil' });
});
router.get('/sign_in', function(req, res, next) {
  res.render('sign_in', { title: 'sign_in' });
});
router.get('/Teacher', function(req, res, next) {
  res.render('teacher_profil', { title: 'Teacher' });
});
router.get('/teacher_info', function(req, res, next) {
  res.render('teacher_info', { title: 'teacher_info' });
});
router.get('/Recommandation', function(req, res, next) {
  res.render('recommandation', { title: 'recommandation' });
});
router.get('/geo', function(req, res, next) {
  res.render('test_localisation', { title: 'local' });
});
module.exports = router;
