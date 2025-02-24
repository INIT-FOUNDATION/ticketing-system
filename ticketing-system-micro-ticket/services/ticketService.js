const { pg, redis, logger, queryUtility, JSONUTIL } = require("ticketing-system-micro-common");
const { TICKET_QUERIES } = require('../constants/QUERY');

const generateTicketNumber = async () => {
    let isUniqueId = false;

    while (!isUniqueId) {
        const ticket_number = Math.floor(
            100000000000 + Math.random() * 900000000000
        );
        const _query = {
            text: TICKET_QUERIES.checkTicketNumberExists,
            values: [ticket_number],
        };
        const ticketNumberCount = await pg.executeQueryPromise(_query);

        if (!ticketNumberCount[0].count == 0) {
            isUniqueId = true;
            return ticket_number;
        }
    }
};

const createTicket = async (ticketData) => {
    try {

        const query = {
            text: TICKET_QUERIES.createTicket,
            values: [ticketData.ticket_number, ticketData.ticket_mode, ticketData.product_id, ticketData.description, ticketData.opening_date, ticketData.closing_date, ticketData.remarks, ticketData.status, ticketData.created_by, ticketData.updated_by]
        }

        const result = await pg.executeQueryPromise(query);
        return result

    } catch (error) {
        throw error
    }
}

const updateTicket = async (ticketData) => {
    try {
        const ticket_id = ticketData.ticket_id;
        delete ticketData.ticket_id;
        const setQuery = queryUtility.convertObjectIntoUpdateQuery(ticketData)
        const query = `UPDATE m_tickets SET ${setQuery}, date_modified = NOW() WHERE ticket_id = ${ticket_id}`;
        console.log(query);
        const result = await pg.executeQueryPromise(query);
        return result
    } catch (error) {
        throw error
    }
}

const getTicketList = async (reqParams) => {
    try {

        let key = `Tickets`;
        let whereClause = `WHERE 1=1`;
        let limitClause = ''
        let offsetClause = '';
        let data, count;
        let isCached = false;

        if (reqParams.ticket_mode) {
            key += `|Tckt_Mode:${reqParams.ticket_mode}`;
            whereClause += ` AND ticket_mode=${reqParams.ticket_mode}`;
        }

        if (reqParams.product_id) {
            key += `|Prod:${reqParams.product_id}`;
            whereClause += ` AND product_id=${reqParams.product_id}`;
        }

        if (reqParams.ticket_number) {
            key += `|Ticket_No:${reqParams.ticket_number}`;
            whereClause += ` AND ticket_number='${reqParams.ticket_number}'`;
        }

        if (reqParams.pageSize) {
            key += `|Size:${reqParams.pageSize}`;
            limitClause = ` LIMIT ${reqParams.pageSize}`;
        }

        if (reqParams.currentPage) {
            key += `|Offset:${reqParams.currentPage}`;
            offsetClause += ` OFFSET ${reqParams.currentPage}`;
        }

        console.log(key);

        const cachedData = await redis.GetKeyRedis(key);
        const isUserUpdated = await ticketAddUpdateCheck(whereClause);
        isCached = (cachedData) && (isUserUpdated == 0) ? true : false;


        if (isCached) {
            data = JSON.parse(cachedData);
            const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
            count = parseInt(JSON.parse(cachedCount));
            return { data, count };
        }

        const replaceObj = {
            '#WHERE_CLAUSE#': whereClause,
            '#LIMIT_CLAUSE#': limitClause,
            '#OFFSET_CLAUSE#': offsetClause
        };

        const _query = JSONUTIL.replaceAll(TICKET_QUERIES.getTicketList, replaceObj);

        console.log(_query);

        count = await getAllTicketCount(whereClause);
        redis.SetRedis(`Count|${key}`, count, 10 * 60).then().catch(err => console.log(err));
        data = await pg.executeQueryPromise(_query);
        redis.SetRedis(key, data, 10 * 60).then().catch(err => console.log(err));

        return { data, count };

    } catch (error) {
        throw error;
    }
}

const ticketAddUpdateCheck = async (whereClause) => {

    try {

        whereClause += ` AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`;

        const _query = TICKET_QUERIES.getTicketCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);

    } catch (error) {
        throw error;
    }

}

const getAllTicketCount = async (whereClause) => {
    try {

        const _query = TICKET_QUERIES.getTicketCount.replace('#WHERE_CLAUSE#', whereClause);
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);

    } catch (error) {
        throw new Error(error.message);
    }
}

const getTicket = async (ticket_id) => {
    try {
        const cacheKey = `Ticket_${ticket_id}`;
        let isCached = false;
        const cachedData = await redis.GetKeyRedis(cacheKey);
        const isVisitUpdated = await visitUpdateCheck(visit_id);
        isCached = (cachedData) && (isVisitUpdated == 0) ? true : false;

        if (isCached) {
            console.log('From the Cache');
            const result = JSON.parse(cachedData);
            return result;
        }

        const _query = {
            text: TICKET_QUERIES.getTicket,
            values: [ticket_id]
        }

        console.log(_query);
        const data = await pg.executeQueryPromise(_query);
        return data[0];

    } catch (error) {
        throw error
    }
}

const ticketUpdateCheck = async (ticket_id) => {
    try {
        const _query = {
            text: TICKET_QUERIES.visitUpdateCheck,
            values: [visit_id]
        }
        console.log('Check Query');
        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count);
    } catch (error) {
        throw error;
    }
}


const checkTicketIdExists = async (ticket_id) => {
    try {

        const _query = {
            text: TICKET_QUERIES.checkTicketIdExists,
            values: [ticket_id]
        }

        const queryResult = await pg.executeQueryPromise(_query);
        return parseInt(queryResult[0].count) > 0 ? true : false;

    } catch (error) {
        throw error
    }
}


const getDocument = async (ticket_id) => {
    try {

        const _query = {
            text: TICKET_QUERIES.getDocuments,
            values: [ticket_id]
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
            text: TICKET_QUERIES.insertDocuments,
            values: [docData.ticket_id, docData.doc_title, docData.doc_url, docData.user_id]
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

const getDocumentDetails = async (doc_id) => {
    try {

        const _query = {
            text: TICKET_QUERIES.getDocumentDetails,
            values: [doc_id]
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
    generateTicketNumber,
    createTicket,
    updateTicket,
    getTicketList,
    getTicket,
    checkTicketIdExists,
    insertDocuments,
    getDocument,
    getDocumentDetails
}