import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
// Remove the Avatar import if you don't have this component
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function FriendManager() {
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ]);

  const handleAddFriend = () => {
    console.log("Adding friend:", friendEmail);
    setFriendEmail("");
  };

  const handleRemoveFriend = (id: string) => {
    setFriends(friends.filter((friend) => friend.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add a Friend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Friend's email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />
            <Button onClick={handleAddFriend}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Friends</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul className="space-y-4">
            {friends.map((friend) => (
              <motion.li
                key={friend.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center justify-between bg-secondary p-4 rounded-lg border border-secondary-foreground/10"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {friend.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {friend.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveFriend(friend.id)}
                >
                  Remove
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </div>
  );
}
