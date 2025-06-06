import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import { Movie } from "../../types/movie";
import { getMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSearchBar = async (query: string) => {
        setIsLoading(true);
        setIsError(false);
        setMovies([]);
        try {
            const results = await getMovies(query);
            if (results.length === 0) {
                toast.error('No movies found for your request.');
            }
            setMovies(results);
        } catch {
             setIsError(true);
        } finally {
             setIsLoading(false);
        }
    };

    const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie)
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    return <div className={css.app}>
        <SearchBar onSubmit={handleSearchBar}/>
        <Toaster />
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && movies.length > 0 && (<MovieGrid movies={movies} onSelect={handleSelectMovie}/>)}
        {selectedMovie && (<MovieModal movie={selectedMovie} onClose={handleCloseModal} />)}
    </div>
}