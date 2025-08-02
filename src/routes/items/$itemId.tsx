import { queryOptions, useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

const itemQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: () =>
    fetch(`http://localhost:8080/api/items/${params.itemId}`).then((res) =>
      res.json()
    ),
});

export const Route = createFileRoute("/items/$itemId")({
  loader: ({ params, context: { queryClient } }) =>
    queryClient.ensureQueryData(itemQueryOptions),
  component: ItemDetail,
});

function ItemDetail() {
  const { itemId } = Route.useParams();
  const { data } = useSuspenseQueries(itemQueryOptions);

  return (
    <div>
      <h4>{item.name}</h4>
      <p>値段：{item.price}</p>
      <img src={item.image} alt="画像" />
      <Link to="/">一覧へ</Link>
    </div>
  );
}
