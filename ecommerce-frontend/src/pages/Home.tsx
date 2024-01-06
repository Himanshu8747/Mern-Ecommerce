import { Link } from "react-router-dom"
import ProductCard from "../component/ProductCard"

const Home = () => {
  const addToCartHandler=()=>{}
  return (
    <div className="home">
      <section></section>
      <h1>Latest Products <Link className="findmore" to={"/search"}>More</Link></h1>
      <main>
        <ProductCard productId="sdfgs" name="MacVook" price={876876} stock={21121} handler={addToCartHandler} photo="https://m.media-amazon.com/images/I/71TPda7cwUL._SX522_.jpg" />
      </main>
    </div>
  )
}

export default Home