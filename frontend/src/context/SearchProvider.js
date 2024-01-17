import React, { useState } from "react";
import { createContext } from "react";
import { useNotification } from "../hooks";

export const SearchContext = createContext();

let timeoutId;
const debounce = (func, delay) => {
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export default function SearchProvider({ children }) {
  const [searching, setsearching] = useState(false);
  const [results, setresults] = useState([]);
  const [resultsNotFound, setresultsNotFound] = useState(false);

  const { updateNotification } = useNotification();

  /**
   * The function "search" takes in a method and a query, and then performs a search using the method and
   * updates the results accordingly.
   * @param method - The `method` parameter is a function that is used to perform a search operation. It
   * takes a `query` parameter as input and returns an object with two properties: `error` and `results`.
   * @param query - The query parameter is a string that represents the search query or keyword that is
   * being used to search for results.
   * @returns The function `search` returns either an error message or the results of the search query.
   */
  const search = async (method, query, updaterFun) => {
    const { error, results } = await method(query);
    if (error) return updateNotification("error", error);

    if (!results.length) return setresultsNotFound(true);

    setresults(results);
    updaterFun && updaterFun([...results]);
  };
  const debounceFunc = debounce(search, 300);

  /**
   * The handleSearch function takes in a search method and query, sets a searching state to true, and
   * calls a debounce function with the method and query.
   * @param method - The method parameter is a function that will be called to perform the search. It is
   * passed as an argument to the debounceFunc function.
   * @param query - The `query` parameter is a string that represents the search query entered by the
   * user. It is the input that will be used to search for results.
   */
  const handleSearch = (method, query, updaterFun) => {
    setsearching(true);
    if (!query.trim()) {
      updaterFun && updaterFun([]);
      resetSearch();
    }

    debounceFunc(method, query, updaterFun);
  };

  const resetSearch = () => {
    setsearching(false);
    setresults([]);
    setresultsNotFound(false);
  };

  return (
    <SearchContext.Provider
      value={{ handleSearch, resetSearch, searching, resultsNotFound, results }}
    >
      {children}
    </SearchContext.Provider>
  );
}
