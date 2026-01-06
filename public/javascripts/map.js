const sqlite3 = require('sqlite3').verbose();

class VilleQuartierManager {
    constructor(dbPath = './villes_cameroun.db') {
        this.db = new sqlite3.Database(dbPath);
    }


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

        console.log('\n1. Quartiers de Yaoundé par arrondissement:');
        const yaoundeQuartiers = await manager.getQuartiersByVille('Yaoundé');
        console.log(yaoundeQuartiers);


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
