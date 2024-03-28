import { useState } from "react";
import "../styles/form.css";

function Formulaire(){
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        enonce: '',
        solution: '',
        langage: 'javascript'
    });
    const handlesubmit = async (e) => {
        e.preventDefault();
        // Envoi des données au serveur back http://localhost:3000/exercises
        try{
            // Envoi des données au serveur
            const req = await fetch('http://localhost:3000/exercises', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (req.ok){
                setMessage('Exercice ajouté avec succès');
                // Effacer le message au bout de 5 secondes
                setTimeout(() => {
                    setMessage('')
                }, 5000)

            }

        } catch(err){
            console.error(err);
        }
    }

    const handlechange = (e) => {
        // Fonction qui permet de récupérer les données du formulaire et qui les associes a la bonne clé dans le state formData
        const {name, value} = e.target;
        setFormData({
            // les 3 points copie l'objet formData et on ajoute la nouvelle valeur
            ...formData,
            [name]: value
        })
    }


    return (
        <div className="form">
            {message && <p id="succes">{message}</p>}
            <form onSubmit={handlesubmit}>
            <input 
                type="text"
                placeholder="Titre de l'exercice"
                name="title"
                className="input_field"
                onChange={handlechange}
                value={formData.title}
            />
            <textarea 
                placeholder="Enoncé de l'exercice"
                name="enonce"
                className="input_field"
                cols="30"
                rous="10"
                onChange={handlechange}
                value={formData.enonce}
            />

            <textarea
                placeholder="Solution de l'exercice"
                name="solution"
                className="input_field"
                cols="30"
                rous="10"
                onChange={handlechange}
                value={formData.solution}
            />
            <select
                name="language" 
                className="input_field"
                onChange={handlechange}
                value={formData.langage}
            >
                <option value="javascript">Javascript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="php">PHP</option>
            </select>
            <button type="submit">Ajouter l'exercice</button>

            </form>
        </div>
    )
}
export default Formulaire;