import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case ('SET'): 
      return action.ingredients;
    case ('ADD'):
      return [...currentIngredients, action.ingredient];
    case ('DELETE'):
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Invalid type is passed');
  }
}

function Ingredients() {

  const {isLoading, error, data, sendRequest, reqExtras, identifier, clear} = useHttp();
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  //const [userIngredients, setUserIngredients] = useState([]);
  const [showSearch, setShowSearch] = useState(true); // Using this to test mount and unmount for Search
  //const [isLoading, setLoading] = useState(false);
  //const [error, setError] = useState();

  useEffect( () => {
    console.log('[Ingredients] Rerendered');
    if (!isLoading && !error && 'REMOVE_INGREDIENT' === identifier) {
      dispatch({ type: 'DELETE', id: reqExtras });
    } else if (!isLoading && !error && 'ADD_INGREDIENT' === identifier) {
      dispatch({ type: 'ADD', ingredient: {id: data.name, ...reqExtras } });
    }
  }, [data, reqExtras, isLoading, error, identifier]);

  const addIngredient = useCallback(ingredient => {
    const url = 'https://react-hooks-54d9e-default-rtdb.firebaseio.com/ingredients.json';
    sendRequest(url, 'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT');
  }, [sendRequest]);

  const removeIngredient = useCallback(id => {
    const url = `https://react-hooks-54d9e-default-rtdb.firebaseio.com/ingredients/${id}.json`;
    sendRequest(url, 'DELETE', null, id, 'REMOVE_INGREDIENT');
  }, [sendRequest]);

  const filteredIngredientsHandler = useCallback( (ingredients, filterText) => {
    if ('unmount' === filterText) {
      // Using this for testing purpose
      setShowSearch(false);
    } else {
      //setUserIngredients(ingredients);
      dispatch({ type: 'SET', ingredients: ingredients });
    }
  }, []);

  const ingredientList = useMemo( () => {
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredient} />;
  }, [userIngredients, removeIngredient]);

  return (
    <div className="App">
    {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredient} loading={isLoading} />

      <section>
        { showSearch ? <Search onFilterIngredients={filteredIngredientsHandler} /> : null}
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
