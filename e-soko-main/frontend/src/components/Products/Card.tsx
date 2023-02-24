import Product from "./Product";

export default function Card() {
    const content = data.map(item => {
        return (
            <Product
                //spread data here
            />
        )
    })
    return (
        <>
            {content}
        </>
    )
}