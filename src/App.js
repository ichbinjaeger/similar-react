import { useEffect, useState } from 'react'
import './App.css'
import getPage from './api/content'

function App() {
  const [movieData, setMovieData] = useState(null)

  const fetchData = async () => {
    const res = await getPage()
    setMovieData(res.blocks[0].products)
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div className='container'>
      {movieData ? (
        <div className='movie-grid-container'>
          <ul className='list'>
            {movieData.map((movie, key) => {
              return (
                <li className='list-item' key={key}>
                  <div className='list-content'>
                    <h3>{movie.title}</h3>
                    <ul>
                      <li>Production year: {movie.production.year}</li>
                      <li>Parental rating: {movie.parentalRating}</li>
                      <li>IMDb rating: {movie.imdb?.rating}</li>
                      <li>Actors: {movie.people.actors?.join(', ')}</li>
                      <li>Duration: {movie.duration.readable}</li>
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        'Loading...'
      )}
    </div>
  )
}

export default App
