import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type CartItemProps={
    cartItem: any;
}

const CartItem = ({cartItem}:CartItemProps) => {
  return (
    <div className="cart-item">
        <img src={cartItem.photo} alt={cartItem.name}></img>
        <article>
            <Link to={`/product/${cartItem.productId}`}>{cartItem.name}</Link>
        </article>
        <span>₹{cartItem.price}</span>
        <div>
            <button>-</button>
            <p>{cartItem.quantity}</p>
            <button>+</button>
        </div>
        <button><FaTrash/></button>
    </div>
  )
}

export default CartItem