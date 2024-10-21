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
  const [newUserDetails, setNewUserDetails] = useState({
    email: "",
    name: "",
    fatherName: "",
    role: "",
  });
  const [editingUserId, setEditingUserId] = useState(null); // For editing users

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
      const imageRef = ref(storage, `users/${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      setLoading(false); // Stop loading after upload is complete
      setUploadMessage("Image uploaded successfully!"); // Set upload success message
      setTimeout(() => setUploadMessage(""), 10000); // Remove message after 10 seconds
      return true;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image.");
      setLoading(false); // Stop loading on error
      return false;
    }
  };

  const handleAddOrUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!newUserDetails.email || !newUserDetails.name || !newUserDetails.fatherName || !newUserDetails.role || !imageUrl) {
      setError("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true); // Show loading during user addition
    setError("");

    try {
      if (editingUserId) {
        await updateDoc(doc(db, "users", editingUserId), {
          ...newUserDetails,
          imageUrl,
          updatedAt: new Date(),
        });
        setEditingUserId(null);
      } else {
        await addDoc(collection(db, "users"), {
          ...newUserDetails,
          imageUrl,
          createdAt: new Date(),
        });
      }

      // Clear the form fields
      setNewUserDetails({
        email: "",
        name: "",
        fatherName: "",
        role: "",
      });
      setImage(null);
      setImageUrl("");
      fetchBlogsAndUsers();
    } catch (error) {
      console.error("Error adding/updating user: ", error);
      setError("Failed to add/update user.");
    }
    setLoading(false);
  };

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setNewUserDetails({
      email: user.email,
      name: user.name,
      fatherName: user.fatherName,
      role: user.role,
    });
    setImageUrl(user.imageUrl); // Set the current image URL for editing
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", id));
      fetchBlogsAndUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
    setLoading(false);
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

  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
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
                <div className="bg-white p-4 rounded shadow-md">
                  <h3 className="text-xl font-bold mb-3">User Stats</h3>
                  <p>Total Blogs: {blogs.length}</p>
                  <p>Total Users: {users.length}</p>
                </div>
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
                    className="w-full p-2 border rounded mb-2"
                  />
                  <Editor
                    initialValue={content}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: ["lists link image code"],
                      toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code",
                    }}
                    onEditorChange={(newContent) => setContent(newContent)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="mt-2 mb-2"
                  />
                  <button type="button" onClick={handleImageUpload} className="bg-blue-500 text-white p-2 rounded">
                    Upload Image
                  </button>
                  <span className="text-green-500">{uploadMessage}</span>
                  <button type="submit" className="bg-green-500 text-white p-2 rounded mt-3">
                    {editingBlogId ? "Update Blog" : "Add Blog"}
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>

                <h3 className="text-xl font-bold mb-3">Existing Blogs</h3>
                {blogs.length > 0 ? (
                  <div className="bg-white p-4 rounded shadow-md">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="border-b mb-2 pb-2">
                        <h4 className="font-bold">{blog.title}</h4>
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover rounded mb-2" />
                        <p>{truncateContent(blog.content, 100)}</p>
                        <button onClick={() => handleEditBlog(blog)} className="text-blue-500">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBlog(blog.id)} className="text-red-500 ml-2">
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No blogs available.</p>
                )}
              </div>
            )}

            {/* Manage Users */}
            {section === "manageUsers" && (
              <div>
                <h2 className="text-2xl font-bold mb-5">Manage Users</h2>
                <form onSubmit={handleAddOrUpdateUser} className="mb-5 bg-white p-4 rounded shadow-md">
                  <input
                    type="email"
                    placeholder="User Email"
                    value={newUserDetails.email}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, email: e.target.value })}
                    required
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="User Name"
                    value={newUserDetails.name}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, name: e.target.value })}
                    required
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Father's Name"
                    value={newUserDetails.fatherName}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, fatherName: e.target.value })}
                    required
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={newUserDetails.role}
                    onChange={(e) => setNewUserDetails({ ...newUserDetails, role: e.target.value })}
                    required
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="mt-2 mb-2"
                  />
                  <button type="button" onClick={handleImageUpload} className="bg-blue-500 text-white p-2 rounded">
                    Upload Image
                  </button>
                  <span className="text-green-500">{uploadMessage}</span>
                  <button type="submit" className="bg-green-500 text-white p-2 rounded mt-3">
                    {editingUserId ? "Update User" : "Add User"}
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>

                <h3 className="text-xl font-bold mb-3">Existing Users</h3>
                {users.length > 0 ? (
                  <div className="bg-white p-4 rounded shadow-md">
                    {users.map((user) => (
                      <div key={user.id} className="border-b mb-2 pb-2">
                        <h4 className="font-bold">{user.name} - {user.role}</h4>
                        <img src={user.imageUrl} alt={user.name} className="w-24 h-24 object-cover rounded mb-2" />
                        <button onClick={() => handleEditUser(user)} className="text-blue-500">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 ml-2">
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No users available.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
