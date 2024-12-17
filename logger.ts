import * as log from "@std/log";

log.setup({
    handlers: {
        console: new log.ConsoleHandler("DEBUG", {
            formatter: (record) =>
                `${record.levelName} ${record.datetime.toISOString()} ${record.msg}`,
        }),
        file: new log.FileHandler("WARN", {
            filename: "./parse_log.txt",
            formatter: (record) => record.msg,
        }),
    },
    loggers: {
        default: {
            level: "DEBUG",
            handlers: ["console", "file"],
        },
        parser: {
            level: "WARN",
            handlers: ["file"],
        },
    },
});
