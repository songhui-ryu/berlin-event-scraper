/**
 * Scrapper for berlin.de event pages
 */
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { DateRange, parseEnglishDate, parseGermanDate } from "./dateParser.ts";

interface Entry {
    name?: string;
    date?: DateRange;
    description?: string;
    href?: string;
}

function sleep(milliseconds: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

export async function getEvents(lang: string, path: string) {
    const BASE_URL = "https://www.berlin.de";
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
            const entry: Entry = {};

            entry.name = event.getElementsByClassName("title")[0]?.textContent
                .replace(/(\n\s+)|(\s+$)/g, "");

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

            entries.push(entry);
        }
    }

    const filename = lang == "en" ? "events_en.json" : "events_de.json";
    await Deno.writeTextFile(
        filename,
        JSON.stringify(entries, null, 2),
    );
}
