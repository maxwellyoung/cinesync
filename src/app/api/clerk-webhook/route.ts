import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabaseClient";

export const runtime = "edge";

// Remove the bodyParser config
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Error occurred -- no svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Error occurred" }, { status: 400 });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  // Handle the event
  switch (eventType) {
    case "user.created":
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("users")
        .insert({
          clerk_id: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          username: evt.data.username,
        })
        .select();

      if (error) {
        console.error("Error inserting user into Supabase:", error);
        return NextResponse.json(
          { error: "Error inserting user" },
          { status: 500 }
        );
      }

      console.log("User inserted into Supabase:", data);
      break;
    // Add more cases for other event types as needed
    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}
