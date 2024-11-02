import axios from "axios";
import "./styles/index.css";
import "remixicon/fonts/remixicon.css";
import { TopAnimeApiRes } from "./types";

const getTopAnime = async ({ type }: { type?: "tv" | "movie" } = {}) => {
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

const getAnimeInfo = async (id: number) => {
  const {
    data: { data }
  } = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
  return data;
};

const getAnimePictures = async (id: number) => {
  const {
    data: { data }
  } = await axios.get(`https://api.jikan.moe/v4/anime/${id}/pictures`);
  const res = data.map(({ jpg: { image_url } }: any) => image_url);
  return res as string[];
};

const setBackgroundImage = async (anime: string) => {
  const { body } = document;
  if (!body) return;
  body.classList.remove("has-bg");
  body.style.backgroundImage = `url("https://r4.wallpaperflare.com/wallpaper/148/646/428/be-patient-wallpaper-374024d8bcf155d98d7d890fe75ab43a.jpg")`;
  const url = new URL(
    // "https://anime-wallpaper-api.vercel.app/api?numOfImages=1&source=wallhaven"
    "https://anime-wallpaper-api.onrender.com/api?numOfImages=1&source=wallpaperflare"
  );
  url.searchParams.append("q", anime.split(":")[0]);
  const wallpaper = await axios.get(url.toString());
  body.style.backgroundImage = `url("${wallpaper?.data?.data?.urls?.[0]}")`;
  body.classList.add("has-bg");
};

const setLongImage = async (anime: string) => {
  const pictureThree = document.querySelector(".gi3")! as HTMLImageElement;
  if (!pictureThree) return;
  const url = new URL(
    "https://anime-wallpaper-api.vercel.app/api?numOfImages=1&source=wallhaven&ratio=16x10,16x9"
    // "https://anime-wallpaper-api.onrender.com/api?numOfImages=1&source=wallpaperflare"
  );
  url.searchParams.append("q", anime.split(":")[0]);
  const wallpaper = await axios.get(url.toString());
  if (!wallpaper?.data?.data?.urls?.[0]) return;
  pictureThree.src = wallpaper?.data?.data?.urls?.[0];
};

const topAnimeMain = async ({
  override
}: { override?: "movie" | "tv" } = {}) => {
  const ids = await getTopAnime({ type: override });
  if (!ids?.[0]) return;
  const pictures = await getAnimePictures(ids[0]);
  const {
    synopsis,
    trailer: { url: trailerUrl },
    title_english: title,
    score: scoreOutOfTen
  } = await getAnimeInfo(ids[0]);

  setBackgroundImage(title);
  setLongImage(title);

  const score = parseInt("" + scoreOutOfTen / 2);
  const rank = 1;

  const rankElem = document.querySelector(".subtitle")! as HTMLHeadingElement;
  const titleElem = document.querySelector(".title")! as HTMLHeadingElement;
  const descElem = document.querySelector(".desc")! as HTMLParagraphElement;
  const starsContainer = document.querySelector(".stars")! as HTMLDivElement;
  const trailerElem = document.querySelector("a.primary")! as HTMLAnchorElement;

  const pictureOne = document.querySelector(".gi1")! as HTMLImageElement;
  const pictureTwo = document.querySelector(".gi2")! as HTMLImageElement;
  const pictureThree = document.querySelector(".gi3")! as HTMLImageElement;
  const pictureElements = [pictureOne, pictureTwo, pictureThree];

  const synopsisSplit = synopsis.split(" ");
  const allowedWords = 35;

  if (override === "movie") {
    rankElem.textContent = `#${rank} Top Movie`;
  } else if (override === "tv") {
    rankElem.textContent = `#${rank} Top TV Show`;
  } else {
    rankElem.textContent = `#${rank} Most Popular`;
  }

  titleElem.textContent = title;
  descElem.innerHTML =
    synopsisSplit.length <= allowedWords
      ? synopsis
      : synopsisSplit.slice(0, allowedWords).join(" ") +
        `...  <a href="https://myanimelist.net/anime/${ids?.[0]}" target="_blank" rel="noopener noreferrer">Read More</a>`;

  starsContainer.innerHTML = [
    ...Array(isNaN(score) ? 0 : score).fill(
      `<i class="ri-star-fill star"></i>`
    ),
    ...Array(5 - (isNaN(score) ? 0 : score)).fill(
      `<i class="ri-star-line star"></i>`
    )
  ].join("");

  trailerElem.href = trailerUrl;

  for (let i = 0; i < 3; i++) {
    const img = pictures[i];
    if (!img) return;
    pictureElements[i].src = img;
  }
};

const moviesMain = async () => {
  await topAnimeMain({ override: "movie" });
};

const tvMain = async () => {
  await topAnimeMain({ override: "tv" });
};

const main = async () => {
  await topAnimeMain();

  const mostPopularBtn = document.querySelector(
    "header .popular"
  )! as HTMLButtonElement;
  const moviesBtn = document.querySelector(
    "header .movies"
  )! as HTMLButtonElement;
  const tvBtn = document.querySelector("header .tv")! as HTMLButtonElement;

  mostPopularBtn.addEventListener("click", () => topAnimeMain());
  moviesBtn.addEventListener("click", () => moviesMain());
  tvBtn.addEventListener("click", () => tvMain());
};

main();
