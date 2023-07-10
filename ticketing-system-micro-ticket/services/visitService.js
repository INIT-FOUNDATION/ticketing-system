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
    getDocumentDetails
}