import { Link } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import {Skeleton } from "../component/Loader";

const Home = () => {
  const { data,isLoading,isError} = useLatestProductsQuery("");
  const addToCartHandler = () => {};
  if(isError){
    toast.error("Cannot fetch the products");
  }
  return (  
    <div className="home">
      <section></section>
      <h1>Latest Products <Link className="findmore" to={"/search"}>More</Link></h1>
      <main>
        {isLoading ? (<Skeleton width="80vw"/> ) : (
          data?.products.map((product) => (
          <ProductCard
            key={product._id}
            productId={product._id}
            name={product.name}
            price={product.price}
            stock={product.stock}
            handler={addToCartHandler}
            photo={product.photo}
          />
        ))
      )}
      </main>
    </div>
  );
};

export default Home;
