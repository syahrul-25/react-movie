import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
// Image
import searhIcon from "../../images/search-icon.svg";
// styles
import { Wrapper, Content } from "./SearchBar.style";

const SearchBar = ({ setSearchTerm, searchTerm }) => {
  const [state, setState] = useState("");
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setSearchTerm(state);
    }, 500);

    return () => clearTimeout(timer);
  }, [setSearchTerm, state]);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }

    setState(searchTerm);
  }, [setState, searchTerm]);
  return (
    <Wrapper>
      <Content>
        <img src={searhIcon} alt="search-icon" />
        <input
          type="text"
          placeholder="Search Movie"
          onChange={(e) => setState(e.currentTarget.value)}
          value={state}
        />
      </Content>
    </Wrapper>
  );
};

SearchBar.propTypes = {
  setSearhTerm: PropTypes.func,
};

export default SearchBar;
