'use client';

import { useState, useEffect } from "react";
import { auth, db, storage } from "../../firbase/firbase.js"; // Ensure correct path to Firebase config
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ClipLoader } from 'react-spinners';
import { FaTachometerAlt, FaBlog, FaUsers, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { Editor } from '@tinymce/tinymce-react';
import '../../globals.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [section, setSection] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [newUserDetails, setNewUserDetails] = useState({
    email: "",
    name: "",
    fatherName: "",
    role: "user", // default role
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogImage, setBlogImage] = useState(null); // For image upload
  const [blogImageUrl, setBlogImageUrl] = useState(""); // Image URL for blogs
  const [photoURL, setPhotoURL] = useState(""); // For managing user photoURL

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchBlogsAndUsers();
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch blogs and users from Firestore
  const fetchBlogsAndUsers = async () => {
    setLoading(true);
    try {
      // Fetch blogs
      const blogsSnapshot = await getDocs(collection(db, "blogs"));
      const blogsArray = [];
      blogsSnapshot.forEach((doc) => blogsArray.push({ id: doc.id, ...doc.data() }));
      setBlogs(blogsArray);

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersArray = [];
      usersSnapshot.forEach((doc) => usersArray.push({ id: doc.id, ...doc.data() }));
      setUsers(usersArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Handle blog image upload
  const handleImageUpload = async () => {
    if (!blogImage) return null; // If no image, return null
    const imageRef = ref(storage, `blogs/${new Date().getTime()}_${blogImage.name}`);
    await uploadBytes(imageRef, blogImage);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  };

  // Handle user edit
  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setNewUserDetails({
      email: user.email,
      name: user.name,
      fatherName: user.fatherName,
      role: user.role,
    });
    setPhotoURL(user.photoURL || ""); // Set photoURL if it exists
    setTimeout(() => {
      const formElement = document.getElementById("editForm");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Delay to ensure the element exists before scrolling
  };

  // Update user details in Firestore
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUserId) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", editingUserId), {
        ...newUserDetails,
        updatedAt: new Date(),
      });
      setEditingUserId(null); // Close form after update
      fetchBlogsAndUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user: ", error);
    }
    setLoading(false);
  };

  // Cancel user edit
  const handleCancelEditUser = () => {
    setEditingUserId(null);
  };

  // Handle blog edit
  const handleEditBlog = (blog) => {
    setEditingBlogId(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    setBlogImageUrl(blog.imageUrl || "");
    setTimeout(() => {
      const formElement = document.getElementById("blogForm");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Update or add blog
  const handleAddOrUpdateBlog = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await handleImageUpload(); // Upload the image first
      const blogData = {
        title,
        content,
        imageUrl: imageUrl || blogImageUrl, // Use the new image URL or keep the existing one
        updatedAt: new Date(),
      };

      if (editingBlogId) {
        await updateDoc(doc(db, "blogs", editingBlogId), blogData);
        setEditingBlogId(null);
      } else {
        await addDoc(collection(db, "blogs"), {
          ...blogData,
          createdAt: new Date(),
        });
      }
      // Reset form
      setTitle("");
      setContent("");
      setBlogImage(null);
      setBlogImageUrl("");
      fetchBlogsAndUsers();
    } catch (error) {
      console.error("Error updating/adding blog: ", error);
    }

    setLoading(false);
  };

  // Delete blog
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

  // Strip HTML tags and return plain text
  const stripHtmlTags = (content) => {
    return content.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <div className="dashboard flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sidebar w-full md:w-1/5 lg:w-1/6 bg-gray-800 text-white p-6 shadow-md overflow-y-auto">
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
        <button onClick={() => signOut(auth)} className="mt-5 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="content w-full md:w-4/5 lg:w-5/6 p-6 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader loading={loading} size={50} />
          </div>
        ) : section === "dashboard" ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h2>
            <div className="bg-white p-6 rounded-lg shadow-md mb-5">
              <h3 className="text-xl font-bold mb-5 text-gray-800">User Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Blogs Section */}
                <div className="p-4 bg-blue-100 rounded-lg shadow-sm flex items-center">
                  <div className="p-4 rounded-full bg-blue-500 text-white mr-4">
                    {/* Blog SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6M9 9h6M9 13h4m2 4H9l-2 2v-2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Total Blogs</p>
                    <p className="text-2xl font-bold text-blue-600">{blogs.length}</p>
                  </div>
                </div>
                {/* Total Users Section */}
                <div className="p-4 bg-green-100 rounded-lg shadow-sm flex items-center">
                  <div className="p-4 rounded-full bg-green-500 text-white mr-4">
                    {/* User SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 0112 3v0a9 9 0 016.879 14.804M15 21v-1a3 3 0 00-6 0v1m9 0v-1a6 6 0 00-12 0v1m9-10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Total Users</p>
                    <p className="text-2xl font-bold text-green-600">{users.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : section === "manageBlogs" ? (
          <div>
            <h2 className="text-2xl font-bold mb-5">Manage Blogs</h2>
            {/* Blog Form */}
            <form id="blogForm" onSubmit={handleAddOrUpdateBlog} className="mb-5 bg-white p-4 rounded shadow-md">
              <input
                type="text"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border rounded mb-2"
              />
              <Editor
                apiKey="91srh7sao13jguv8yamww9uzrlqr53jfqgj1zdam2twm8tab"
                initialValue={content}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: 'link image code',
                  toolbar: 'undo redo | styleselect | bold italic | link image | code',
                }}
                onEditorChange={(newContent) => setContent(newContent)}
              />
              <input type="file" accept="image/*" onChange={(e) => setBlogImage(e.target.files[0])} className="mt-4" />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-2">
                {editingBlogId ? "Update Blog" : "Add Blog"}
              </button>
            </form>

            {/* Display Blogs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  {blog.imageUrl && (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-3">{blog.title}</h3>
                      <p className="text-gray-700 mb-4">
                        {stripHtmlTags(blog.content).substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="bg-yellow-500 text-white px-5 py-2 rounded-lg shadow hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : section === "manageUsers" ? (
          <div>
            <h2 className="text-2xl font-bold mb-5">Manage Users</h2>
            {/* User Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="bg-white shadow-md rounded-lg p-5">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                      />
                    ) : (
                      <FaUserCircle className="text-gray-400 w-24 h-24 mx-auto mb-4" />
                    )}
                    <h3 className="text-lg font-bold text-center">{user.name}</h3>
                    <p className="text-gray-600 text-center mb-4">{user.email}</p>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                    >
                      Edit
                    </button>
                  </div>
                ))
              ) : (
                <p>No users available.</p>
              )}
            </div>
            {/* Edit Form */}
            {editingUserId && (
              <div id="editForm" className="bg-white p-5 rounded-lg shadow-md mt-10">
                <h3 className="text-xl font-bold mb-4">Edit User</h3>
                <form onSubmit={handleUpdateUser}>
                  <label className="block mb-2 text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newUserDetails.name}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, name: e.target.value })}
                    required
                    className="w-full p-2 mb-4 border rounded"
                  />
                  <label className="block mb-2 text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newUserDetails.email}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, email: e.target.value })}
                    required
                    className="w-full p-2 mb-4 border rounded"
                  />
                  <label className="block mb-2 text-gray-700">Father's Name</label>
                  <input
                    type="text"
                    value={newUserDetails.fatherName}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, fatherName: e.target.value })}
                    required
                    className="w-full p-2 mb-4 border rounded"
                  />
                  <label className="block mb-2 text-gray-700">Role</label>
                  <select
                    value={newUserDetails.role}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, role: e.target.value })}
                    className="w-full p-2 mb-4 border rounded"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEditUser}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
