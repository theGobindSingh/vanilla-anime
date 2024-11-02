import "./styles/index.css";
import "remixicon/fonts/remixicon.css";
import { getAnimeInfo, getAnimePictures, getTopAnime } from "./api";
import {
  setBackgroundImage,
  setDescription,
  setGallery,
  setLongImage,
  setRank,
  setStars,
  setTitle,
  setTrailer
} from "./html-updaters";

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

  const rank = 1;

  const getRankSuffix = () => {
    switch (override) {
      case "movie":
        return "Top Movie";
      case "tv":
        return "Top TV Show";
      default:
        return "Most Popular";
    }
  };

  setBackgroundImage(title);
  setRank({ rank, suffix: getRankSuffix() });
  setTitle({ title });
  setDescription({
    text: synopsis,
    readMoreUrl: `https://myanimelist.net/anime/${ids?.[0]}`
  });
  setStars({ scoreOutOfTen });
  setTrailer({ trailerUrl });
  setGallery({ pictures });
  setLongImage({ anime: title });
};

const moviesMain = async () => {
  await topAnimeMain({ override: "movie" });
};

const tvMain = async () => {
  await topAnimeMain({ override: "tv" });
};

const searchMain = async (query: string) => {
  console.log(query);
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
  const searchForm = document.querySelector("header form")! as HTMLFormElement;
  const searchInput = document.querySelector(
    "header input"
  )! as HTMLInputElement;

  mostPopularBtn.addEventListener("click", () => topAnimeMain());
  moviesBtn.addEventListener("click", () => moviesMain());
  tvBtn.addEventListener("click", () => tvMain());
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = new FormData(e.target as HTMLFormElement).get(
      "search"
    ) as string;
    searchMain(query);
  });
  searchInput.addEventListener("blur", (e) => {
    (e.target as HTMLInputElement).value = "";
  });
};

main();
