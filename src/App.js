import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import {BrowserRouter, Route, Link} from 'react-router-dom';
import Bookfinder from './Bookfinder'

var shelvesGlobal = [
    {value: "currentlyReading", display: "Currently Reading"},
    {value: "wantToRead", display: "Want to Read"},
    {value: "read", display: "Read"},
    {value: "none", display: "None"}
];

//  props: book, shelves, reshelfFunc
function BookIcon(props) {
  console.log("in Book");
  console.log(props);
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
  if (!(props.displayAll)) {
    shelfStack = props.library.filter(item=>item.shelf === props.shelf.value);
  }

  console.log("Bookshelf: " + props.shelf.value);
  console.log(shelfStack);

  //  don't display the bookshelf if it's empty
  if (shelfStack.length) {
    return(
      <div className='bookshelf'>
        <h2 className='bookshelf-title'>{props.shelf.display}</h2>
        <div className='bookshelf-books'>
          <ol className='books-grid'>
          {shelfStack.map(
            (item)=>{
              console.log(item);
              return (
                <BookIcon key={item.id} book={item} shelves={props.shelves} reshelfFunc={props.reshelfFunc} />
              );
            }
          )}
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
            if (item.value !== 'none')
            {
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

    this.reshelf = this.reshelf.bind(this);
  }

  componentDidMount() {
    console.log("BooksApp mounted!");
    
    BooksAPI.getAll().then((res)=>{
        console.log(res);
        this.setState({library: res});
      }).then(()=>console.log(this.state.library)).catch(e=>console.log(e));
  }

  reshelf(book, shelf) {
    if (shelf !== 'none') {
      BooksAPI.update(book, shelf).then(
        ()=>
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
            ),
        e=>console.log(e)
      );
    }
  }

  render() {
    return (
      <div className="app">
        <Route exact path='/' render={()=>(<Bookcase shelves={shelvesGlobal} library={this.state.library} reshelfFunc={this.reshelf} />)} />
        <Route path='/search' render={()=>(<Bookfinder />)} />
      </div>
    );
  }
}


export default BooksApp
