import { getWallpaper } from "./api";

export const setBackgroundImage = async (anime: string) => {
  const { body } = document;
  if (!body) return;
  body.classList.remove("has-bg");
  body.style.backgroundImage = `url("https://r4.wallpaperflare.com/wallpaper/148/646/428/be-patient-wallpaper-374024d8bcf155d98d7d890fe75ab43a.jpg")`;
  const wallpaper = await getWallpaper({
    q: anime,
    source: "wallpaperflare"
  });
  if (!wallpaper) return;
  body.style.backgroundImage = `url("${wallpaper}")`;
  body.classList.add("has-bg");
};

export const setLongImage = async ({
  anime = "anime"
}: { anime?: string } = {}) => {
  const pictureThree = document.querySelector(".gi3")! as HTMLImageElement;
  if (!pictureThree) return;
  const wallpaper = await getWallpaper({
    q: anime,
    source: "wallhaven",
    updateUrl: (url) => {
      url.searchParams.set("ratio", "16x10,16x9");
    }
  });
  if (!wallpaper) return;
  pictureThree.src = wallpaper;
};

export const setRank = (
  {
    rank = 0,
    suffix = "Loading Rank"
  }: {
    rank?: number | string;
    suffix?: string;
  } = {} as never
) => {
  const rankElem = document.querySelector(".subtitle")! as HTMLHeadingElement;
  rankElem.textContent = `#${rank} ${suffix}`;
};

export const setTitle = (
  {
    title = "Loading Anime"
  }: {
    title?: string;
  } = {} as never
) => {
  const titleElem = document.querySelector(".title")! as HTMLHeadingElement;
  titleElem.textContent = title;
};

const loremIpsum = `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut in officia ipsa ex. 
Corporis ex aspernatur similique explicabo enim! Amet doloribus expedita optio provident corrupti sunt 
soluta explicabo consequatur aperiam?`;

export const setDescription = (
  {
    maxWords = 35,
    readMoreUrl = "/",
    text = loremIpsum
  }: {
    maxWords?: number;
    readMoreUrl?: string;
    text?: string;
  } = {} as never
) => {
  const descElem = document.querySelector(".desc")! as HTMLParagraphElement;
  const synopsisSplit = text?.split(" ");
  const allowedWords = maxWords || 35;
  descElem.innerHTML =
    synopsisSplit?.length <= allowedWords
      ? text
      : synopsisSplit?.slice(0, allowedWords).join(" ") +
        `...  <a href="${readMoreUrl}" target="_blank" rel="noopener noreferrer">Read More</a>`;
};

export const setStars = (
  {
    scoreOutOfTen = 0
  }: {
    scoreOutOfTen?: number;
  } = {} as never
) => {
  const score = parseInt("" + scoreOutOfTen / 2);
  const starsContainer = document.querySelector(".stars")! as HTMLDivElement;
  starsContainer.innerHTML = [
    ...Array(isNaN(score) ? 0 : score).fill(
      `<i class="ri-star-fill star"></i>`
    ),
    ...Array(5 - (isNaN(score) ? 0 : score)).fill(
      `<i class="ri-star-line star"></i>`
    )
  ].join("");
};

export const setTrailer = (
  {
    trailerUrl = "/"
  }: {
    trailerUrl?: string;
  } = {} as never
) => {
  const trailerElem = document.querySelector("a.primary")! as HTMLAnchorElement;
  trailerElem.href = trailerUrl;
};

export const setGallery = (
  { pictures = [] }: { pictures?: string[] } = {} as never
) => {
  const pictureOne = document.querySelector(".gi1")! as HTMLImageElement;
  const pictureTwo = document.querySelector(".gi2")! as HTMLImageElement;
  const pictureThree = document.querySelector(".gi3")! as HTMLImageElement;
  const pictureElements = [pictureOne, pictureTwo, pictureThree];
  for (let i = 0; i < 3; i++) {
    const img = pictures[i];
    if (!img) return;
    pictureElements[i].src = img;
  }
};
