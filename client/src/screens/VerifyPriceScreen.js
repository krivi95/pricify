// ReactJS components
import React from "react";
import { useParams } from "react-router-dom";


export default function VerifyPriceScreen() {
    let { storeId, productId } = useParams();

    return (
        <div>
            <h1>VerifyPrice</h1>
            <h2>{storeId} {productId}</h2>
        </div>
    );
}
