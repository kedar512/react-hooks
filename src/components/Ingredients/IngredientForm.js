import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    //console.log('New Title', title);
    //console.log('New Amount', amount);
  }, [title, amount]);

  /* const setInputDataHandler = event => {
    const newValue = event.target.value;
    const id = event.target.id;
    setInputData(prevState => 
      ({
        ...prevState,
        [id]: newValue
      })
    );
  } */

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({ title: title, amount: amount })
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              id="title" />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              id="amount" />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
