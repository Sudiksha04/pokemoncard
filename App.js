import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');

  useEffect(() => {
    axios.get('https://api.pokemontcg.io/v1/cards').then(response => {
      setPokemonList(response.data.cards);
      setFilteredPokemonList(response.data.cards);
    });
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterPokemonList(term, filterOption);
  };

  const handleFilter = (option) => {
    setFilterOption(option);
    filterPokemonList(searchTerm, option);
  };

  const filterPokemonList = (term, option) => {
    let filteredList = pokemonList;
    
    if (term) {
      filteredList = filteredList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (option) {
      filteredList.sort((a, b) => (a[option] > b[option] ? 1 : -1));
    }

    setFilteredPokemonList(filteredList);
  };

  const handleCardClick = (id) => {
    setFilteredPokemonList(prevList =>
      prevList.map(pokemon =>
        pokemon.id === id ? { ...pokemon, flipped: !pokemon.flipped } : pokemon
      )
    );
  };

  return (
    <div className="App">
      <h1>Pokemon Card Collection</h1>
      
      <input
        type="text"
        placeholder="Search Pokemon..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      <select onChange={(e) => handleFilter(e.target.value)}>
        <option value="">All</option>
        <option value="type">Type</option>
        <option value="rarity">Rarity</option>
        {/* Add more options as needed */}
      </select>
      
      <div className="pokemon-list">
        {filteredPokemonList.map(pokemon => (
          <div
            key={pokemon.id}
            className={"pokemon-card {pokemon.flipped ? 'flipped' : ''}"}
          >
            <div className="inner" onClick={() => handleCardClick(pokemon.id)}>
              <div className="front">
                <img src={pokemon.imageUrl} alt={pokemon.name} />
                <h3>{pokemon.name}</h3>
              </div>
              <div className="back">
                <p>Type: {pokemon.type}</p>
                <p>Rarity: {pokemon.rarity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
