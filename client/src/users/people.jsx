import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Input,
} from "@heroui/react";
import axiosInstance from "../utils/axios-instance";
import { ScrollArea } from "@/components/ui/scroll-area";
import Peoplecard from "./people-card"; 

export const SearchIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11 3.5C6.86 3.5 3.5 6.86 3.5 11C3.5 15.14 6.86 18.5 11 18.5C12.93 18.5 14.71 17.8 16.05 16.58L19.29 19.82C19.68 20.21 20.32 20.21 20.71 19.82C21.1 19.43 21.1 18.79 20.71 18.4L17.47 15.16C18.7 13.82 19.5 12.04 19.5 10C19.5 5.86 16.14 3.5 11 3.5ZM5.5 11C5.5 7.96 7.96 5.5 11 5.5C14.04 5.5 16.5 7.96 16.5 11C16.5 14.04 14.04 16.5 11 16.5C7.96 16.5 5.5 14.04 5.5 11Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function People({ isOpen, onOpenChange }) {
  const [users, setUsers] = useState([]);

  const searchTermhandler = async (searchTerm) => {
    try {
      if (searchTerm.trim().length > 0) {
        const response = await axiosInstance.post(
          "/user/search",
          { searchTerm },
          { withCredentials: true }
        );
        
        setUsers(response.status === 200 ? response.data.users || [] : []);
      } else {
        setUsers([]); 
      }
    } catch (error) {
      console.log("Error fetching user", error);
      setUsers([]); 
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-2">
          <h2 className="text-lg font-bold ml-1">People</h2>
          <Input
            endContent={
              <SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            labelPlacement="outside"
            placeholder="search for people"
            className="mt-4"
            onChange={(e) => searchTermhandler(e.target.value)}
          />
        </DrawerHeader>
        <DrawerBody>
          {users.length > 0 && (
            <div>
              <ScrollArea className="h-[250px]">
                <div className="flex flex-col gap-5">
                  {users.map((user) => (
                    <Peoplecard key={user._id} user={user} onSelectUser={onOpenChange} /> 
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </DrawerBody>
        <DrawerFooter>
          <Button color="danger" variant="light" onPress={onOpenChange}>
            Close
          </Button>
        </DrawerFooter>
      </ DrawerContent>
    </Drawer>
  );
}