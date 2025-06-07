import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import { Movie } from "../../types/movie";
import { getMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export default function App() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSearchBar = (newQuery: string) => {
        setQuery(newQuery);
        setPage(1);
    };

    const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie)
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["movies", query, page],
        queryFn: () => getMovies(query, page),
        enabled: false,
        placeholderData: keepPreviousData,
    });

    const movies = data?.results ?? [];
    const totalPages = data?.total_pages ?? 0;

    useEffect(() => {
        if (!isLoading && !isError && query && movies.length === 0) {
            toast.error('No movies found for your request.');
        }
    }, [isLoading, isError, query, movies.length]);

    return <div className={css.app}>
        <SearchBar onSubmit={handleSearchBar}/>
        <Toaster />
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && movies.length > 0 && (
            <>
            {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
            <MovieGrid movies={movies} onSelect={handleSelectMovie}/>
            </>
            )}
        {selectedMovie && (<MovieModal movie={selectedMovie} onClose={handleCloseModal} />)}
    </div>
}