CREATE INDEX idx_sites_block_id ON m_sites (block_id);
CREATE INDEX idx_products_site_id ON m_products (site_id);
CREATE INDEX idx_products_vendor_id ON m_products (vendor_id);
CREATE INDEX idx_products_serial_number ON m_products (serial_number);
CREATE INDEX idx_products_model_number ON m_products (model_number);
CREATE INDEX idx_tickets_ticket_number ON m_tickets (ticket_number);
CREATE INDEX idx_tickets_product_id ON m_tickets (product_id);
CREATE INDEX idx_ticket_documents_ticket_id ON m_ticket_documents (ticket_id);
CREATE INDEX idx_visits_ticket_id ON tr_visits (ticket_id);
CREATE INDEX idx_visit_documents_visit_id ON tr_visit_documents (visit_id);