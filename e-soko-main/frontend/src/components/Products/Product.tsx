import React from "react"

import "./category.css"

export default function Product() {
    // const  [squares, setSquares] = React.useState()//pass product data in the parentheses
    // const squareElements = squares.map(square=> ())

    return (
      <>
        <div className="p--box">
            <img src="./components/Products/food.png" alt="food" className="p--image" />
            <p className="p--name">Product Name</p>
        </div>
      </>  
    )
}