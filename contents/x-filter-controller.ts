import type { PlasmoCSConfig } from "plasmo";
import { Storage } from "@plasmohq/storage";

//import * as adFilter from "./x-filters/x-ad-filter";
//import * as aiFilter from "./x-filters/x-aireply-filter";
import * as oldPostFilter from "./x-filters/x-oldpost-filter";
import * as oneLinerFilter from "./x-filters/x-oneliner-filter";
//import * as termFilter from "./x-filters/x-term-filter";

const storage = new Storage();

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*"], // Run on all Twitter/X pages
  run_at: "document_idle",
};

// Function to check if we're on the home page
function isHomePage(): boolean {
  const currentUrl = window.location.href;
  return currentUrl === "https://twitter.com/home" || currentUrl === "https://x.com/home";
}

function getTweetText(post: HTMLElement): string {
  const tweetTextElement = post.querySelector('div[data-testid="tweetText"]') as HTMLElement | null;
  return tweetTextElement && "innerText" in tweetTextElement ? tweetTextElement.innerText.trim() : "";
}

//  Function to identify one-liners
function isOneLinerCheck(post:HTMLElement): boolean {
  const tweetText = getTweetText(post).toLowerCase();
  const hasVideo = !!post.querySelector('video');
  const hasImage = !!post.querySelector('div[data-testid="tweetPhoto"] img');
  const hasPhotoLink = !!post.querySelector('a[href*="/photo/"]');
  const hasMedia = hasVideo || hasImage || hasPhotoLink;
  const isOneLiner = tweetText.length < 70 && tweetText.split('\n').length <= 1 && !hasMedia;
  return isOneLiner;
}

// Function to get post timestamp
function getPostTimestamp(post: HTMLElement): Date | null {
  const timeElement = post.querySelector('time');
  if (timeElement && timeElement.getAttribute('datetime')) {
    return new Date(timeElement.getAttribute('datetime')!);
  }
  return null;
}

// Function to check if post is older than 24 hours
function isOldPostCheck(post: HTMLElement): boolean {
  const postTime = getPostTimestamp(post);
  if (!postTime) return false;
  
  const currentTime = new Date();
  const oneHourInMs = 60 * 60 * 1000 * 24; // 24 hours in milliseconds
  return (currentTime.getTime() - postTime.getTime()) > oneHourInMs;
}

async function filterPosts(adFilterEnabled, aiFilterEnabled, oldPostFilterEnabled, oneLinerFilterEnabled, termFilterEnabled) {
  const posts = document.querySelectorAll('div[data-testid="cellInnerDiv"]:not([data-filtered="true"])') as NodeListOf<HTMLElement>;
  if (!posts.length) {
    console.log("No posts found to filter");
    return;
  }

  Array.from(posts).slice(0, 20).forEach((post) => {
    const tweet = post.querySelector('article[data-testid="tweet"]');
    if (!tweet) return;

		let shouldRemovePost = false;
		let isAd = false;
		let isAI = false;
		let isOldPost = false;
    let isOneLiner = false;
		let hasForbiddenTerm = false;
		
		if (oldPostFilterEnabled) isOldPost = isOldPostCheck(post);
		if (oneLinerFilterEnabled) isOneLiner = isOneLinerCheck(post);

		if (isAd || isAI || isOldPost || isOneLiner || hasForbiddenTerm) shouldRemovePost = true;

	  const tweetText = getTweetText(post);
		if (shouldRemovePost) console.log("Removing post: ", { text: tweetText });

    if (shouldRemovePost && post.dataset.filtered !== "removed") {
      //post.innerHTML = '<div style="padding: 10px; color: #fff; background-color: #1DA1F2; text-align: center;">This post has been removed by LeanBrew</div>';
			post.innerHTML = "";
      post.dataset.filtered = "removed";
      console.log("Removed post.");
    } else {
      post.dataset.filtered = "true";
    }
  });
}

// Debounce function
function debounce(fn: () => void, delay: number) {
  let timeout: NodeJS.Timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

// Observer setup
let observer: MutationObserver | null = null;

async function setupObserver() {
  const feed = document.querySelector('div[data-testid="primaryColumn"]') as HTMLElement | null;
  if (!feed) {
    console.log("Primary column not found, trying again in 1s.");
		setTimeout(setupObserver, 1000);
    return;
  }

  if (observer) {
    observer.disconnect(); // Disconnect any existing observer
  }

	let adFilterEnabled;
	let aiFilterEnabled;
	let oldPostFilterEnabled;
	let oneLinerFilterEnabled;
	let termFilterEnabled;
  try {
    adFilterEnabled = await storage.get("adFilterEnabled");
		aiFilterEnabled = await storage.get("aiFilterEnabled");
		oldPostFilterEnabled = await storage.get("oldPostFilterEnabled");
		oneLinerFilterEnabled = await storage.get("oneLinerFilterEnabled");
		termFilterEnabled = await storage.get("termFilterEnabled");
  } catch (error) {
    console.error("Failed to get filter status:", error);
    return;
  }

	filterPosts(adFilterEnabled, aiFilterEnabled, oldPostFilterEnabled, oneLinerFilterEnabled, termFilterEnabled);
  if (!adFilterEnabled && !aiFilterEnabled && !oldPostFilterEnabled && !oneLinerFilterEnabled && !termFilterEnabled) return;

	observer = new MutationObserver(debounce(() => {
		filterPosts(adFilterEnabled, aiFilterEnabled, oldPostFilterEnabled, oneLinerFilterEnabled, termFilterEnabled);
  	if (!adFilterEnabled && !aiFilterEnabled && !oldPostFilterEnabled && !oneLinerFilterEnabled && !termFilterEnabled) return;
	}, 250));
  observer.observe(feed, { childList: true, subtree: true });
  console.log("Observer set up for home page"); 
}

// Function to handle page changes
function handlePageChange() {
  console.log("URL changed to:", window.location.href);
  if (isHomePage()) {
    setupObserver(); // Start observer and filter on home page
  } else if (observer) {
    observer.disconnect();
    console.log("Observer disconnected (not on home page)");
  }
}

// Monitor URL changes for SPA navigation
let lastUrl = "";
function startMonitoring() {
  // Initial check
  handlePageChange();

  // Poll for URL changes
  setInterval(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      handlePageChange();
    }
  }, 500); // Check every 500ms
}

// Start the monitoring process
startMonitoring();

