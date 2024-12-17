import { expect } from "jsr:@std/expect";
import { parseEnglishDate, parseGermanDate } from "./dateParser.ts";

Deno.test("Parse dates in English", async (t) => {
  await t.step("Parse single dates", () => {
    const dates = [
      "October 1, 2024",
      "October 01, 2024",
      "October 11, 2024",
    ];
    for (const date of dates) {
      const parsed = parseEnglishDate(date);
      expect(parsed).toHaveProperty("start");
      expect(parsed.start?.toString()).not.toBe("Invalid Date");
    }
  });

  await t.step("Parse range dates", () => {
    const dates = [
      "October 03 to 08, 2024",
      "October 25-27, 2024",
      "October 04 - 13, 2024",
      "September 20 - October 13, 2024",
      "October 27 to 28, 2024",
    ];
    for (const date of dates) {
      const parsed = parseEnglishDate(date);
      expect(parsed).toHaveProperty("start");
      expect(parsed.start?.toString()).not.toBe("Invalid Date");
    }
  });

  await t.step("parse exceptions", () => {
    const dates = [
      "November 22, 2024 - January 12, 2025",
      "January 24 - February 2, 2025",
      "November 23, 2024 - April 6, 2025",
    ];

    const correct = [
      {
        start: new Date("2024-11-22T06:00:00+01:00"),
        end: new Date("2025-01-12T06:00:00+01:00"),
        locale: "en",
        originalString: "November 22, 2024 - January 12, 2025",
      },
      {
        start: new Date("2025-01-24T06:00:00+01:00"),
        end: new Date("2025-02-02T06:00:00+01:00"),
        locale: "en",
        originalString: "January 24 - February 2, 2025",
      },
      {
        // daylight savings from April to October
        start: new Date("2024-11-23T06:00:00+01:00"),
        end: new Date("2025-04-06T06:00:00+01:00"),
        locale: "en",
        originalString: "November 23, 2024 - April 6, 2025",
      },
    ];

    for (let i = 0; i < dates.length; i++) {
      expect(parseEnglishDate(dates[i])).toMatchObject(correct[i]);
    }
  });
});

Deno.test("Parse dates in German", async (t) => {
  await t.step("Parse single dates", () => {
    const dates = [
      "1. Oktober 2024",
      "01. Oktober 2024",
      "11. Oktober 2024",
    ];
    for (const date of dates) {
      const parsed = parseGermanDate(date);
      expect(parsed).toHaveProperty("start");
      expect(parsed.start?.toString()).not.toBe("Invalid Date");
    }
  });

  await t.step("Parse range dates", () => {
    const dates = [
      "07. bis 13. Oktober 2024",
      "31. Oktober bis 03. November 2024",
    ];
    for (const date of dates) {
      const parsed = parseGermanDate(date);
      expect(parsed).toHaveProperty("start");
      expect(parsed.start?.toString()).not.toBe("Invalid Date");
    }
  });

  await t.step("parse exceptions", () => {
    const dates = [
      "22. November 2024 bis 12. Januar 2025",
      "17. Januar bis 22. März 2025",
      "09. bis 25 Januar 2025",
    ];

    const correct = [
      {
        start: new Date("2024-11-22T06:00:00+01:00"),
        end: new Date("2025-01-12T06:00:00+01:00"),
        locale: "de",
        originalString: "22. November 2024 bis 12. Januar 2025",
      },
      {
        start: new Date("2025-01-17T06:00:00+01:00"),
        end: new Date("2025-03-22T06:00:00+01:00"),
        locale: "de",
        originalString: "17. Januar bis 22. März 2025",
      },
      {
        start: new Date("2025-01-09T06:00:00+01:00"),
        end: new Date("2025-01-25T06:00:00+01:00"),
        locale: "de",
        originalString: "09. bis 25 Januar 2025",
      },
    ];

    for (let i = 0; i < dates.length; i++) {
      expect(parseGermanDate(dates[i])).toMatchObject(correct[i]);
    }
  });
});
