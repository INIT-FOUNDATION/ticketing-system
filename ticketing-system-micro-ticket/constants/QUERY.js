exports.TICKET_QUERIES = {
    checkTicketNumberExists: `SELECT COUNT(*) AS count FROM m_tickets WHERE ticket_number = $1`,
    createTicket: `INSERT INTO public.m_tickets( ticket_number, ticket_mode, product_id, description, opening_date, closing_date, remarks, status, date_created, date_modified, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), $9, $10) RETURNING ticket_id;`,
    getTicketCount: `SELECT COUNT(*) AS count FROM vw_m_tickets #WHERE_CLAUSE#`,
    getTicketList: `SELECT * FROM vw_m_tickets #WHERE_CLAUSE# ORDER BY date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#;`,
    getTicket: `SELECT * FROM vw_m_tickets WHERE ticket_id = $1`,
    checkTicketIdExists: `SELECT COUNT(*) AS count FROM m_tickets WHERE ticket_id = $1`,
    insertDocuments: `INSERT INTO public.m_ticket_documents(ticket_id, doc_title, doc_url, date_created, date_modified, created_by, updated_by)
        VALUES ($1, $2, $3, NOW(), NOW(), $4, $4) RETURNING doc_id;`,
    getDocuments: `SELECT * FROM m_ticket_documents WHERE ticket_id = $1`,
}


exports.VISIT_QUERIES = {
    createVisit: `INSERT INTO public.tr_visits(ticket_id, visit_type, visit_date, visit_by, remarks, date_created, date_modified, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7) RETURNING visit_id;`,
    getVisit: `SELECT * FROM tr_visits WHERE visit_id = $1`,
}
