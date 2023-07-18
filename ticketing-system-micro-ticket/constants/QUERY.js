exports.TICKET_QUERIES = {
    checkTicketNumberExists: `SELECT COUNT(*) AS count FROM m_tickets WHERE ticket_number = $1`,
    createTicket: `INSERT INTO public.m_tickets( ticket_number, ticket_mode, product_id, description, opening_date, closing_date, remarks, status, date_created, date_modified, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), $9, $10) RETURNING ticket_id;`,
    getTicketCount: `SELECT COUNT(*) AS count FROM vw_m_tickets #WHERE_CLAUSE#`,
    getTicketList: `SELECT ticket_id, ticket_number, ticket_mode, opening_date, closing_date, status FROM vw_m_tickets #WHERE_CLAUSE# ORDER BY date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#;`,
    getTicket: `SELECT  ticket_id, ticket_number, ticket_mode, description, remarks, opening_date, closing_date, status, product_id, product_name, serial_number, model_number, installation_date, vendor_id, vendor_name, vendor_contact_name, vendor_contact_number, email_id, site_id, site_name, site_type, address,
    site_code, primary_contact_name, primary_contact_number, secondary_contact_name, secondary_contact_number, block_id, block_name, district_id, district_name, state_id, state_name FROM vw_m_tickets WHERE ticket_id = $1`,
    checkTicketIdExists: `SELECT COUNT(*) AS count FROM m_tickets WHERE ticket_id = $1`,
    insertDocuments: `INSERT INTO public.m_ticket_documents(ticket_id, doc_title, doc_url, date_created, date_modified, created_by, updated_by)
        VALUES ($1, $2, $3, NOW(), NOW(), $4, $4) RETURNING doc_id;`,
    getDocuments: `SELECT doc_id, ticket_id, doc_title, doc_url FROM m_ticket_documents WHERE ticket_id = $1`,
    getDocumentDetails: `SELECT doc_id, ticket_id, doc_title, doc_url FROM m_ticket_documents WHERE doc_id = $1`,
}


exports.VISIT_QUERIES = {
    createVisit: `INSERT INTO public.tr_visits(ticket_id, visit_type, visit_date, visit_by, remarks, date_created, date_modified, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7) RETURNING visit_id;`,
    getVisit: `SELECT visit_id, ticket_id, visit_type, visit_date, visit_by, remarks, status FROM tr_visits WHERE visit_id = $1`,
    getAllVisits: `SELECT V.visit_id, V.ticket_id, V.visit_type, V.visit_date, V.visit_by, V.remarks, V.status,
    D.visit_doc_id, D.doc_title, D.doc_url, D.status AS doc_status
    FROM tr_visits V
    LEFT JOIN tr_visit_documents D ON V.visit_id = D.visit_id 
    WHERE V.ticket_id = $1;`,
    checkVisitIdExists: `SELECT COUNT(*) AS count FROM tr_visits WHERE visit_id = $1`,
    insertDocuments: `INSERT INTO public.tr_visit_documents(visit_id, doc_title, doc_url, date_created, date_modified, created_by, updated_by)
    VALUES ($1, $2, $3, NOW(), NOW(), $4, $4) RETURNING visit_doc_id;`,
    getDocuments: `SELECT visit_doc_id, visit_id, doc_title, doc_url FROM tr_visit_documents WHERE visit_id = $1`,
    getDocumentDetails: `SELECT visit_doc_id, visit_id, doc_title, doc_url FROM tr_visit_documents WHERE visit_doc_id = $1`,
    visitAddUpdateCheck:`SELECT COUNT(*) AS count FROM tr_visits WHERE ticket_id =$1
    AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`,
    visitUpdateCheck:`SELECT COUNT(*) AS count FROM tr_visits WHERE visit_id =$1
    AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`
}
