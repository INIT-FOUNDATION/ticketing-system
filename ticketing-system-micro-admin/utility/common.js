const moment = require('moment');
const momentRange = require('moment-range');
const extendendMoment = momentRange.extendMoment(moment);


const doctorRosterService = require('../services/doctorRosterService');
const activitySessionRosterService = require('../services/activitySessionRosterService');
const doctorShiftService = require('../services/doctorShiftService');

const slotOverlapsCheck = async (slotsData, doc_id) => {
    let range1, range2;
    for (const slotData of slotsData) {
        for (const slot of slotData.slots) {
            if (!slot.roster_id || slot.roster_id == '') {
                range1 = extendendMoment.range(moment(slot.start_time), moment(slot.end_time));
                const doctorRosterSlotsByDate = await doctorRosterService.getSlots(doc_id, slotData.slot_date)
                for (const slotByDate of doctorRosterSlotsByDate) {
                    range2 = extendendMoment.range(moment(slotByDate.start_time), moment(slotByDate.end_time));
                    if (range1.overlaps(range2) || range2.overlaps(range1)) {
                        return false;
                    }
                }
                const activitySessionRosterslotsByDate = await activitySessionRosterService.getSlots(doc_id, slotData.slot_date)
                for (const slotByDate of activitySessionRosterslotsByDate) {
                    range2 = extendendMoment.range(moment(slotByDate.start_time), moment(slotByDate.end_time));
                    if (range1.overlaps(range2) || range2.overlaps(range1)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};

const shiftOverlapsCheck = async (shitsData, doc_id) => {
    let range1, range2;
    for (const shiftData of shitsData) {
        for (const shift of shiftData.shifts) {
            if (!shift.shift_id || shift.shift_id == '') {
                range1 = extendendMoment.range(moment(shift.start_time), moment(shift.end_time));
                const doctorShiftsByDate = await doctorShiftService.getShifts(doc_id, shiftData.shift_date)
                for (const shiftByDate of doctorShiftsByDate) {
                    range2 = extendendMoment.range(moment(shiftByDate.start_time), moment(shiftByDate.end_time));
                    if (range1.overlaps(range2) || range2.overlaps(range1)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};


module.exports = {
    slotOverlapsCheck,
    shiftOverlapsCheck
};