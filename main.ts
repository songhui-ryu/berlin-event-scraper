/**
 *  1. Scrap the ongoing events from berlin.de page both in english and german
 *  2. Save to json files
 *  3. Triggerred weekly by github actions
 */
import * as log from "@std/log";
import {} from "./logger.ts"; // dummy import to import the log setup earliest
import { deduplicate, Entry, getEvents } from "./scraper.ts";
import { MONTHS } from "./dateParser.ts";

const logger = log.getLogger();

const enHashes: Set<string> = new Set();
const deHashes: Set<string> = new Set();

async function handleMonth(
  month: string[],
  monthIndex: number,
): Promise<Entry[][]> {
  const enMonth = month[0];
  const deMonth = month[1];
  const enURL = `/en/events/${enMonth}/`;
  const deURL = `/events/jahresuebersicht/${deMonth}/`;

  // expecting [{}, ...]
  const enEvents = await getEvents("en", enURL, monthIndex);
  const deEvents = await getEvents("de", deURL, monthIndex);

  return Promise.all([
    Promise.all([
      ...enEvents.map(async (e) => await deduplicate(e, enHashes)),
    ]),
    Promise.all([
      ...deEvents.map(async (e) => await deduplicate(e, deHashes)),
    ]),
  ])
    .then(([enEvents, deEvents]) => {
      return [
        enEvents.filter((e) => e),
        deEvents.filter((e) => e),
      ] as Entry[][];
    });
}

try {
  logger.info(`Scrapping events from berlin.de/events`);
  let enEvents: Entry[] = [];
  let deEvents: Entry[] = [];

  for (const [index, month] of MONTHS.entries()) {
    logger.info(`Handling ${month}...`);

    const monthlyEvents = await handleMonth(month, index);

    enEvents = enEvents.concat(...monthlyEvents[0]);
    deEvents = deEvents.concat(...monthlyEvents[1]);
  }

  await Promise.all([
    Deno.writeTextFile(
      "dist/events_en.json",
      JSON.stringify(enEvents, null, 2),
    ),
    Deno.writeTextFile(
      "dist/events_de.json",
      JSON.stringify(deEvents, null, 2),
    ),
  ]);
} catch (e) {
  logger.error("main: ", e);
}
