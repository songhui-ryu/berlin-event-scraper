/**
 * Triggered on the first day of each month to do the followings:
 *    1. Scrap the ongoing events from berlin.de page both in english and german
 *    2. Save to json files
 *    3. Triggerred monthly by github actions
 */
import * as log from "@std/log";
import {} from "./logger.ts"; // dummy import to import the log setup earliest
import { getEvents } from "./scraper.ts";
import { MONTHS } from "./dateParser.ts";

const logger = log.getLogger();

try {
  logger.info(`Scrapping events from berlin.de/events`);

  /**
   * expecting [{en, de}, ...]
   */
  const promises = MONTHS.map(async (months) => {
    const enURL = `/en/events/${months[0]}/`;
    const deURL = `/events/jahresuebersicht/${months[1]}/`;

    return {
      en: await getEvents("en", enURL),
      de: await getEvents("de", deURL),
    };
  });

  await Promise.all(promises)
    .then((results) => {
      /**
       * expecting [{event}, ...]
       */
      const enEvents = results.flatMap((monthlyEvents) => monthlyEvents.en);
      const deEvents = results.flatMap((monthlyEvents) => monthlyEvents.de);

      return Promise.all([
        Deno.writeTextFile(
          "dist/events_en.json",
          JSON.stringify(enEvents, null, 2),
        ),
        Deno.writeTextFile(
          "dist/events_de.json",
          JSON.stringify(deEvents, null, 2),
        ),
      ]);
    })
    .then(() => {
      logger.info("Done");
    })
    .catch((e) => {
      logger.error("main.Promise: ", e);
      throw e;
    });
} catch (e) {
  logger.error("main: ", e);
}
