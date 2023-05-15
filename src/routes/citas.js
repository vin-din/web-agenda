const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('citas/add');
});

router.post('/add', isLoggedIn, async (req, res) =>{
    const { title, subtitle, description, date, time  } = req.body;
    const newAgenda = {
        title,
        subtitle,
        description,
        date,
        time,
        user_id: req.user.id
    };
   await pool.query('INSERT INTO citas set ?', [newAgenda]);
   req.flash('agendado', '¡Se ha agendado una cita!');
   res.redirect('/citas');
});

router.get('/', isLoggedIn, async (req, res) => {
    const citas = await pool.query('SELECT * FROM citas WHERE user_id = ?', [req.user.id]);
    res.render('citas/cita',{citas: citas});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM citas WHERE ID = ?', [id]);
    req.flash('agendado','¡Se ha eliminado la cita!');
    res.redirect('/citas');
});

router.get('/edit/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    const citas = await pool.query('SELECT * FROM citas WHERE id = ?', [id]);
    console.log(citas[0]);
    res.render('citas/edit',{cita: citas[0]} );
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, description, date, time } = req.body;
    const newCita = {
        title,
        subtitle,
        description,
        date,
        time
    };
    await pool.query('UPDATE citas set ? WHERE id = ?', [newCita, id]);
    req.flash('agendado', '¡Se ha editado su cita!');
    res.redirect('/citas');
});

module.exports = router;
