import { Navbar } from "./components";
import Category from "./components/Products/Category"
import { useEffect } from "react";

import './App.scss';

function App() {
  useEffect(() => {
    
  }, [])
  
  return (
    <div className='app'>
      <Navbar />
      <Category />
    </div>
  );
}

export default App;
