'use client'; // Ensure this is the first line in your file

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation purposes
import { auth, db, storage } from '../firbase/firbase.js'; // Adjust the path
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader'; // Import the Loader component

const ProfilePage = () => {
  const [user, setUser] = useState(null); // Authenticated user state
  const [name, setName] = useState(''); // User's name state
  const [fathersName, setFathersName] = useState(''); // Father's name state
  const [profilePicture, setProfilePicture] = useState('/default-avatar.png'); // Profile picture state
  const [newProfilePicture, setNewProfilePicture] = useState(null); // New profile picture
  const [isSaving, setIsSaving] = useState(false); // Saving state
  const [isEditing, setIsEditing] = useState(false); // Editing mode state
  const [message, setMessage] = useState(''); // Message state for success/error
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is authenticated, now query Firestore for their profile data
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]; // Get the first document that matches the query
          const userData = userDoc.data();

          // Set user data
          setUser(currentUser);
          setName(userData.name || '');
          setFathersName(userData.fatherName || '');
          setProfilePicture(userData.photoURL || '/default-avatar.png');

          try {
            const profilePicRef = ref(storage, `profilePictures/${currentUser.uid}`);
            const picUrl = await getDownloadURL(profilePicRef);
            setProfilePicture(picUrl); // If profile picture is found in storage
          } catch (error) {
            console.log('Error fetching profile picture:', error);
          }
        } else {
          console.log('No user document found for the authenticated user');
        }
      } else {
        console.log('No authenticated user found');
        router.push('/login'); // Redirect to login if no user is authenticated
      }
      setLoading(false); // Stop loading after data fetching
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [router]);

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]); // Set new profile picture
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Cancel editing mode
    setNewProfilePicture(null); // Reset new profile picture
    setMessage(''); // Reset message
  };

  const handleSaveProfile = async () => {
    setIsSaving(true); // Start saving process
    setMessage(''); // Reset message

    const currentUser = auth.currentUser;
    let updatedPhotoURL = profilePicture;

    try {
      if (newProfilePicture) {
        const profilePicRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await deleteObject(profilePicRef).catch(() => console.log('No old picture to delete'));
        await uploadBytes(profilePicRef, newProfilePicture);
        updatedPhotoURL = await getDownloadURL(profilePicRef); // Upload and get new profile picture URL
      }

      await updateProfile(currentUser, {
        displayName: name,
        photoURL: updatedPhotoURL,
      });

      // Update Firestore document with new profile data
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const userDocRef = querySnapshot.docs[0].ref;

      await updateDoc(userDocRef, {
        name,
        fatherName: fathersName,
        photoURL: updatedPhotoURL,
      });

      setProfilePicture(updatedPhotoURL); // Update the profile picture in state
      setIsEditing(false); // Disable editing mode
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false); // End saving process
    }
  };

  if (loading) {
    return <Loader />; // Show the loader while data is being fetched
  }

  return (
    <div>
      <Navbar /> {/* Include Navbar */}

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-center mb-6">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <div className="w-32 h-32 bg-gray-300 rounded-full" />
            )}
          </div>

          {isEditing ? (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold">Change Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="mt-2 p-2 border rounded-lg"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 p-2 border rounded-lg w-full"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold">Father's Name</label>
                <input
                  type="text"
                  value={fathersName}
                  onChange={(e) => setFathersName(e.target.value)}
                  className="mt-2 p-2 border rounded-lg w-full"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-700 font-semibold">Name:</p>
                <p className="mt-2 text-lg">{name}</p>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 font-semibold">Father's Name:</p>
                <p className="mt-2 text-lg">{fathersName}</p>
              </div>

              <button
                onClick={handleEditClick}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-200' : 'bg-red-200'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
