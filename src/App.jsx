import "./App.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const POSTS = [
  {
    id: 1,
    title: "POST 1",
  },
  {
    id: 2,
    title: "POST 2",
  },
];

function App() {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    //always takes an array - unique identifier for query
    queryKey: ["posts"],
    //always takes a promise
    queryFn: () => wait(1000).then(() => [...POSTS]),

    //for testing errors - react query will auto retry on failure
    //queryFn: () => Promise.reject("Error!")
  });

  const newPostMutation = useMutation({
    mutationFn: (title) =>
      wait(1000).then(() => {
        POSTS.push({ id: Math.random(), title });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (postsQuery.isLoading) return <h1>loading...</h1>;
  if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>;
  return (
    <div>
      {postsQuery.data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}

      <button
        disabled={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate("New Post")}
      >
        Add new
      </button>
    </div>
  );
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
