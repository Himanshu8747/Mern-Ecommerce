import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy,Suspense } from "react";
const  Home = lazy(()=>import( "./pages/Home"));
const  Search =  lazy(()=>import("./pages/Search"));
const  Cart =  lazy(()=>import("./pages/Cart"));
import Loader from "./component/loader";
const App = () => {
  return (
    <Router>
      {/* Header Component */}
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path='/cart' element={<Cart/>}/>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App