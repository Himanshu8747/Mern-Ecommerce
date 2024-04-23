import { useState } from "react"
import ProductCard from "../component/ProductCard";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productApi";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../component/Loader";
import { useDispatch } from "react-redux";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";

const Search = () => {

  const {data:categoriesResponse,isLoading:loadingCategories,isError:searchedProductHasError,error:searchedProductError} = useCategoriesQuery("");
  
  const[search,setSearch] = useState("");
  const[sort,setSort] = useState("");
  const[maxPrice,setMaxPrice]=useState(100000);
  const[category,setCategory] = useState("");
  const[page,setPage] = useState(1);

  const {isLoading:productLoading,data:searchedData,isError,error} = useSearchProductsQuery({search,sort,category,page,price:maxPrice})

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };
  const isNextPage = page < 4 ;
  const isPrevPage = page > 1;

  if(isError){
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if(searchedProductHasError){
    const err = searchedProductError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (Hign to low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input min={100} max={100000} type="range" value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))}/>
        </div>
        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="">All</option>
            {!loadingCategories && categoriesResponse?.categories.map((i)=>(
              <option key={i} value={i}>{i.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div></div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" placeholder="Search by name..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
        {productLoading ? <Skeleton length={10}/> : (
          <div className="search-product-list">
          {searchedData?.products.map(i=>(
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              photo={i.photo}
              handler={addToCartHandler}
            />
          ))}
        </div>
        )}
          {searchedData && searchedData.totalPage > 1 && (
             <article>
             <button disabled={!isPrevPage} onClick={()=>setPage(prev=>prev-1)}>Prev</button>
             <span>{page} of {searchedData.totalPage}</span>
             <button disabled={!isNextPage} onClick={()=>setPage(prev=>prev+1)}>Next</button>
           </article>
          )} 
      </main>
    </div>
  )
}

export default Search