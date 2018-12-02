import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import {BrowserRouter, Route, Link} from 'react-router-dom';



class Bookfinder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {query: ''};

    
  }

  
  render() {
    return (
      <div className="search-books-bar">
        <Link to='/' className='close-search'>Close</Link>
        <div className='search-books-input-wrapper'>
        <input value={this.state.query}></input>
        </div>
      </div>
    );
  }
}


export default Bookfinder
