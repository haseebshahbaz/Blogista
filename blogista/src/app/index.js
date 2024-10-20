import Link from "next/link";

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await response.json();
      setBlogs(data.slice(0, 10)); // First 10 blogs
    };

    fetchBlogs();
  }, []);

  return (
    <div className="blog-list">
      <h1>Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog.id} className="blog-card">
          <h2>{blog.title}</h2>
          <p>{blog.body}</p>
          <Link href={`/blogs/${blog.id}`}>
            <a>Read More</a>
          </Link>
        </div>
      ))}
    </div>
  );
}
