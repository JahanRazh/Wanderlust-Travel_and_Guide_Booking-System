import React from 'react';
import SearchBar from './Input/SearchBar'; // Search bar component

const Navbar = ({  searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
  


  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery('');
  };

  return (
    <div>

      <div>
      <br></br>
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />  
  
      </div>
      
    </div>
  );
};

export default Navbar;