import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import {BrowserRouter, Route, Link} from 'react-router-dom';
import {BooksApp, Bookshelf, shelvesGlobal} from './App';



class Bookfinder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      query: '',
      library: []
    };

    this.timer = null;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.addBook = this.moveBook.bind(this);
  }

  //  text box input handler
  handleInputChange(event) {
    event.preventDefault();
    //  if the input has changed within 1 second of the last input, clear the timeout and set it again
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    //  update the text box
    this.setState({query: event.target.value});
    //  use a timer to prevent immediate server queries; only query 1 second after any input change
    this.timer = window.setTimeout(
      ()=>{
            //  search at the server and display the results here by updating the entire library
            //  of this component with the search results
            BooksAPI.search(this.state.query).then(
              res=>{
                console.log(res);
                if (res && res.length) {
                  //  don't allow displaying books without thumbnails
                  res = res.filter(item=>item.imageLinks);
                  //  there's no shelf information for any books returned from the search query, so assign it
                  //  such that books in the BooksApp library show their correct shelves, and all other books
                  //  are assigned to shelf 'none'
                  res = res.map(
                    item=>{
                      item.shelf = BooksApp.bookIsOnShelf(item.id);
                      return (item);
                    }
                  );
                  this.setState({library: res});
                } else {
                  this.setState({library: []});
                }
              }
            ).catch(e=>console.log(e));
          },
      1000
    );
  }

  componentWillUnmount() {
    if (this.timer)
    {
      window.clearTimeout(this.timer);
    }
  }

  //  to move a book from the search list to a library shelf --
  //  1) updates the shelf property of the book at the server;
  //  2) updates the library of the BooksApp component, so it will be
  //     correct when we return from the search page;
  //  3) updates the status of the book in its drop-down list on the search page
  moveBook(book, shelf) {
    if (shelf !== 'none') {
      BooksAPI.update(book, shelf).then(
        ()=>{
            BooksApp.reload();
            this.setState(
                prevState=>{
                  let tempLib = prevState.library;
                  tempLib.forEach(
                    (item, idx)=>{
                      if (item.id === book.id) {
                        tempLib[idx].shelf = shelf;
                      }
                    }
                  );
                  return ({library: tempLib});
                }
            )},
        e=>console.log(e)
      );
    }
  }

  render() {
    return (
      <div>
        <div className="search-books-bar">
          <Link to='/' className='close-search'>Close</Link>
          <div className='search-books-input-wrapper'>
            <input value={this.state.query} onChange={this.handleInputChange}></input>
          </div>
        </div>
        <div className='search-books-results'>
          <div className='list-books'>
            <div className='list-books-content'>
              <Bookshelf shelf={shelvesGlobal[3]} shelves={shelvesGlobal} library={this.state.library} reshelfFunc={this.addBook} displayAll={true}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default Bookfinder
