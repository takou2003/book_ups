var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/Authentification', function(req, res, next) {
  res.render('authentification', { title: 'Authentification' });
});
router.get('/Parent', function(req, res, next) {
  res.render('parent_profil', { title: 'Parent' });
});
router.get('/view_teacher', function(req, res, next) {
  res.render('view_teacher', { title: 'Proximity' });
});
module.exports = router;
