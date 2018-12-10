import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import {Route, Link} from 'react-router-dom';
import Bookfinder from './Bookfinder'

const shelvesGlobal = [
    {value: "currentlyReading", display: "Currently Reading"},
    {value: "wantToRead", display: "Want to Read"},
    {value: "read", display: "Read"},
    {value: "none", display: "None"}
];

//  props: book, shelves, reshelfFunc
function BookIcon(props) {
  return (
    <li>
      <div className='book'>
        <div className='book-top'>
          <div className='book-cover' style={{ width: 128, height: 192, backgroundImage: `url(${props.book.imageLinks.thumbnail})`}} ></div>         
          <div className='book-shelf-changer'>
            <select value={props.book.shelf} onChange={(e)=>{e.preventDefault(); props.reshelfFunc(props.book, e.target.value)}} >
              <option value='move' disabled>Move to...</option>
              {props.shelves.map((item, idx)=>(<option key={idx} value={item.value}>{item.display}</option>))}
            </select>
          </div>
        </div>
        <div className='book-title'>{props.book.title}</div>
        <div className='book-authors'>{props.book.authors}</div>
      </div>
    </li>
  );
}


//  props: shelf, shelves, library, reshelfFunc, displayAll
function Bookshelf(props) {

  //  obtain a subset of the library containing only the books belonging on the shelf supplied
  //  as props.shelf; the JSON book object's "shelf" element is the same as the value element in
  //  our shelf
  let shelfStack = props.library;
  let shelfTitle = null;
  if (!(props.displayAll)) {
    shelfStack = props.library.filter(item=>item.shelf === props.shelf.value);
    shelfTitle = (<h2 className='bookshelf-title'>{props.shelf.display}</h2>);
  }

  //  don't display the bookshelf if it's empty
  if (shelfStack.length) {
    return(
      <div className='bookshelf'>
        {shelfTitle}
        <div className='bookshelf-books'>
          <ol className='books-grid'>
          {shelfStack.map((item)=>(<BookIcon key={item.id} book={item} shelves={props.shelves} reshelfFunc={props.reshelfFunc} />))}
          </ol>
        </div>
      </div>
    );
  }

  return (null);
}

//  props:  shelves, library, reshelfFunc
function Bookcase(props) {

  return (
    <div className='list-books'>
      <div className='list-books-title'>
        <h1>My Reads</h1>
      </div>
      <div className='list-books-content'>
        {props.shelves.map(
          item=>{
            if (item.value !== 'none')  {
              return (<Bookshelf key={item.value} shelf={item} shelves={props.shelves} library={props.library} reshelfFunc={props.reshelfFunc} displayAll={false} />);
            }
            return null;
          }
        )}
      </div>
      <div className='open-search'>
        <Link to="/search"><button>Add a book</button></Link>
      </div>
    </div>
  );
}


class BooksApp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {library: []};

    //  this method is required by other components on the main page
    this.reshelf = this.moveBook.bind(this);

    //  these methods are required on the search page
    this.reloadFunc = this.reloadLib.bind(this);
    this.bookToShelfFunc = this.bookIsOnShelf.bind(this);
  }

  componentDidMount() {
    this.reloadLib();
  }

  //  load the library again from the server and force a new render if something has changed
  reloadLib() {
    BooksAPI.getAll().then((res)=>{this.setState({library: res});}).catch(e=>console.log(e));
  }

  //  given a book ID, returns a shelf name, if the book exists in our library;
  //  if not, this returns 'none'; called from search page
  bookIsOnShelf(bookID) {
    let tempBook = this.state.library.filter(item=>item.id === bookID);

    if (tempBook && tempBook.length) {
      return (tempBook[0].shelf);
    }
    return 'none';
  }

  //  to move a book from one shelf to another, update the shelf at the server, then reload the
  //  entire library from the server; this is pretty slow, but the local state will always reflect
  //  the remote state
  moveBook(book, shelf) {
    if (shelf !== 'none') {
      BooksAPI.update(book, shelf).then(()=>BooksAPI.getAll()).then((res)=>{this.setState({library: res});}).catch(e=>console.log(e));
    }
  }

  render() {
    return (
      <div className="app">
        <Route exact path='/' render={()=>(<Bookcase shelves={shelvesGlobal} library={this.state.library} reshelfFunc={this.reshelf} />)} />
        <Route path='/search' render={()=>(<Bookfinder bookToShelfFunc={this.bookToShelfFunc} reloadFunc={this.reloadFunc} />)} />
      </div>
    );
  }
}


export default BooksApp;
export {BooksApp, Bookshelf, shelvesGlobal};
