import { useEffect, useState } from 'react'
import './App.css'
import getPage from './api/content'

function App() {
  // STATES
  const [movieData, setMovieData] = useState(null)
  const [movieX, setMovieX] = useState(null)
  const [movieY, setMovieY] = useState(null)
  const [moviesAreSimilar, setMoviesAreSimilar] = useState(null)
  const [active, setActive] = useState()

  const fetchData = async () => {
    const res = await getPage()
    setMovieData(res.blocks[0].products)
  }

  useEffect(() => {
    fetchData()

    if (movieX !== null && movieY !== null) {
      setMoviesAreSimilar(compareProperties(movieX, movieY))
    }
  }, [movieX, movieY])

  const handleSelect = movie => {
    if (movieX === null) {
      setMovieX(movie)
      setActive(movie)
    } else if (movieY === null) {
      setMovieY(movie)
      setActive(movie)
    } else return
  }

  const clearSelection = () => {
    setMovieX(null)
    setMovieY(null)
    setMoviesAreSimilar(null)
    setActive(null)
  }

  const compareProdYear = (movieX, movieY) => {
    if (movieX.production.year === movieY.production.year) {
      return 'Production year'
    } else return false
  }
  const compareParentalRating = (movieX, movieY) => {
    if (movieX.parentalRating === movieY.parentalRating) {
      return 'Parental rating'
    } else return false
  }
  const compareIMDbRating = (movieX, movieY) => {
    if (Math.round(movieX?.imdb?.rating) === Math.round(movieY?.imdb?.rating)) {
      return 'IMDb rating'
    } else return false
  }

  const compareActors = (movieX, movieY) => {
    if (
      movieX.people.actors === undefined ||
      movieY.people.actors === undefined
    ) {
      return false
    }
    const containsSameActor = movieX.people.actors.some(actor => {
      return movieY.people.actors.includes(actor)
    })
    if (containsSameActor) {
      return 'Actor(s)'
    } else return false
  }

  const compareDuration = (movieX, movieY) => {
    // 3600000ms in an hour
    const oneHour = 3600000
    const twoHours = 3600000 * 2

    const movieXDuration = () => {
      const runningTimeX = movieX.duration.milliseconds
      if (runningTimeX < oneHour) {
        return 1
      } else if (runningTimeX >= oneHour && runningTimeX < twoHours) {
        return 2
      } else return 3
    }
    const movieYDuration = () => {
      const runningTimeY = movieY.duration.milliseconds
      if (runningTimeY < oneHour) {
        return 1
      } else if (runningTimeY >= oneHour && runningTimeY < twoHours) {
        return 2
      } else return 3
    }
    if (movieXDuration() === movieYDuration()) {
      return 'Duration'
    } else return false
  }

  const compareProperties = (movieX, movieY) => {
    const similarProdYear = compareProdYear(movieX, movieY)
    const similarParentalRating = compareParentalRating(movieX, movieY)
    const similarIMDBRating = compareIMDbRating(movieX, movieY)
    const similarActors = compareActors(movieX, movieY)
    const similarDuration = compareDuration(movieX, movieY)

    const resultArr = [
      similarProdYear,
      similarParentalRating,
      similarIMDBRating,
      similarActors,
      similarDuration,
    ]

    return resultArr.filter(bool => bool)
  }

  const ListItem = ({ children, active, onClick }) => {
    return (
      <li
        onClick={onClick}
        className={active ? 'list-item active' : 'list-item'}
      >
        {children}
      </li>
    )
  }

  return (
    <div className='container'>
      <h1>Are these similar?</h1>
      <div className='comparison-container'>
        <div className='movie movie-x'>
          {movieX ? (
            <h3 className='movie-title'>{movieX?.title}</h3>
          ) : (
            'Choose a movie'
          )}
        </div>
        <div className='middle-section-container'>
          <h2>
            {moviesAreSimilar?.includes('Production year' && 'Parental rating')
              ? 'Yes'
              : moviesAreSimilar === null
              ? 'Choose two movies to find out'
              : 'No'}
          </h2>
          <h3>Are they very similar?</h3>
          <p>
            {moviesAreSimilar?.length >= 3
              ? 'Yes'
              : moviesAreSimilar === null
              ? 'Choose two movies to find out if they have 3 (or more similar properties)'
              : 'No'}
          </p>
          <button onClick={() => clearSelection()}>Clear selection</button>
          {moviesAreSimilar ? (
            <ul className='similarities-list'>
              <h4>Similar properties:</h4>
              {moviesAreSimilar.map((property, key) => {
                return <li key={key}>{property}</li>
              })}
            </ul>
          ) : null}
        </div>
        <div className='movie movie-y'>
          {movieY ? <h3>{movieY?.title}</h3> : 'Choose a movie'}
        </div>
      </div>
      {movieData ? (
        <div className='movie-grid-container'>
          <ul className='list'>
            {movieData.map((movie, key) => {
              return (
                <ListItem
                  active={movie === active}
                  key={key}
                  onClick={() => handleSelect(movie)}
                >
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
                </ListItem>
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
