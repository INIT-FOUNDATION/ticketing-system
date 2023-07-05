CREATE FUNCTION update_date_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.date_modified = NOW();
    RETURN NEW;
  END;
$$;