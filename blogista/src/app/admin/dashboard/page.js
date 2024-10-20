'use client';

import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { auth, db, storage } from "../../firbase/firbase.js"; // Ensure correct path to Firebase config
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage
import { ClipLoader } from 'react-spinners';
import { FaTachometerAlt, FaBlog, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import '../../globals.css';



export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // For image upload
  const [imageUrl, setImageUrl] = useState("");
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("dashboard");
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState(""); // Message for image upload status

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchBlogsAndUsers();
      } else {
        router.push("/auth");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchBlogsAndUsers = async () => {
    setLoading(true);
    try {
      const blogsSnapshot = await getDocs(collection(db, "blogs"));
      const blogsArray = [];
      blogsSnapshot.forEach((doc) => blogsArray.push({ id: doc.id, ...doc.data() }));
      setBlogs(blogsArray);

      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersArray = [];
      usersSnapshot.forEach((doc) => usersArray.push({ id: doc.id, ...doc.data() }));
      setUsers(usersArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleImageUpload = async () => {
    if (!image) {
      setError("Please upload an image.");
      return false;
    }
    setLoading(true); // Start loading during image upload
    setUploadMessage(""); // Clear previous messages
    try {
      const imageRef = ref(storage, `blogs/${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      setLoading(false); // Stop loading after upload is complete
      setUploadMessage("Image uploaded successfully!"); // Set upload success message
      setTimeout(() => setUploadMessage(""), 10000); // Remove message after 3 seconds
      return true;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image.");
      setLoading(false); // Stop loading on error
      return false;
    }
  };

  const handleAddOrUpdateBlog = async (e) => {
    e.preventDefault();
    
    if (!imageUrl) {
      setError("Please upload an image before submitting.");
      return;
    }

    setLoading(true); // Show loading during blog addition
    setError("");

    try {
      if (editingBlogId) {
        await updateDoc(doc(db, "blogs", editingBlogId), {
          title,
          content,
          imageUrl,
          updatedAt: new Date(),
        });
        setEditingBlogId(null);
      } else {
        await addDoc(collection(db, "blogs"), {
          title,
          content,
          imageUrl,
          createdAt: new Date(),
        });
      }

      // Clear the editor and reset other fields
      setTitle("");
      setContent("");
      setImage(null);
      setImageUrl("");
      fetchBlogsAndUsers();
    } catch (error) {
      console.error("Error adding/updating blog: ", error);
      setError("Failed to add/update blog.");
    }
    setLoading(false);
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    setImageUrl(blog.imageUrl);
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "blogs", id));
      fetchBlogsAndUsers();
    } catch (error) {
      console.error("Error deleting blog: ", error);
    }
    setLoading(false);
  };

  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    // Implement your logic for adding a user
  };

  return (
    <div className="dashboard flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sidebar w-full md:w-1/5 lg:w-1/6 bg-gray-800 text-white p-6 shadow-md">
        <h2 className="text-xl font-bold mb-5 text-center">Admin Dashboard</h2>
        <ul className="space-y-2">
          <li
            className={`cursor-pointer flex items-center p-3 rounded hover:bg-gray-700 ${section === "dashboard" ? "bg-gray-700" : ""}`}
            onClick={() => setSection("dashboard")}
          >
            <FaTachometerAlt className="mr-2" /> Dashboard
          </li>
          <li
            className={`cursor-pointer flex items-center p-3 rounded hover:bg-gray-700 ${section === "manageBlogs" ? "bg-gray-700" : ""}`}
            onClick={() => setSection("manageBlogs")}
          >
            <FaBlog className="mr-2" /> Manage Blogs
          </li>
          <li
            className={`cursor-pointer flex items-center p-3 rounded hover:bg-gray-700 ${section === "manageUsers" ? "bg-gray-700" : ""}`}
            onClick={() => setSection("manageUsers")}
          >
            <FaUsers className="mr-2" /> Manage Users
          </li>
        </ul>
        <button onClick={() => signOut(auth)} className="mt-5 flex items-center justify-center bg-red-500 p-2 rounded w-full">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

      {/* Main content */}
      <div className="content w-full md:w-4/5 lg:w-5/6 p-5">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader size={50} color="#007bff" />
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {section === "dashboard" && (
              <div>
                <h2 className="text-2xl font-bold mb-5">Welcome, {user?.email}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <div className="bg-blue-500 p-4 rounded text-white text-center shadow-lg">
                    <h3>Total Blogs</h3>
                    <p>{blogs.length}</p>
                  </div>
                  <div className="bg-green-500 p-4 rounded text-white text-center shadow-lg">
                    <h3>Total Users</h3>
                    <p>{users.length}</p>
                  </div>
                </div>
                <p className="mb-5">Here’s an overview of the site stats and activities.</p>
              </div>
            )}

            {/* Manage Blogs */}
            {section === "manageBlogs" && (
              <div>
                <h2 className="text-2xl font-bold mb-5">Manage Blogs</h2>
                <form onSubmit={handleAddOrUpdateBlog} className="mb-5 bg-white p-4 rounded shadow-md">
                  <input
                    type="text"
                    placeholder="Blog Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="p-2 mb-3 w-full border border-gray-300 rounded"
                  />
                  <Editor
                    apiKey="91srh7sao13jguv8yamww9uzrlqr53jfqgj1zdam2twm8tab" // Replace with your TinyMCE API key
                    value={content}
                    onEditorChange={(newContent) => setContent(newContent)}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                    }}
                  />
                  <div className="my-3">
                    <label htmlFor="image" className="block mb-1">Blog Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="p-2 border border-gray-300 rounded w-full"
                    />
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={!image} // Disable button if no image is selected
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Upload Image
                    </button>
                    {uploadMessage && <p className="text-green-500">{uploadMessage}</p>}
                  </div>

                  {error && <p className="text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={!title || !content || !imageUrl} // Button is disabled if fields are incomplete
                    className="px-4 py-2 bg-green-500 text-white rounded mt-3"
                  >
                    {editingBlogId ? "Update Blog" : "Add Blog"}
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="bg-white p-4 rounded shadow-md">
                      <h3 className="text-lg font-bold">{blog.title}</h3>
                      <img src={blog.imageUrl} alt={blog.title} className="my-3 w-full h-40 object-cover rounded" />
                      <p>{truncateContent(blog.content, 100)}</p>
                      <div className="flex justify-between mt-3 gap-2">
                        <button onClick={() => handleEditBlog(blog)} className="px-3 py-1 bg-yellow-500 text-white rounded">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBlog(blog.id)} className="px-3 py-1 bg-red-500 text-white rounded">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manage Users */}
            {section === "manageUsers" && (
              <div>
                <h2 className="text-2xl font-bold mb-5">Manage Users</h2>
                {/* Add user form */}
                <form onSubmit={handleAddUser} className="mb-5 bg-white p-4 rounded shadow-md">
                  <input
                    type="text"
                    placeholder="User Email"
                    required
                    className="p-2 mb-3 w-full border border-gray-300 rounded"
                  />
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Add User
                  </button>
                </form>

                {/* Displaying users */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((user) => (
                    <div key={user.id} className="bg-white p-4 rounded shadow-md">
                      <h3 className="text-lg font-bold">{user.email}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
