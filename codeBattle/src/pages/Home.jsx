// Import des modules nécessaires depuis React
import React, { useState, useEffect } from 'react';

// Définition du composant Home
const Home = () => {
    // Déclaration des états pour stocker les exercices et l'index de l'exercice actuel
    const [exercises, setExercises] = useState([]); // tableau vide d'exercices au début
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // index 0 pour commencer

    // Effet de chargement initial pour récupérer les exercices depuis l'API
    useEffect(() => {
        fetch('http://localhost:3000/exercises') // Envoi de la requête HTTP GET à l'API
            .then(response => response.json()) // Conversion de la réponse en JSON
            .then(data => setExercises(data)) // Mise à jour de l'état exercises avec les données reçues
            .catch(error => console.log(error)); // Gestion des erreurs
    }, []); // Dépendance vide pour s'assurer que cet effet ne s'exécute qu'une seule fois

    // Fonction pour gérer les événements de touche du clavier
    const handleKeyDown = (event) => {
        if (event.keyCode === 37 && currentExerciseIndex > 0) { // Touche gauche (←) pour l'exercice précédent
            handlePreviousExercise();
        } else if (event.keyCode === 39 && currentExerciseIndex < exercises.length - 1) { // Touche droite (→) pour l'exercice suivant
            handleNextExercise();
        }
    };

    // Effet pour ajouter et retirer un écouteur d'événements de touche du clavier
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown); // Ajout de l'écouteur d'événements
        return () => {
            document.removeEventListener('keydown', handleKeyDown); // Suppression de l'écouteur d'événements lors du démontage du composant
        };
    }, [currentExerciseIndex]); // Déclenche cet effet uniquement lorsque l'index de l'exercice actuel change

    // Fonction pour passer à l'exercice suivant
    const handleNextExercise = () => {
        setCurrentExerciseIndex(prevIndex => prevIndex + 1); // Incrémentation de l'index
    };

    // Fonction pour passer à l'exercice précédent
    const handlePreviousExercise = () => {
        setCurrentExerciseIndex(prevIndex => prevIndex - 1); // Décrémentation de l'index
    };

    // Fonction pour supprimer un exercice
    const handleDeleteExercise = () => {
        const id = exercises[currentExerciseIndex].id;
        fetch(`http://localhost:3000/exercises/${id}`, {
            method: 'DELETE'
        })
    };
    // Récupération de l'exercice actuel en fonction de l'index
    const currentExercise = exercises[currentExerciseIndex];

    // Rendu du composant
    return (
        <div>
            {currentExercise && ( // Vérification si un exercice est actuellement sélectionné
                <div>
                    <h1>{currentExercise.title}</h1>  {/*  Titre de l'exercice */}
                    <p>{currentExercise.enonce}</p>   {/* Énoncé de l'exercice */}

                    {/* Bouton pour passer à l'exercice précédent */}
                    <button onClick={handlePreviousExercise} disabled={currentExerciseIndex === 0}>
                        Exercice Précédent
                    </button>
                    {/* Bouton pour passer à l'exercice suivant */}
                    <button onClick={handleNextExercise} disabled={currentExerciseIndex === exercises.length - 1}>
                        Exercice Suivant
                    </button> 
                    <button onClick={handleDeleteExercise}>Delete
                    </button>
                </div>
            )}
        </div>
    );
};

// Export du composant Home pour qu'il puisse être utilisé ailleurs dans l'application
export default Home;
