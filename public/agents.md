# Database Reference – Supabase

## Table: news_snippets

This application reads from the `news_snippets` table in Supabase
and renders a list of active news items.

### Columns Used
- id (int): primary key
- headline (text): title of the news item
- category (text): category label
- source_url (text): external link
- priority (int): used for ordering
- is_active (bool): whether the item should be shown
- created_at (timestamp)

### Notes
- Only rows where `is_active = true` are displayed.
- Data is read using the Supabase anon public key.
