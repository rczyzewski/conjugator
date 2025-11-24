import React, { useEffect, useState } from 'react';



  export default function TodoList() {
  const [newItem, setNewItem] = useState<string>('');

   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(newItem);
   }

  return (
    <>
    <form onSubmit={handleSubmit}>
        <div className="from-row">
        <label htmlFor="item">New Item</label>
        <input 
            value={newItem} 
            onChange={(e) => setNewItem(e.target.value)} 
            type="text" 
            id="item" />
        </div>
        <button className="btn btn-primary">Add</button>
    </form>
    <h1 className="header">Todo List</h1>
      <ul className="list">
      <li>
        <label>
            <input type="checkbox" /> Item1
        </label>
        <button className="btn btn-danger">Delete</button>
      </li>
      </ul>
  </>
  );
};
