-- The calibration session type was removed, so rows that still have it can't
-- be represented by the API or the client.
DELETE FROM "sessions" WHERE "type" = 'calibration';
