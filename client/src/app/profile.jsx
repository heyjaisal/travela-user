import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../utils/axios-instance";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "@/redux/slice/auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScaleLoader } from "react-spinners";

const ProfileDialog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.auth.userInfo);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(userinfo?.image || null);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
    const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    city: "",
    country: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/auth/profile`, { withCredentials: true });
        setProfileData(response.data);
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };
    fetchData();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    let tempErrors = {};

    if (!profileData.firstName) tempErrors.firstName = "First name is required";
    if (!profileData.lastName) tempErrors.lastName = "Last name is required";
    if (!profileData.username) tempErrors.username = "Username is required";
    if (!profileData.country) tempErrors.country = "Country is required";
    if (!profileData.city) tempErrors.city = "City is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateFields()) {
      try {
        const { data } = await axiosInstance.put(
          `/auth/profile`,
          profileData,
          { withCredentials: true }
        );
        dispatch(setUserInfo(data.user));
        toast.success("Profile details submitted successfully!");
      } catch (error) {
        toast.error("Failed to update profile");
      }
    }
  };
  
  const logOut = async () => {
    const response = await axiosInstance.get(`/auth/logout`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      dispatch(setUserInfo(undefined));
      navigate("/login");
    }
  };

  const handleImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "profile");

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.status === 200) {
        const imageUrl = response.data.imageUrl;
        dispatch(setUserInfo({ ...userinfo, image: imageUrl }));
        setImage(imageUrl);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/delete`, {
        withCredentials: true,
        data: {
          image: image,
          type: "profile",
        },
      });

      if (response.status === 200) {
        dispatch(setUserInfo({ ...userinfo, image: null }));
        setImage(null);
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full px-4 py-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">Edit Profile</DialogTitle>
        </DialogHeader>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full border flex items-center justify-center bg-gray-200"
               onMouseEnter={() => setHovered(true)}
               onMouseLeave={() => setHovered(false)}>
            <Avatar className="w-24 h-24 rounded-full">
              {image ? <AvatarImage src={image} alt="profile" className="object-cover w-full h-full" /> :
                <div className="flex items-center justify-center w-full h-full text-5xl font-bold">
                  {profileData.firstName?.charAt(0)}
                </div>}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                   onClick={image ? deleteImage : () => fileInputRef.current.click()}>
                {image ? <FaTrash className="text-white text-3xl" /> : <FaPlus className="text-white text-3xl" />}
              </div>
            )}
            <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImage}
                  name="profile-image"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                />
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div>
            <Label>Username</Label>
            <Input name="username" value={profileData.username} onChange={handleFieldChange} />
          </div>

          <div>
            <Label>First Name</Label>
            <Input name="firstName" value={profileData.firstName} onChange={handleFieldChange} />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input name="lastName" value={profileData.lastName} onChange={handleFieldChange} />
          </div>

          <div>
            <Label>City</Label>
            <Input name="city" value={profileData.city} onChange={handleFieldChange} />
          </div>

          <div>
            <Label>Country</Label>
            <Input name="country" value={profileData.country} onChange={handleFieldChange} />
          </div>

          <div>
            <Label>Email</Label>
            <Input name="email" value={profileData.email} disabled className="bg-gray-100 cursor-not-allowed" />
          </div>
        </div>

<div className="flex justify-end space-x-2 mt-6">
  <Button className="bg-blue-500 text-white px-3 py-1 text-sm">Save</Button>
  <Button className="bg-red-500 text-white px-3 py-1 text-sm" variant="destructive">Logout</Button>
</div>

        
        <ToastContainer />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;