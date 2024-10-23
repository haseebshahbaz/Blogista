// 'use client';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../../firbase/firbase.js';
// import { FaFacebook, FaTwitter, FaBookmark, FaHeart } from 'react-icons/fa';

// export default function BlogPost() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const id = pathname.split('/').pop(); // Get blog ID from the URL path

//   const [blog, setBlog] = useState({categories: [],});
//   const [relatedPosts, setRelatedPosts] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch the blog post data by ID
//   const fetchBlog = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const docRef = doc(db, 'blogs', id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setBlog(docSnap.data());
//         fetchRelatedPosts(docSnap.data().categories); // Fetch related posts based on categories
//       } else {
//         setError('Blog post not found');
//       }
//     } catch (error) {
//       setError('Error fetching blog post');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch related posts based on categories or tags
//   const fetchRelatedPosts = async (categories) => {
//     try {
//       const q = query(
//         collection(db, 'blogs'),
//         where('categories', 'array-contains-any', categories)
//       );
//       const querySnapshot = await getDocs(q);
//       const postsArray = [];
//       querySnapshot.forEach((doc) => {
//         if (doc.id !== id) {
//           postsArray.push({ id: doc.id, ...doc.data() });
//         }
//       });
//       setRelatedPosts(postsArray);
//     } catch (error) {
//       console.error('Error fetching related posts:', error);
//     }
//   };

//   // Fetch comments (This would ideally be from a separate collection)
//   const fetchComments = async () => {
//     // Placeholder function
//     setComments([
//       { id: 1, author: 'John Doe', content: 'Great post!' },
//       { id: 2, author: 'Jane Smith', content: 'Thanks for the insights!' },
//     ]);
//   };

//   // Handle adding a comment
//   const handleAddComment = () => {
//     if (!newComment) return;
//     setComments([...comments, { id: comments.length + 1, author: 'Anonymous', content: newComment }]);
//     setNewComment('');
//   };

//   useEffect(() => {
//     fetchBlog();
//     fetchComments();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-5">
//       {/* Blog Title, Image, and Content */}
//       {blog && (
//         <>
//           <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
//           <p className="text-gray-500 mb-4">By {blog.author} | {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
//           {blog.imageUrl && (
//             <img src={blog.imageUrl} alt={blog.title} className="w-full h-96 object-cover rounded-lg mb-4" />
//           )}
//           <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />

//           {/* Categories and Tags */}
//           <div className="flex flex-wrap gap-2 mb-8">
//             {blog.categories.map((category, index) => (
//               <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
//                 {category}
//               </span>
//             ))}
//             {blog.tags.map((tag, index) => (
//               <span key={index} className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">
//                 #{tag}
//               </span>
//             ))}
//           </div>

//           {/* Social Share & Bookmark/Like Buttons */}
//           <div className="flex items-center gap-4 mb-8">
//             <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
//               <FaFacebook /> Share on Facebook
//             </button>
//             <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
//               <FaTwitter /> Share on Twitter
//             </button>
//             <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
//               <FaBookmark /> Bookmark
//             </button>
//             <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
//               <FaHeart /> Like
//             </button>
//           </div>

//           {/* Comments Section */}
//           <div className="mt-10">
//             <h2 className="text-2xl font-bold mb-4">Comments</h2>
//             <div className="space-y-4">
//               {comments.map((comment) => (
//                 <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
//                   <p className="text-sm font-semibold">{comment.author}</p>
//                   <p>{comment.content}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Add Comment Form */}
//             <div className="mt-6">
//               <textarea
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 rows="4"
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder="Add a comment"
//               />
//               <button
//                 className="bg-blue-500 text-white py-2 px-4 mt-3 rounded-lg"
//                 onClick={handleAddComment}
//               >
//                 Post Comment
//               </button>
//             </div>
//           </div>

//           {/* Related Posts */}
//           <div className="mt-10">
//             <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {relatedPosts.map((post) => (
//                 <a key={post.id} href={`/blog/${post.id}`} className="block bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
//                   <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
//                   <p className="text-gray-500">{truncateContent(post.content, 100)}</p>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // Truncate function for showing excerpts of related posts
// function truncateContent(content, maxLength) {
//   if (content.length > maxLength) {
//     return content.substring(0, maxLength) + '...';
//   }
//   return content;
// }
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use `useParams` for App Router in Next.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firbase/firbase.js'; // Adjust based on your setup
import Loader from '@/app/components/Loader.js';
import Navbar from '@/app/components/Navbar.js';

const BlogDetailPage = () => {
  const { id } = useParams(); // Get the dynamic id from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const blogRef = doc(db, 'blogs', id); // Get blog document reference from Firestore
      const blogDoc = await getDoc(blogRef);

      if (blogDoc.exists()) {
        setBlog(blogDoc.data());
      } else {
        console.log('No such blog!');
      }
      setLoading(false);
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!blog) {
    return <p className="text-center">Blog not found!</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg mb-6 shadow-md"
          />
        )}
        {/* Render the content safely using dangerouslySetInnerHTML */}
        <div
          className="text-lg leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: blog.content }} // Render HTML content
        />
        <div className="text-sm text-gray-500 mt-4">
          <p>Author: {blog.author || 'Admin'}</p>
          <p>Published on: {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
