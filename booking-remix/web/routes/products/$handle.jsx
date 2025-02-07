import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { storefrontQuery } from "~/utils/shopify";

export const loader = async ({ params }) => {
  const handle = params.handle;

  const query = gql`
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        metafield(namespace: "booking", key: "unavailable_dates") {
          value
        }
      }
    }
  `;

  const data = await storefrontQuery(query, { handle });

  // Parse the unavailable dates if they exist
  const unavailableDates = data.productByHandle?.metafield?.value
    ? JSON.parse(data.productByHandle.metafield.value)
    : [];

  return json({ product: data.productByHandle, unavailableDates });
};

export default function ProductPage() {
  const { product, unavailableDates } = useLoaderData();
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div>
      <h1>{product.title}</h1>
      <BookingWidget
        unavailableDates={unavailableDates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}
