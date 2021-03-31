import React from 'react';
import { Form, Button, FormGroup, FormControl, ControlLabel, Row } from "react-bootstrap";


function topFunction() {        //make button click go back to top of the page
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

export default function Pagination ({ paginate,number,count}){
  const pageNumbers = [];

  for (let i = number-10; i <= number+10; i++) {
    if(i>0&&i<=count) //we get max number of pages from backend
    {
    pageNumbers.push(i);
    }
  
  }
  return (
    <div>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <button onClick={topFunction(),() => paginate(number)} className='page-link' style ={{backgroundColor: "#FF69B4", color:"black" }}>    
              {number}
            </button>
          </li>
        ))}
      </ul>
      </div>

  );
};
