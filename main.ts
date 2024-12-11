/**
 * Triggered on the first day of each month to do the followings:
 *    1. Get the current month
 *    2. Scrap the ongoing events from berlin.de page both in english and german
 *    3. Save to json files
 */

import { getEvents } from "./scraper.ts";
import { getMonthName } from "./dateParser.ts";

const date = new Date();
const month_en = getMonthName(date.getMonth(), "en");
const month_de = getMonthName(date.getMonth(), "de");

try {
  console.log(
    `${new Date().toISOString()} Scrapping events from berlin.de/events`,
  );
  await Promise.all([
    getEvents("en", `/en/events/${month_en}/`),
    getEvents("de", `/events/jahresuebersicht/${month_de}/`),
  ])
    .then((results) => {
      return Promise.all([
        Deno.writeTextFile(
          "dist/events_en.json",
          JSON.stringify(results[0], null, 2),
        ),
        Deno.writeTextFile(
          "dist/events_de.json",
          JSON.stringify(results[1], null, 2),
        ),
      ]);
    })
    .then(() => {
      console.log("Done");
    })
    .catch((e) => {
      console.log("main.Promise: ", e);
      throw e;
    });
} catch (e) {
  console.log("main: ", e);
}
