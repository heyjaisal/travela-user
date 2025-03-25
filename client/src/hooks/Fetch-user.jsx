import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios-instance";
import { setUserInfo } from "../redux/slice/auth";
import { toast } from "react-toastify";

export const useFetchUser = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`/auth/profile`, { withCredentials: true });
          if (response.status === 200 && response.data.id) {
            dispatch(setUserInfo(response.data));
          } else {
            dispatch(setUserInfo(undefined));
            toast.error("Failed to fetch user profile");
          }
        } catch (error) {
          dispatch(setUserInfo(undefined));
          toast.error("An error occurred while fetching user profile");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userInfo, dispatch]);

  return { loading };
};