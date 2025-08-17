import { useParams } from "next/navigation";

export default function ProductDetail() {
  const params = useParams();
  return (
    <main>
      <h1>Product Detail</h1>
      <p>Product ID: {params?.id}</p>
    </main>
  );
}
