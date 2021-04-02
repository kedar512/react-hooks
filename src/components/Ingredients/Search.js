import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const { onFilterIngredients } = props;
  const [filterText, setFilterText] = useState('');
  const inputRef = useRef();

  useEffect( () => {
    const inputTimer = setTimeout( () => {
      console.log('[Search] Inside setTimeout()');
      if (filterText === inputRef.current.value) {
        console.log('[Search] call filter ingredients API');
        async function fetchIngredients() {
          const queryParams = filterText.trim().length === 0 ? '' : `?orderBy="title"&equalTo="${filterText}"`;
          const response = await fetch(`https://react-hooks-54d9e-default-rtdb.firebaseio.com/ingredients.json${queryParams}`);
    
          if(!response.ok) {
            throw new Error(`Http Error! status: ${response.status}`);
          }
    
          return await response.json();
        }
    
        fetchIngredients()
          .then(responseData => {
            const loadedIngredients = [];
    
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onFilterIngredients(loadedIngredients, filterText);
          })
          .catch(error => console.log(error));
      } else {
        console.log('[Search] Text before 500ms did not match');
      }
    }, 500);

    return () => {
      console.log('[Search] Inside clear timer');
      clearTimeout(inputTimer);
    }
  }, [filterText, onFilterIngredients, inputRef]); // Works as a componentDidMount if empty array is passed

  useEffect(() => {
    console.log('[Search] Mounted');

    return () => {
      console.log('[Search] Unmounted');
    }
  }, []);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            value={filterText}
            onChange={ (event) => setFilterText(event.target.value) }
            type="text" />
        </div>
      </Card>
    </section>
  );
});

export default Search;
