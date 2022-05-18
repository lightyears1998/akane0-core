import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export const MIRAI_HOST = process.env.MIRAI_HOST;
export const MIRAI_HTTP_BASIC_AUTH = process.env.MIRAI_HTTP_BASIC_AUTH;
export const MIRAI_VERIFY_KEY = process.env.MIRAI_VERIFY_KEY;
export const MIRAI_HTTP_PORT = process.env.MIRAI_HTTP_PORT;
export const MIRAI_WS_PORT = process.env.MIRAI_WS_PORT;
export const MIRAI_ADAPTER_QQ = process.env.MIRAI_ADAPTER_QQ;
export const MIRAI_MASTER_QQ = process.env.MIRAI_MASTER_QQ;
