const express = require('express');
const app = express();

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');


const firebaseConfig = {
  apiKey: "AIzaSyD5E_Kar4xFD7AiPOCDvoVrepNcEyrVHVs",
  authDomain: "testing-features-ea790.firebaseapp.com",
  databaseURL: "https://testing-features-ea790-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testing-features-ea790",
  storageBucket: "testing-features-ea790.appspot.com",
  messagingSenderId: "633086595387",
  appId: "1:633086595387:web:eaec0e20de19a0902ce71e",
  measurementId: "G-VKZNL0XJ68"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);


app.get('/users', async(req, res) => {
  try{

    const moviesRef = ref(database, 'Users');
    const snapshot = await get(moviesRef);

    if (snapshot.exists()) 
    {
      const usersData = snapshot.val();
      res.json(usersData);
    } 
    else 
    {
      res.status(404).json({ message: 'Users not found' });
    }

  } 
  catch (error) 
  {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users from the database' });
  }
});

app.get('/user', async(req, res) => {
  try{
    const id = req.query.userId

    const usersRef = ref(database, 'Users');
    const snapshotUsers = await get(usersRef);

    const moviesRef = ref(database, 'Movies');
    const snapshotMovies = await get(moviesRef);

    if (snapshotUsers.exists() && snapshotMovies.exists()) 
    {
      const usersData = snapshotUsers.val();
      const user = usersData[id]
      
      const moviesData = snapshotMovies.val();

      const favoriteMoviesId = user.favoriteMovies
      var moviesList = []
      for(const id in moviesData)
      {
        if(favoriteMoviesId.includes(id))
          moviesList.push(moviesData[id])
      }
      
      user.favoriteMovies = moviesList
      
      res.json(user);

    } 
    else 
    {
      res.status(404).json({ message: 'Users not found' });
    }
  } 
  catch (error) 
  {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users from the database' });
  }
});



app.get('/movies', async(req, res) => {
  try{

    const moviesRef = ref(database, 'Movies');
    const snapshot = await get(moviesRef);

    if (snapshot.exists()) 
    {
      const moviesData = snapshot.val();
      res.json(moviesData);
    } 
    else 
    {
      res.status(404).json({ message: 'Movies not found' });
    }

  } 
  catch (error) 
  {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Error fetching movies from the database' });
  }
});

app.get('/movies/category', async(req,res) =>{
  try{
    const catrgory = req.query.category;

    var moviesJson = {}

    const moviesRef = ref(database, 'Movies');
    const snapshot = await get(moviesRef);

    if (snapshot.exists()) 
    {
      const moviesData = snapshot.val();

      for(const id in moviesData)
      {
        const movie = moviesData[id]

        if(movie.genre === catrgory)
          moviesJson[id] = movie 

      }
      res.json(moviesJson);
    }
    else 
    {
      res.status(404).json({ message: 'Movies not found' });
    }

  
  }
  catch(error){
    console.error('Error fetching movies by catogory:', error);
    res.status(500).json({ error: 'Error fetching movies from the database' });
  }

});

app.get('/movies/tag', async(req,res) =>{
  try{
    const tag = req.query.tag;

    var moviesJson = {}

    const moviesRef = ref(database, 'Movies');
    const snapshot = await get(moviesRef);

    if (snapshot.exists()) 
    {
      const moviesData = snapshot.val();

      for(const id in moviesData)
      {
        const movie = moviesData[id]

        const moviesTags = movie.tags

        if(moviesTags.includes(tag))
          moviesJson[id] = movie 

      }
      res.json(moviesJson);
    }
    else 
    {
      res.status(404).json({ message: 'Movies not found' });
    }

  
  }
  catch(error){
    console.error('Error fetching movies by catogory:', error);
    res.status(500).json({ error: 'Error fetching movies from the database' });
  }

});




app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});