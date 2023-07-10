const { pg, redis, logger, queryUtility, JSONUTIL } = require("ticketing-system-micro-common");
const { VISIT_QUERIES } = require('../constants/QUERY');

const createVisit = async (visitData) => {
    try {
        const query = {
            text: VISIT_QUERIES.createVisit,
            values: [visitData.ticket_id, visitData.visit_type, visitData.visit_date, visitData.visit_by, visitData.remarks, visitData.created_by, visitData.updated_by]
        }
        const result = await pg.executeQueryPromise(query);
        return result
    } catch (error) {
        throw error
    }
}

const getVisit = async (visit_id) => {
    try {
        const _query = {
            text: VISIT_QUERIES.getVisit,
            values: [visit_id]
        }
        console.log(_query);
        const data = await pg.executeQueryPromise(_query);
        return data[0];
    } catch (error) {
        throw error
    }
}

const getAllVisits = async (ticket_id) => {
    try {
        const cacheKey = `Visits|${ticket_id}`;
        let isCached = false;
        const cachedData = await redis.GetKeyRedis(cacheKey);
        const isVisitUpdated = await visitAddUpdateCheck(ticket_id);
        isCached = (cachedData) && (isVisitUpdated == 0) ? true : false;

        if (isCached) {
            const result = JSON.parse(cachedData);
            return result;
        }

        const _query = {
            text: VISIT_QUERIES.getAllVisits,
            values: [ticket_id]
        }

        const data = await pg.executeQueryPromise(_query);
        const visitsObj = data.reduce((pv, cv) => {
            const visit_id = pv[cv.visit_id];
            if (visit_id) {
                if (!visit_id.documents.some(d => d.visit_doc_id == cv.visit_doc_id)) {
                    const temp = {
                        visit_doc_id: cv.visit_doc_id,
                        doc_title: cv.doc_title,
                        doc_url: cv.doc_url,
                        doc_status: cv.doc_status
                    }
                    visit_id.documents.push(temp)
                }
            } else {
                const tempJSON = {
                    visit_id: cv.visit_id,
                    ticket_id: cv.ticket_id,
                    visit_type: cv.visit_type,
                    visit_date: cv.visit_date,
                    visit_by: cv.visit_by,
                    remarks: cv.remarks,
                    status: cv.status,
                    documents: []
                }

                if (cv.visit_doc_id) {
                    const temp = {
                        visit_doc_id: cv.visit_doc_id,
                        doc_title: cv.doc_title,
                        doc_url: cv.doc_url,
                        doc_status: cv.doc_status
                    }

                    tempJSON.documents.push(temp)
                }
                pv[cv.visit_id] = tempJSON;
            }
            return pv
        }, {})

        const visitsArr = []
        for (const key in visitsObj) {
            visitsArr.push(visitsObj[key])
        }

        redis.SetRedis(cacheKey, visitsArr, 10 * 60).then().catch(err => console.log(err));

        return visitsArr;
    } catch (error) {
        throw error
    }
}

const visitAddUpdateCheck = async (ticket_id) => {

    try {
        const _query = {
            text: VISIT_QUERIES.visitAddUpdateCheck,
            values: [ticket_id]
        }
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);

    } catch (error) {
        throw error;
    }

}

const checkVisitIdExists = async (visit_id) => {
    try {
        const _query = {
            text: VISIT_QUERIES.checkVisitIdExists,
            values: [visit_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count) > 0 ? true : false;
    } catch (error) {
        throw error
    }
}

const getDocument = async (visit_id) => {
    try {

        const _query = {
            text: VISIT_QUERIES.getDocuments,
            values: [visit_id]
        }

        console.log(_query);
        const data = await pg.executeQueryPromise(_query);
        return data;

    } catch (error) {
        throw error
    }
}

const insertDocuments = async (docData) => {
    try {

        let _query = {
            text: VISIT_QUERIES.insertDocuments,
            values: [docData.visit_id, docData.doc_title, docData.doc_url, docData.user_id]
        };

        console.log(_query);

        const result = await pg.executeQueryPromise(_query);
        console.log('result', result);
        return result[0]

    } catch (error) {
        console.log(error);
        throw error
    }
}

const getDocumentDetails = async (visit_doc_id) => {
    try {

        const _query = {
            text: VISIT_QUERIES.getDocumentDetails,
            values: [visit_doc_id]
        };

        console.log(_query);

        const result = await pg.executeQueryPromise(_query);
        console.log('result', result);
        return result[0]

    } catch (error) {
        console.log(error);
        throw error
    }
}

module.exports = {
    createVisit,
    getVisit,
    checkVisitIdExists,
    insertDocuments,
    getDocument,
    getDocumentDetails,
    getAllVisits
}