import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { useNavigate } from "react-router-dom";

function Peoplecard({ user,onSelectUser }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/${user._id}`);
    onSelectUser (false);
  };

  return (
    <div
      key={user._id}
      className="flex gap-3 items-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-12 h-12 relative">
        <Avatar className="w-12 h-12 rounded-full overflow-hidden">
          {user.image ? (
            <AvatarImage
              src={user.image}
              alt="profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center">
              {user.email
                ? user.email.split("").shift()
                : user.firstName.split("").shift()}
            </div>
          )}
        </Avatar>
      </div>
      <div className="flex flex-col">
        <span>{user.firstName ? user.firstName : user.email}</span>
        <span className="text-xs">{user.username}</span>
      </div>
    </div>
  );
}

export default Peoplecard;