import React, { useEffect, useState } from "react";
import "./Row.css";
import axios from "./axios";
import "./Nav.css"

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [modal, setModal] = useState(false);
  const [clickedMovie, setClickedMovie] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const base_url = "https://image.tmdb.org/t/p/original/";

  const handleMovieClick = (movieId) => {
    const clickedMovie = movies.find((movie) => movie.id === movieId);
    setClickedMovie(clickedMovie);
    toggleModal();
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map((movie) => (
          <img
            onClick={() => handleMovieClick(movie.id)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            key={movie.id}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {modal && clickedMovie && (
        <div className="modal">
          <div className="overlay">
            <div className="modal-content">
              <header
                className="modal_img"
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url("https://image.tmdb.org/t/p/original/${clickedMovie.backdrop_path}")`,
                  backgroundPosition: "center center",
                }}
              />
              <h2>{clickedMovie.name}</h2>
              <h2>{clickedMovie.title}</h2>
              <p>{clickedMovie.overview}</p>
              <button className="close-modal" onClick={toggleModal}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Row;