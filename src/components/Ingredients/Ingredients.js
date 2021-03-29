import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {

  useEffect( () => {
    console.log('[Ingredients] Rerendered');
  });

  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredient = ingredient => {
    async function saveIngredients() {
      let response = await fetch('https://react-hooks-54d9e-default-rtdb.firebaseio.com/ingredients.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingredient)
      });

      if (!response.ok) {
        throw new Error(`Http Error status: ${response.status}`);
      }

      return await response.json();
    }

    saveIngredients()
      .then(responseData => {
        setUserIngredients( prevIngredients =>
          [...prevIngredients,
            {id: responseData.name, ...ingredient }]
        );
      })
      .catch(error => console.log(error));
  }

  const removeIngredient = id => {
    const tempIngredients = [...userIngredients];
    const newIngredients = tempIngredients.filter(ig => id !== ig.id);
    setUserIngredients(newIngredients);
  }

  const filteredIngredientsHandler = useCallback(ingredients => {
    setUserIngredients(ingredients);
  }, [])

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredient} />

      <section>
        <Search onFilterIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredient} />
      </section>
    </div>
  );
}

export default Ingredients;
