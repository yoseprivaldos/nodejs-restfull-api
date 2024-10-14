import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

web.listen(3000, () => {
    logger.info(`App Start on port ${3000}`);
});
