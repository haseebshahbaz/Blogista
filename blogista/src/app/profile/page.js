'use client';

import { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firbase/firbase.js'; // Adjust imports
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null); // For uploading new picture
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        setUser(user);
        setName(user.displayName || '');
        setProfilePicture(user.photoURL || '/default-avatar.png');

        // Fetch recent posts from Firestore
        const postsQuery = query(collection(firestore, 'posts'), where('userId', '==', user.uid));
        const postSnapshots = await getDocs(postsQuery);
        const posts = postSnapshots.docs.map(doc => doc.data());
        setRecentPosts(posts);
      }
    };
    fetchUserProfile();
  }, []);

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    let updatedPhotoURL = profilePicture;

    // Update profile picture if new one is selected
    if (newProfilePicture) {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, newProfilePicture);
      updatedPhotoURL = await getDownloadURL(storageRef);
    }

    // Update Firebase Auth and Firestore with new profile data
    await updateProfile(user, {
      displayName: name,
      photoURL: updatedPhotoURL,
    });

    const userDoc = doc(firestore, 'users', user.uid);
    await updateDoc(userDoc, {
      displayName: name,
      photoURL: updatedPhotoURL,
    });

    setProfilePicture(updatedPhotoURL); // Update local state
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

      {/* Profile Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Email</label>
            <input
              type="text"
              value={user?.email || ''}
              readOnly
              className="bg-gray-100 rounded-lg p-2 mt-1 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Profile Picture Upload */}
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">Update Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Update Name */}
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">Update Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 text-right">
          <button
            onClick={handleSaveProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
        {recentPosts.length === 0 ? (
          <p className="text-gray-600">You haven't made any posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {recentPosts.map((post, index) => (
              <li key={index} className="border-b pb-2">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-600">{post.content}</p>
                <p className="text-gray-500 text-sm">Posted on {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
