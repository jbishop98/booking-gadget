// app/routes/products/$handle.jsx
import { useState } from "react";
import BookingWidget from "~/components/BookingWidget";
// app/routes/products/$handle.jsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";
import { storefrontQuery } from "~/utils/shopify";

export default function ProductPage() {
  const { product, unavailableDates } = useLoaderData();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Get variant ID if available, otherwise use product ID
  const productId = product.variants.edges.length > 0
    ? product.variants.edges[0].node.id
    : product.id;

  const handleAddToCart = async () => {
    if (!selectedDate) {
      alert("Please select a booking date.");
      return;
    }

    setIsAdding(true);

    const response = await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            id: productId,
            quantity: 1,
            properties: {
              booking_date: selectedDate.toISOString().split("T")[0],
            },
          },
        ],
      }),
    });

    if (response.ok) {
      alert("Added to cart!");
    } else {
      alert("Failed to add to cart.");
    }

    setIsAdding(false);
  };

  return (
    <div>
      <h1>{product.title}</h1>
      <BookingWidget
        unavailableDates={unavailableDates}
        onDateSelect={setSelectedDate}
      />
      <button onClick={handleAddToCart} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}



export const loader = async ({ params }) => {
  const { handle } = params;

  const query = gql`
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
        metafield(namespace: "booking", key: "unavailable_dates") {
          value
        }
      }
    }
  `;

  const data = await storefrontQuery(query, { handle });

  const product = data.productByHandle;
  const unavailableDates = product?.metafield?.value
    ? JSON.parse(product.metafield.value)
    : [];

  return json({ product, unavailableDates });
};

