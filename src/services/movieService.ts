import axios from 'axios';
import { Movie } from '../types/movie';

const BASE_URL = "https://api.themoviedb.org/3/search/movie";

interface MovieSearchResponseProps {
  results: Movie[];
  page: number;
  total_pages: number;
}

export const getMovies = async (
  query: string,
  page: number = 1
): Promise<MovieSearchResponseProps> => {
  const { data } = await axios.get<MovieSearchResponseProps>(BASE_URL, {
    params: {
      query,
      page,
      adult: false,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });
  return data;
};