import React, { useState,useEffect } from 'react'
import { useDebounce } from 'react-use'
import Search from './components/search'
import { updateSearchcount,trendinglatestMovies } from './appwrite';
import Moviecard from './components/Moviecard';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}




const App = () => {
  const[searchItem,setSearchItem]=useState('')
  const[errormessage,setError]=useState('')
  const[trendingMovies,setTrendingMoveis]=useState([])
  const[movielist,setList]=useState([])
  const[isLoading,setLoading]=useState(false)
  const[useDebounceterm,setuseDebounceterm]=useState('')
  useDebounce(()=>setuseDebounceterm(searchItem),500,[searchItem])
  const fetchMovies=async (query='') => {
    setLoading(true);
    try{
       const endpoint=query
       ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`

       :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response=await fetch(endpoint,API_OPTIONS)
    if(!response.ok){
      throw new Error("Failed to fetch movies")
    }
    const data= await response.json();
      
    setList(data.results)
    if(query&&data.results.length>0)
    {
      updateSearchcount(query,data.results[0]);
    }
   
    
    }
    
    
    catch(err){
      alert(`Movie not fetche:${err}`)
      setError("Failed to fetch data.Please try again")
    }
    finally{
      setLoading(false)
    }
   
  }

  const loadtrending=async ()=> {
    try{
      const movie=await trendinglatestMovies()
      setTrendingMoveis(movie)
    }catch(err){
      console.log(err)
    }
   

    
  }

  
  useEffect(() => {
    fetchMovies(useDebounceterm);
  }, [useDebounceterm])

useEffect(() => {
 loadtrending();
}, [])

  
  return (
    <main>
    <div className='pattern'>
      <div className='wrapper'>
        <header>
       
          <h1>
          <img src="./hero.png" alt="" />
            <span className='text-gradient'>Moveis You'all </span> Enjoy without Hassle
          </h1>
          <Search searchItem={searchItem} setSearchItem={setSearchItem}/>
          {/* <h1>{searchItem}</h1> */}
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
           
          )}
        
        <section className="all-movies">
        <h2>All Movies</h2>
       {isLoading?(
            <p>Loading...</p>
       ):errormessage?(
          <h2 className='text-white'>{errormessage}</h2>
       ):
       (
        <ul>
          {
            movielist.map((movie)=>(
              
              <Moviecard key={movie.id} movie={movie}/>
            ))
          }
        </ul>
       )
       }
      </section>
      </div>
      

    </div>
   
    </main>
 
  )
}

export default App
