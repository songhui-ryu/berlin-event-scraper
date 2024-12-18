/**
 * Scrapper for berlin.de event pages
 */
import * as log from "@std/log";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { DateRange, parseEnglishDate, parseGermanDate } from "./dateParser.ts";

const logger = log.getLogger("parser");
const consoleLogger = log.getLogger();

const BASE_URL = "https://www.berlin.de";

export interface Entry {
    name: string;
    date?: DateRange;
    description?: string;
    href?: string;
    onMonth?: number;
}

function sleep(milliseconds: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

export async function getEvents(lang: string, path: string, month: number) {
    const url = `${BASE_URL}${path}`;

    const entries: Entry[] = [];

    const pageContents = await fetch(url).then((res) => res.text());
    await sleep(1000);

    const document = new DOMParser().parseFromString(
        pageContents,
        "text/html",
    );

    if (document) {
        const events = document.getElementsByTagName("article");

        for (const event of events) {
            const entry: Entry = { name: "" };

            entry.name = event.getElementsByClassName("title")[0]?.textContent
                .replace(/(\n\s+)|(\s+$)/g, "");

            // skip if the entry is a link to another month
            const entryName = entry.name.toLowerCase();
            if (
                entryName.includes("events in") ||
                entryName.includes("culture in") ||
                entryName.includes("weekend tips")
            ) {
                continue;
            }

            const dateString = event.getElementsByClassName(
                "teaser__meta text--meta",
            )[0]?.textContent;

            entry.date = lang == "en"
                ? parseEnglishDate(dateString)
                : parseGermanDate(dateString);

            const descriptionElement = event.getElementsByClassName("inner")[0];

            const path = descriptionElement.getElementsByClassName("more")[0]
                ?.getAttribute("href")?.split("?")[0];

            entry.description = descriptionElement?.textContent.replace(
                /\n|(\s){2,}|mehr\s*$|more\s*$/g,
                "",
            ).trim();

            entry.href = path?.startsWith("https")
                ? path
                : `https://www.berlin.de${path}`;

            entry.onMonth = month;

            entries.push(entry);

            // log events parsed incorrectly
            if (!entry.date.start && entry.date.originalString) {
                const originalString = entry.date.originalString.toLowerCase();
                if (
                    originalString.includes("yet") ||
                    originalString.includes("noch") ||
                    originalString.includes("exhibitions") ||
                    originalString.includes("winterpause")
                ) {
                    // skip TBD events
                } else {
                    logger.warn({
                        url: url,
                        parsed: entry.date,
                    });
                }
            }
        }
    }

    return entries;
}

export async function hashString(str: string): Promise<string> {
    const messageBuffer = new TextEncoder().encode(str); // string to utf-8
    const hashBuffer = await crypto.subtle.digest("SHA-1", messageBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // to hex
}

export async function deduplicate(event: Entry, hashes: Set<string>) {
    // skip if this entry has been seen already. TODO: is name enough
    const hash = await hashString(event.name);

    if (hashes.has(hash)) {
        consoleLogger.debug(
            `${event.name} has been already found. Skipping...`,
        );
        return undefined;
    } else {
        hashes.add(hash);
        return event;
    }
}
