import { dbTool } from "../../tools/db/index.js";
import { storageTool } from "../../tools/storage/index.js";
import { pdfTool } from "../../tools/pdf/index.js";
import { messagesTool } from "../../tools/messages/index.js";
import { searchTool } from "../../tools/search/index.js";

export const toolRegistry = {
    db: dbTool,
    storage: storageTool,
    pdf: pdfTool,
    messages: messagesTool,
    search: searchTool,
};
