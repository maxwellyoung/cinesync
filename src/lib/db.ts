import fs from "fs";
import path from "path";
import { Movie } from "./api";

const DB_PATH = path.join(process.cwd(), "data", "watchlists.json");

interface WatchlistDB {
  [userId: string]: Movie[];
}

function ensureDBExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}));
  }
}

export function getWatchlist(userId: string): Movie[] {
  ensureDBExists();
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as WatchlistDB;
  return data[userId] || [];
}

export function saveWatchlist(userId: string, watchlist: Movie[]): void {
  ensureDBExists();
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as WatchlistDB;
  data[userId] = watchlist;
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
