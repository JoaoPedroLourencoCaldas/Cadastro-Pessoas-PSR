// index.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'cadastro_pessoas'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL.');
});

//criar uma nova pessoa
app.post('/pessoas', (req, res) => {
    const { nome, idade, endereco, telefone, email} = req.body;
    const sql = 'INSERT INTO pessoas (nome, idade, endereco, telefone, email) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, idade, telefone, email], (err, results) => {
        if (err) throw err;
        res.status(201).json({ id: results.insertId, nome, idade, endereco, telefone, email });
    });
});

//listar todas as pessoas
app.get('/pessoas', (req, res) => {
    const sql = 'SELECT * FROM pessoas';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

//obter uma pessoa específica
app.get('/pessoas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM pessoas WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

//atualizar uma pessoa
app.put('/pessoas/:id', (req, res) => {
    const { id } = req.params;
    const { nome, idade, endereco, telefone, email } = req.body;
    const sql = 'UPDATE pessoas SET nome = ?, idade = ?, endereco = ?, telefone = ?, email = ? WHERE id = ?';
    db.query(sql, [nome, email, telefone, id], (err) => {
        if (err) throw err;
        res.json({ id, nome, idade, endereco, telefone, email });
    });
});

//deletar uma pessoa
app.delete('/pessoas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM pessoas WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.status(204).send();
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});