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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
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

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!dialogOpen) return; // fetch only when dialog opens

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/auth/profile`, {
          withCredentials: true,
        });
        setProfileData(response.data);
        setImage(response.data.image || null);
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };

    fetchData();
  }, [dialogOpen]);

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
    if (!validateFields()) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`/auth/profile`, profileData, {
        withCredentials: true,
      });
      dispatch(setUserInfo(data.user));
      toast.success("Profile details submitted successfully!");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      const response = await axiosInstance.get(`/auth/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        dispatch(setUserInfo(undefined));
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed");
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
    <>
      {/* Disable background interaction when dialog is open */}
      <div inert={dialogOpen ? "" : undefined}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Profile</Button>
          </DialogTrigger>

          <DialogContent
            className="max-w-md w-full px-4 py-6 sm:max-w-lg"
            aria-describedby="profile-dialog-description"
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-center">
                Edit Profile
              </DialogTitle>
              <DialogDescription id="profile-dialog-description" className="sr-only">
                Edit your profile information and upload a profile picture.
              </DialogDescription>
            </DialogHeader>

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-4">
              <div
                className="relative w-24 h-24 rounded-full border flex items-center justify-center bg-gray-200"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Avatar className="w-24 h-24 rounded-full">
                  {image ? (
                    <AvatarImage src={image} alt="profile" className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-5xl font-bold">
                      {profileData.firstName?.charAt(0) || "?"}
                    </div>
                  )}
                </Avatar>

                {hovered && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                    onClick={image ? deleteImage : () => fileInputRef.current.click()}
                    aria-label={image ? "Delete profile image" : "Upload profile image"}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        image ? deleteImage() : fileInputRef.current.click();
                      }
                    }}
                  >
                    {image ? (
                      <FaTrash className="text-white text-3xl" />
                    ) : (
                      <FaPlus className="text-white text-3xl" />
                    )}
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

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "username",
                "firstName",
                "lastName",
                "city",
                "country",
                "email",
              ].map((field, index) => (
                <div key={index}>
                  <Label htmlFor={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    value={profileData[field]}
                    onChange={handleFieldChange}
                    disabled={field === "email"}
                    aria-invalid={errors[field] ? "true" : "false"}
                    aria-describedby={errors[field] ? `${field}-error` : undefined}
                  />
                  {errors[field] && (
                    <p
                      id={`${field}-error`}
                      className="text-red-500 text-sm mt-1"
                      role="alert"
                    >
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                className="bg-blue-500 text-white px-3 py-1 text-sm flex items-center justify-center"
                onClick={handleSave}
                disabled={loading}
                aria-disabled={loading}
                type="button"
              >
                {loading ? <ScaleLoader height={15} width={3} color="#fff" /> : "Save"}
              </Button>
              <Button
                className="bg-red-500 text-white px-3 py-1 text-sm"
                variant="destructive"
                onClick={logOut}
                type="button"
              >
                Logout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ToastContainer />
    </>
  );
};

export default ProfileDialog;
