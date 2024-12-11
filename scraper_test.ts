import { expect } from "jsr:@std/expect";
import { getEvents } from "./scraper.ts";
import { getMonthName } from "./dateParser.ts";

const date = new Date();
const month_en = getMonthName(date.getMonth(), "en");
const month_de = getMonthName(date.getMonth(), "de");

Deno.test("Event endpoint exists", async (t) => {
  await t.step("English page exists", async () => {
    await fetch(`https://www.berlin.de/en/events/${month_en}`)
      .then((res) => {
        expect(res.ok).toBe(true);
        return res.body?.cancel();
      });
  });
  await t.step("German page exists", async () => {
    await fetch(`https://www.berlin.de/events/jahresuebersicht/${month_de}`)
      .then((res) => {
        expect(res.ok).toBe(true);
        return res.body?.cancel();
      });
  });
});

Deno.test("Fetch events correctly", async (t) => {
  const entries = await getEvents("en", `/en/events/${month_en}/`);

  await t.step("Fetch events", () => {
    expect(entries.length).not.toBe(0);
  });

  await t.step("The json file has the right format", () => {
    expect(entries[0]).toHaveProperty("name");
  });
});
