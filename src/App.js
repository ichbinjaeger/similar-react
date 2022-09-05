import { useEffect, useState } from 'react'
import './App.css'
import getPage from './api/content'

function App() {
  const [movieData, setMovieData] = useState(null)

  const fetchData = async () => {
    const res = await getPage()
    setMovieData(res.blocks[0].products)
    console.log(movieData)
  }

  useEffect(() => {
    fetchData()
  })

  return (
    <div className='container'>
      {movieData ? (
        <ul>
          {movieData.map((item, key) => {
            return (
              <li key={key}>
                <h3>{item.title}</h3>
              </li>
            )
          })}
        </ul>
      ) : (
        'Loading...'
      )}
    </div>
  )
}

export default App
