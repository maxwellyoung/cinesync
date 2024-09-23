import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "../hooks/use-toast";

export function FriendManager() {
  const { user } = useUser();
  const [friends, setFriends] = useState<string[]>([]);
  const [newFriend, setNewFriend] = useState("");

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    // TODO: Implement API call to fetch friends
    // For now, we'll use dummy data
    setFriends(["Friend 1", "Friend 2"]);
  };

  const addFriend = async () => {
    if (newFriend.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a valid friend name",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement API call to add friend
    setFriends([...friends, newFriend]);
    setNewFriend("");
    toast({
      title: "Success",
      description: `${newFriend} added to your friends list`,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Friends</h2>
      <div className="flex space-x-2">
        <Input
          value={newFriend}
          onChange={(e) => setNewFriend(e.target.value)}
          placeholder="Enter friend's name"
        />
        <Button onClick={addFriend}>Add Friend</Button>
      </div>
      <ul className="space-y-2">
        {friends.map((friend) => (
          <li key={friend} className="bg-secondary p-2 rounded">
            {friend}
          </li>
        ))}
      </ul>
    </div>
  );
}
