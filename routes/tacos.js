const express = require('express');
const router = express.Router();
const pg = require('pg');
const conString = 'postgres://@localhost/taco_types';

router.get('/', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM tacos', function(err, result) {
      done();
      console.log('RESULT ROWS: ', result.rows);
      res.render('tacos/index', {title: 'Tacos', tacos: result.rows});
      if (err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0]);
      console.log('connected to databse');
    });
  });
});

router.get('/add', function(req, res, next) {
  res.render('tacos/add');
});

router.get('/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM tacos WHERE id = $1',
                 [req.params.id], function(err, result) {
      done();
//      console.log('GET /:id**RESULT ROWS: ', result.rows[0]);
      res.render('tacos/index', {title: 'One Taco', tacos: result.rows});
      if (err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0]);
      console.log('connected to databse');
    });
  });
});


router.post('/', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO tacos(shell, taste) VALUES($1, $2) returning id',
                 [req.body.shell, req.body.taste], function(err, result) {
      done();
      console.log('POST /**RESULT.ROWS: ', result.rows);
      res.redirect('/tacos/' + result.rows[0].id);
      if (err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0]);
      console.log('connected to databse');
    });
  });
});

router.get('/delete/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('DELETE FROM tacos WHERE id = $1',
                 [req.params.id], function(err, result) {
      done();
      console.log('DELETE GET**RESULT ROWS: ', result.rows[0]);
      res.redirect('/tacos/');
      if (err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0]);
      console.log('connected to databse');
    });
  });
});

router.get('/update/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM tacos WHERE id = $1',
                 [req.params.id], function(err, result) {
      done();
      console.log('UPDATE GET**RESULT ROWS: ', result.rows[0]);
                   res.render('tacos/update', {title: 'Edit your Taco', taco: result.rows[0]});
      if (err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0]);
      console.log('connected to databse');
    });
  });
});

router.post('/update/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('UPDATE tacos SET shell = $1, taste = $2 WHERE id = $3 RETURNING id',
                 [req.body.shell, req.body.taste, req.params.id], function(err, result) {
      done();
      console.log('UPDATE BLOCK**RESULT: ', result);
      res.redirect('/tacos/' + result.rows[0].id);
      if (err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0]);
      console.log('connected to databse');
    });
  });
});

module.exports = router;
