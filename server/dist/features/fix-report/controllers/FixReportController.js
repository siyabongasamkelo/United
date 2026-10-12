"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixReportController = void 0;
const FixReportService_1 = require("../services/FixReportService");
class FixReportController {
    fixReportService;
    constructor() {
        this.fixReportService = new FixReportService_1.FixReportService();
    }
    logFaultReport = async (req, res, next) => {
        try {
            // Safely pull the reporting employee ID straight out of the hydrated session profile pipeline context
            const localUserId = req.user?._id;
            const result = await this.fixReportService.processNewFaultReport(req.body, String(localUserId));
            res.status(201).json({
                success: true,
                message: "Defective asset safely registered inside operational maintenance queue logs.",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getActiveQueue = async (req, res, next) => {
        try {
            const activeQueueList = await this.fixReportService.retrieveActiveQueue();
            res.status(200).json({
                success: true,
                count: activeQueueList.length,
                data: activeQueueList,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.FixReportController = FixReportController;
