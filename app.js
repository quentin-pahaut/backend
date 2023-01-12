const express = require('express');
const mongoose = require('mongoose');

const app = express();
const Thing = require('./models/thing')

mongoose.connect('mongodb+srv://myfirstmongodb:mypassword@cluster0.x0np60r.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.post('/api/stuff', (req,res,next) =>{

  //Le front renvoie un Id, il n'est pas le même que celui qui sera généré par mongoDB
  // Il faut donc le supprimer
  delete req.body._id;

  //Crée une instance du modèle de donnée Things pour l'envoi à la DB
  const thing = new Thing({
    // on vas récupérer le body de la requête POST envoyée à l'API
    //
    //
    /* SOIT version normale (complète)

    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    userId: req.body.userId,
    price: req.body.price,

    */

    //
    //

    /* SOIT version Spread Operator 
    ...req.body 
    --> vas chercher tous les éléments et structure d'un objet
    --> décompose(EN:spread) en fonction de sa structure et éléments (ici la strucure du POST reçu)
    */
    ...req.body
  });
  /*On sauvegarde les données dans la DB en appellant sa méthode save()
    Ensuite on envoi des promises en retour au front-end
    --> .then() renvoie un statut 200 avec un json contenant un message de réussite
    --> .catch() renvoie un statut 400 d'erreur et un json contenant l'erreur
  */
  thing.save()
    .then(()=> res.status(201).json({ message: 'Objet renregistré !'}))
    .catch((error => res.status(400).json({ error })));
})

// interprète les requêtes GET reçues du front-end munis d'un "id" 
// l'id est fourni par le front et défini un nouveau chemin dynamique vers l'objet désiré
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/stuff', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }))
});

app.put('/api/stuff/:id', (req, res, next) =>{
  Thing.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});



module.exports = app;