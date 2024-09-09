import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

export function FriendManager() {
  const [friendEmail, setFriendEmail] = useState("");
  const { user } = useUser();

  async function inviteFriend() {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to invite friends",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("friend_requests").insert({
      user_id: user.id,
      friend_id: friendEmail,
      status: "pending",
    });

    if (error) {
      console.error("Error inviting friend:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
      setFriendEmail("");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Input
        placeholder="Friend's email"
        value={friendEmail}
        onChange={(e) => setFriendEmail(e.target.value)}
        className="text-xl bg-secondary shadow-inner text-foreground placeholder-muted-foreground"
      />
      <Button
        onClick={inviteFriend}
        className="text-xl py-4 px-6 bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        Invite Friend
      </Button>
    </motion.div>
  );
}
