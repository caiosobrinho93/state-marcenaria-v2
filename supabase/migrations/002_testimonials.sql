-- Apply after 001_initial.sql. Existing RLS also protects testimonial records.
alter table public.entries drop constraint entries_kind_check;
alter table public.entries add constraint entries_kind_check
  check (kind in ('material','project','category','manufacturer','testimonial'));
-- For testimonials: title = client-approved display name,
-- category = approved context, description = exact authorized testimonial.
-- Draft by default; only publish with the client's permission.
