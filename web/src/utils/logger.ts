//THIRD PARTY MODULES
import { createLogger, format, transports } from "winston";

const { combine, timestamp, label, printf, colorize, errors, json, splat } =
	format;

const COMBINED_LOG_FILE_PATH = "./log/combined.log";

const myFormat = printf(
	({ level, message, label, timestamp, stack, ...metadata }) => {
		const extraData = Object.keys(metadata).length
			? `\n[metadata]: ${JSON.stringify(metadata)} `
			: "";

		return `${timestamp} [${label}] ${level.toUpperCase()}: ${
			stack || message
		} ${extraData}`;
	},
);

const getLogger = (prefix: string) => {
	const consoleTransport = new transports.Console({
		format: combine(
			label({ label: prefix }),
			timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
			errors({ stack: true }),
			myFormat,
			splat(),
			colorize({
				all: true,
				colors: { info: "green", error: "red", warn: "yellow", debug: "blue" },
			}),
		),
	});

	const fileLogTransport = new transports.File({
		format: combine(
			timestamp(),
			label({ label: prefix }),
			errors({ stack: true }),
			json(),
		),
		filename: COMBINED_LOG_FILE_PATH,
	});

	const logger = createLogger({
		level: process.env.NODE_ENV === "development" ? "debug" : "info",
		transports: [consoleTransport, fileLogTransport],
	});

	return logger;
};

export default getLogger;
