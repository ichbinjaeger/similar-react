import { useEffect, useState } from 'react'
import './App.css'
import getPage from './api/content'

function App() {
  // STATES
  const [movieData, setMovieData] = useState(null)
  const [movieX, setMovieX] = useState(null)
  const [movieY, setMovieY] = useState(null)
  const [moviesAreSimilar, setMoviesAreSimilar] = useState(null)

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
    } else if (movieY === null) {
      setMovieY(movie)
    } else return
  }

  const clearSelection = () => {
    setMovieX(null)
    setMovieY(null)
  }

  const compareProdYear = (movieX, movieY) => {
    return movieX.production.year === movieY.production.year
  }
  const compareParentalRating = (movieX, movieY) => {
    return movieX.parentalRating === movieY.parentalRating
  }
  const compareIMDbRating = (movieX, movieY) => {
    return Math.round(movieX?.imdb?.rating) === Math.round(movieY?.imdb?.rating)
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

    return containsSameActor
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
    return movieXDuration() === movieYDuration()
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
    const isSimilar = resultArr.filter(bool => bool).length < 3
    console.log(resultArr, 'Similar: ' + isSimilar)
    return isSimilar
  }

  return (
    <div className='container'>
      <h1>Are these similar?</h1>
      <div className='comparison-container'>
        <div className='movie movie-x'>
          {movieX ? <h3>{movieX?.title}</h3> : 'Choose a movie'}
        </div>
        <div className='middle-section-container'>
          <h2>{moviesAreSimilar ? 'Yes' : 'No'}</h2>
          <button onClick={() => clearSelection()}>Clear selection</button>
          <ul className='similarities-list'>
            <li>Lentght</li>
          </ul>
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
                <li
                  className='list-item'
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
