import { useState, useEffect } from "react";
import { atom, useRecoilState } from "recoil";
// API
import API from "../API";
// helper
import { isPersistedState } from "../helpers";

const initialState = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export const search = atom({
  key: "search-key",
  default: "",
});

export const useHomeFetch = () => {
  const [searchTerm, setSearchTerm] = useRecoilState(search);
  const [state, setState] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMovies = async (page, searchTerm = "") => {
    try {
      setError(false);
      setLoading(true);

      const movies = await API.fetchMovies(searchTerm, page);

      setState((prev) => ({
        ...movies,
        results:
          page > 1 ? [...prev.results, ...movies.results] : [...movies.results],
      }));
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  };

  // Initial and Search
  useEffect(() => {
    if (!searchTerm) {
      const sessionState = isPersistedState("homeState");
      if (sessionState) {
        console.log("Grabin from sessionStorage");
        setState(sessionState);
        return;
      }
    }
    console.log("Grabbing from API");
    setState(initialState);
    fetchMovies(1, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (!isLoadingMore) return;

    fetchMovies(state.page + 1, searchTerm);

    setIsLoadingMore(false);
  }, [isLoadingMore, searchTerm, state?.page]);

  // write to sessionStorage
  useEffect(() => {
    if (!searchTerm) sessionStorage.setItem("homeState", JSON.stringify(state));
  }, [searchTerm, state]);
  return { state, loading, error, setSearchTerm, searchTerm, setIsLoadingMore };
};
