import axios from "axios";
import { TopAnimeApiRes } from "./types";

const wallpaperBaseUrls = {
  wallpaperflare: new URL(
    "https://anime-wallpaper-api.onrender.com/api?numOfImages=1&source=wallpaperflare"
  ),
  wallhaven: new URL(
    "https://anime-wallpaper-api.vercel.app/api?numOfImages=1&source=wallhaven"
  )
};

export const getWallpaper = async (
  {
    source = "wallpaperflare",
    q = "anime",
    updateUrl
  }: {
    source: keyof typeof wallpaperBaseUrls;
    q: string;
    updateUrl?: (url: URL) => void;
  } = {} as never
) => {
  const url = wallpaperBaseUrls[source];
  url.searchParams.append("q", q.split(":")[0]);
  updateUrl?.(url);
  const {
    data: { data }
  } = await axios.get(url.toString());
  return data.urls[0] as string;
};

export const getTopAnime = async ({ type }: { type?: "tv" | "movie" } = {}) => {
  const url = new URL("https://api.jikan.moe/v4/top/anime");
  if (type) {
    url.searchParams.append("type", type);
  }
  const {
    data: { data }
  } = await axios.get<TopAnimeApiRes>(url.toString());
  const res = data.map(({ mal_id }) => mal_id);
  return res;
};

export const getAnimeInfo = async (id: number) => {
  const {
    data: { data }
  } = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
  return data;
};

export const getAnimePictures = async (id: number) => {
  const {
    data: { data }
  } = await axios.get(`https://api.jikan.moe/v4/anime/${id}/pictures`);
  const res = data.map(({ jpg: { image_url } }: any) => image_url);
  return res as string[];
};
