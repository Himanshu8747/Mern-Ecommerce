import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";

type ProductsProps = {
    productId:string;
    photo:string;
    name:string;
    price:number;
    stock:number;
    handler:()=>void;
}


const ProductCard = ({productId,price,photo,name,stock,handler}:ProductsProps) => {
  return (
    <div className="productcard">
        <img src={`${server}/${photo}`} alt={name}></img>
        <p>{name}</p>
        <span>{price}</span>
        <div>
            <button onClick={()=>handler()}><FaPlus/></button>
        </div>
    </div>
  )
}

export default ProductCard