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
module.exports = router;
