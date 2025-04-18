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
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
  };
  
  const logOut = async () => {
    const response = await axiosInstance.get(`/auth/logout`, { withCredentials: true });
    if (response.status === 200) {
      dispatch(setUserInfo(undefined));
      navigate("/");
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
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/delete`, {
        withCredentials: true,
        data: { image, type: "profile" },
      });

      if (response.status === 200) {
        dispatch(setUserInfo({ ...userinfo, image: null }));
        setImage(null);
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
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
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
            />
          </div>
        </div>

=
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {['username', 'firstName', 'lastName', 'city', 'country', 'email'].map((field, index) => (
            <div key={index}>
              <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input 
                name={field} 
                value={profileData[field]} 
                onChange={handleFieldChange} 
                disabled={field === 'email'}
              />
              {errors[field] && <div className="text-red-500 text-sm">{errors[field]}</div>}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-3">
          <Button 
            className="bg-blue-500 text-white px-3 py-1 text-sm" 
            onClick={handleSave} 
            disabled={loading}>
           {loading ? ( <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
              />
            </svg>) : "Save"}
          </Button>
          <Button 
            className="bg-red-500 text-white px-3 py-1 text-sm" 
            variant="destructive" 
            onClick={logOut}>
            Logout
          </Button>
        </div>

        <ToastContainer />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
