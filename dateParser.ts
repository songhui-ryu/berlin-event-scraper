/**
 * Date utils
 */

export type DateRange = {
    start: Date | undefined;
    end: Date | undefined;
    locale: "en" | "de" | undefined;
    originalString: string;
};

/**
 * Parse english date string from berlin.de.
 * Note: The format of the date has no dedicated rules. So keep an eye on it!
 * @param {string} date
 * @returns {DateRange}
 */
export function parseEnglishDate(date: string): DateRange {
    let startDate: Date;
    let endDate: Date;

    // Regex for English dates
    const englishSingleDateRegex = /([a-zA-Z]+)\s*(\d{1,2}),?\s*(\d{4})/;
    const englishRangeRegex =
        /([a-zA-Z]+)\s*(\d{1,2})\s*(?:to|and|-)\s*([a-zA-Z]*)\s*(\d{1,2}),?\s*(\d{4})/;

    // Check for English range
    if (englishRangeRegex.test(date)) {
        const match = date.match(englishRangeRegex);
        if (match) {
            startDate = new Date(
                `${match[5]}-${getMonthIndex(match[1])}-${match[2]}T00:00:00`,
            );

            const endMonthString = match[3]
                ? getMonthIndex(match[3])
                : getMonthIndex(match[1]);

            endDate = new Date(
                `${match[5]}-${endMonthString}-${match[4]}T00:00:00`,
            );

            return {
                start: startDate,
                end: endDate,
                locale: "en",
                originalString: date,
            };
        }
    }

    // Check for English single
    if (englishSingleDateRegex.test(date)) {
        const match = date.match(englishSingleDateRegex);
        if (match) {
            if (match[2].length == 1) {
                match[2] = `0${match[2]}`;
            }

            startDate = new Date(
                `${match[3]}-${getMonthIndex(match[1])}-${match[2]}T00:00:00`,
            );

            endDate = new Date(startDate);

            return {
                start: startDate,
                end: endDate,
                locale: "en",
                originalString: date,
            };
        }
    }

    return {
        start: undefined,
        end: undefined,
        locale: undefined,
        originalString: date,
    };
}

/**
 * Parse german date string from berlin.de.
 * Note: The format of the date has no dedicated rules. So keep an eye on it!
 * @param {string} date
 * @returns {DateRange}
 */
export function parseGermanDate(date: string): DateRange {
    let startDate: Date;
    let endDate: Date;

    // Regex for German dates
    const germanSingleDateRegex = /(\d{1,2})\.\s*(\w+)\s*(\d{4})/;
    const germanRangeRegex =
        /(\d{1,2})\.\s*([a-zA-Z]+)?\s*bis\s*(\d{1,2})\.\s*(\w+)\s*(\d{4})/;

    // Check for German range
    if (germanRangeRegex.test(date)) {
        const match = date.match(germanRangeRegex);
        if (match) {
            const startMonthString = match[2]
                ? getMonthIndex(match[2])
                : getMonthIndex(match[4]);

            startDate = new Date(
                `${match[5]}-${startMonthString}-${match[1]}T00:00:00`,
            );

            endDate = new Date(
                `${match[5]}-${getMonthIndex(match[4])}-${match[3]}T00:00:00`,
            );

            return {
                start: startDate,
                end: endDate,
                locale: "de",
                originalString: date,
            };
        }
    }

    // Check for German single
    if (germanSingleDateRegex.test(date)) {
        const match = date.match(germanSingleDateRegex);
        if (match) {
            if (match[1].length == 1) {
                match[1] = `0${match[1]}`;
            }
            startDate = new Date(
                `${match[3]}-${getMonthIndex(match[2])}-${match[1]}T00:00:00`,
            );

            endDate = new Date(startDate);

            return {
                start: startDate,
                end: endDate,
                locale: "de",
                originalString: date,
            };
        }
    }
    return {
        start: undefined,
        end: undefined,
        locale: undefined,
        originalString: date,
    };
}

/**
 * Get month index from month name
 * @param {string} month
 * @returns {string}
 */
export function getMonthIndex(month: string): string {
    const months: { [key: string]: string } = {
        "January": "01",
        "February": "02",
        "March": "03",
        "April": "04",
        "May": "05",
        "June": "06",
        "July": "07",
        "August": "08",
        "September": "09",
        "October": "10",
        "November": "11",
        "December": "12",
        "Januar": "01",
        "Februar": "02",
        "März": "03",
        "Mai": "05",
        "Juni": "06",
        "Juli": "07",
        "Oktober": "10",
        "Dezember": "12",
    };
    return months[month] || "";
}

/**
 * Get month name from month index
 * @param {number} monthIndex
 * @param {string} lang
 * @returns {string}
 */
export function getMonthName(monthIndex: number, lang: "en" | "de"): string {
    const months = [
        ["january", "januar"],
        ["february", "februar"],
        ["march", "maerz"],
        ["april", "april"],
        ["may", "mai"],
        ["june", "juni"],
        ["july", "juli"],
        ["august", "august"],
        ["september", "september"],
        ["october", "oktober"],
        ["november", "november"],
        ["december", "dezember"],
    ];

    const monthName = months[monthIndex];
    return lang == "en" ? monthName[0] : monthName[1];
}
