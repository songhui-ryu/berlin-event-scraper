/**
 * Triggered on the first day of each month to do the followings:
 *    1. Get the current month
 *    2. Scrap the ongoing events from berlin.de page both in english and german
 *    3. Send the event info to the callendar app
 */

import { getEvents } from "./scraper.ts";
import { getMonthName } from "./dateParser.ts";

const commonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

/**
 * Temporary hander.
 * @param req
 * @returns
 */
async function handler(req: Request) {
  const date = new Date();
  const month_en = getMonthName(date.getMonth(), "en");
  const month_de = getMonthName(date.getMonth(), "de");

  try {
    if (req.method != "GET") {
      return new Response(
        JSON.stringify({ message: "Not allowed" }),
        {
          status: 405,
          headers: commonHeaders,
        },
      );
    }

    console.log(
      `${new Date().toISOString()} Scrapping events from berlin.de/events`,
    );
    await Promise.all([
      getEvents("en", `/en/events/${month_en}/`),
      getEvents("de", `/events/jahresuebersicht/${month_de}/`),
    ])
      .then(() => {
        console.log("Done");
      })
      .catch((e) => {
        console.log("server.getEvents: ", e);
        throw e;
      });

    return new Response(
      JSON.stringify({
        url: req.url,
      }),
      {
        status: 200,
        headers: commonHeaders,
      },
    );
  } catch (e) {
    console.log("server.hander(): ", e);
    return new Response(
      JSON.stringify({ message: "Error occured" }),
      {
        status: 500,
        headers: commonHeaders,
      },
    );
  }
}

/**
 * Open servers.
 * TODO: remove after setting the workflow
 */
if (import.meta.main) {
  try {
    Deno.serve({ port: 4242 }, handler);
  } catch (e) {
    console.log("Something went wrong: ", e);
  }
}
