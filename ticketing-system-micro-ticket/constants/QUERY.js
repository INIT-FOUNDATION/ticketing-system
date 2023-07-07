exports.TICKET_QUERIES = {
    checkTicketNumberExists: `SELECT COUNT(*) AS count FROM m_tickets WHERE ticket_number = $1`,
    createTicket: `INSERT INTO public.m_tickets( ticket_number, ticket_mode, product_id, description, opening_date, closing_date, remarks, status, date_created, date_modified, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), $9, $10) RETURNING ticket_id;`,
    getTicketCount: `SELECT COUNT(*) AS count FROM vw_m_tickets #WHERE_CLAUSE#`,
    getTicketList: `SELECT * FROM vw_m_tickets #WHERE_CLAUSE# ORDER BY date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#;`,
    getTicket: `SELECT * FROM vw_m_tickets WHERE ticket_id = $1`
}

