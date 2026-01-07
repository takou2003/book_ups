const sqlite3 = require('sqlite3').verbose();

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
}

// Test
async function main() {
    const manager = new VilleQuartierManager();
    try {
        console.log('\n1. Quartiers de Yaoundé:');
        const quartiers = await manager.getQuartiersByVille('Yaoundé');
        console.log(quartiers);
        console.log(`\nTotal: ${quartiers.length} quartiers`);
    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await manager.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = VilleQuartierManager;
