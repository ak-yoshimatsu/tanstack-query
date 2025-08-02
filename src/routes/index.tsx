import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  content: string;
  image: string;
  createdAt: string; // ISO 文字列（例: "2025-08-03 06:29:07"）
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

/**
 * ページネーション付き API レスポンス全体のスキーマ。
 * T は各アイテムの型（例：Product）。
 */
interface PaginatedResponse<T> {
  currentPage: number;
  data: T[];
  firstPageUrl: string | null;
  from: number | null;
  lastPage: number;
  lastPageUrl: string | null;
  links: Array<PaginationLink>;
  nextPageUrl: string | null;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number | null;
  total: number;
}

/**
 * ページネーションの link オブジェクト
 */
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

type ProductListResponse = PaginatedResponse<Product>;

const fetchPost = async (): Promise<ProductListResponse> => {
  const res = await fetch("http://localhost:8080/api/items?limit=20&page=1");
  return await res.json();
};

const itemsQueryOptions = queryOptions({
  queryKey: ["items"],
  queryFn: () => fetchPost(),
});

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(itemsQueryOptions),
  component: Index,
});

function ItemList() {
  const { data } = useSuspenseQuery(itemsQueryOptions);

  return (
    <ul>
      {data.data.map((item) => (
        <li key={item.id}>
          <div>
            <h4>{item.name}</h4>
            <p>値段：{item.price}</p>
            <img src={item.image} alt="画像" />
            <Link to="/items/$itemId" params={{ itemId: String(item.id) }}>
              詳細へ
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>

      <Suspense fallback={<div>loading...</div>}>
        <ItemList />
      </Suspense>
    </div>
  );
}
