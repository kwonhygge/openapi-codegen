import { useQuery } from "@tanstack/react-query";
import { request } from "@/http/request";

export default function List() {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await request.get(
        "https://jsonplaceholder.typicode.com/users",
      );

      return data;
    },
  });

  return (
    <ul>
      <li>John Doe</li>
      <li>Jane Doe</li>
      <li>John Smith</li>
    </ul>
  );
}
