# Berlin Event Scraper

Written in Typescript with Deno

## Purpose

This scraper fetch events from _berlin.de_ to build json files so that it can be
consumed in the sibling project,
[berlin-event-calendar](https://github.com/songhui-ryu/berlin-event-calendar)

The scapping is triggered weekly by Github Actions.

## Event file format

Each event element is in the following format.

Note that some events are missing _date_ only because the website does not
specify them (mainly because the element is an entry to a ticket site or
collections of events).

```JSON
{
    "name": "New Year's Eve Party at the Brandenburg Gate",
    "date": {
      "start": "2024-12-30T23:00:00.000Z",
      "end": "2024-12-30T23:00:00.000Z",
      "locale": "en",
      "originalString": "December 31, 2024"
    },
    "description": "Music, stars and entertainment: With a huge open-air party at the Brandenburg Gate, Berlin rings in the new year.",
    "href": "https://www.berlin.de/en/events/3303144-2842498-new-years-eve-party-brandenburg-gate.en.html"
},
```

## Events in English and German

This scraper fetches events from the English page and the German page
separately.

    - https://www.berlin.de/en/events/
    - https://www.berlin.de/events/jahresuebersicht/

Sadly, in most cases the event items in English and are not the same with each
other.

TODO: Two events will be compared to build a complete list both in English and
German.
