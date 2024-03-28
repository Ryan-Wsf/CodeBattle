const express = require('express'); // Permet de créer un serveur
const cors = require('cors'); // Permet de gerer les requetes entre serveurs
const sqlite3 = require('sqlite3'); // Permet de gérer la base de données SQLITE

const app = express(); // Création du serveur
const PORT = process.env.PORT || 3000; // Port d'écoute du serveur

// Connexion à la base de données SQLITE
const db = new sqlite3.Database('./db.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE , (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données', err);
        return;
    }
    console.log('Connexion à la base de données établie');
});

// Création des tables dans la base de données
db.serialize(() => {
    //Table pour stocker les exercices
    db.run(`
        CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            enonce TEXT NOT NULL,
            solution TEXT NOT NULL,
            langage TEXT NOT NULL
        )
    `)
    //Table pour stocker les tags
    db.run(`
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `)
    //Table pour stocker les relations entre les exercices et les tags
    db.run(`
        CREATE TABLE IF NOT EXISTS exercise_tag (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exercise_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            FOREIGN KEY(exercise_id) REFERENCES exercises(id),
            FOREIGN KEY(tag_id) REFERENCES tags(id)
        )
    `)
});

app.use(express.json()); // Permet de parser les requetes en JSON
app.use(cors()); // Permet de gerer les requetes entre serveurs

//Autoriser toutes les IP
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Les routes seront afficher à partir d'ici


// Quand on arrive sur la page d'accueil on affiche un message
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route pour récupérer un exercice
app.post('/exercises', async (req, res) => {
    //Récupération des données de la requête
    const { title, enonce, solution, langage, } = req.body;
    const insertExerciseSql = `INSERT INTO exercises (title, enonce, solution, langage) VALUES (?, ?, ?, ?)`;

    try{
        //Insertion de l'exercice dans la base de données
        db.run(insertExerciseSql, [title, enonce, solution, langage], err => {
            if(err){d
                console.error(err);
                res.status(500).json({ error : 'Internal server error'});
                return;
            }
            res.status(201).json({ message : 'Exercise added successfully' });
        });
    } catch(err){
        console.error(err);
        res.status(500).json({ error : 'Internal server error'});
    }
})
// Route pour afficher tous les exercices
app.get('/exercises', async (req, res) => {
    const selectExercisesSql = `SELECT * FROM exercises`;

    try{
        db.all(selectExercisesSql, [], (err, rows) => {
            if(err){
                console.error(err);
                res.status(500).json({ error : 'Internal server error'});
                return;
            }
            res.status(200).json(rows);
        });
    } catch(err){
        console.error(err);
        res.status(500).json({ error : 'Internal server error'});
    }
})

// Route pour supprimer les exercices 

app.get('/exercices/:id'), async (req, res) => {
    const { id } = req.params
    const deletExerciceSql = `DELETE FROM exercises WHERE id = ?`

    try {
        db.run (deletExerciceSql, [ id ], err => {
            if(err){
                console.error(err)
                res.status(500).json({ error : 'Internal server error' })
                return
            }
            res.status(200).json({ message : 'Exercise delete successfully' })
        })
    } catch (err){
        console.log(err)
        res.status(500).json({ error : 'Internal server error' })
    }
}





// Cette commande doit aller a la fin de votre fichier de serveur
app.listen(PORT, () => {
  console.log(`Le serveur est lancé : http://localhost:${PORT}`);
});
