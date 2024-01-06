import { FaPlus } from "react-icons/fa";

type ProductsProps = {
    productId:string;
    photo:string;
    name:string;
    price:number;
    stock:number;
    handler:()=>void;
}

// const server = "sdfsdfsdf";

const ProductCard = ({productId,price,photo,name,stock,handler}:ProductsProps) => {
  return (
    <div className="productcard">
        <img src={photo} alt={name}></img>
        <p>{name}</p>
        <span>{price}</span>
        <div>
            <button onClick={()=>handler()}><FaPlus/></button>
        </div>
    </div>
  )
}

export default ProductCard