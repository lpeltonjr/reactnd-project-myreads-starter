import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import {BrowserRouter, Route, Link} from 'react-router-dom';



class Bookfinder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {query: ''};

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    this.setState({query: event.target.value});
  }

  
  render() {
    return (
      <div className="search-books-bar">
        <Link to='/' className='close-search'>Close</Link>
        <div className='search-books-input-wrapper'>
        <input value={this.state.query} onChange={this.handleInputChange}></input>
        </div>
      </div>
    );
  }
}


export default Bookfinder
