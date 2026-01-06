var express = require('express');
var router = express.Router();
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/Authentification', function(req, res, next) {
  res.render('authentification', { title: 'Authentification' });
});
router.get('/Authentification/:town', function(req, res, next){
	const manager = new VilleQuartierManager();
	let select_town = req.params.town;
	try {
        	const yaoundeQuartiers = await manager.getQuartiersByVille(select_town);
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
