import { useEffect, useState } from "react"
import "./App.css"
import getPage from "./api/content"

function App() {
  const [movieData, setMovieData] = useState(null)

  const fetchData = async () => {
    const res = await getPage()
    console.log(res)
    setMovieData(res.blocks[0].products)
    console.log(movieData)
  }

  useEffect(() => {
    fetchData()
  })

  return <div className="container">hej</div>
}

export default App
