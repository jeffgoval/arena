# Edge Function: close-game

Automatically closes games 2 hours before start time by consolidating payments and confirming reservations.

## What it does

1. **Finds games to close**: Searches for reservations 2 hours before start time with status 'pendente'
2. **Calculates amounts**: Sums participant payments and calculates organizer's remaining portion
3. **Processes payment**:
   - If pre-authorization exists: Captures partial amount (organizer's portion)
   - If no pre-authorization: Charges organizer's balance
4. **Confirms reservation**: Updates status to 'confirmada'
5. **Sends notifications**: Notifies organizer and participants (TODO)

## Deployment

### 1. Deploy to Supabase

```bash
# Deploy the function
supabase functions deploy close-game

# Set environment variables
supabase secrets set ASAAS_API_KEY=your_asaas_key
supabase secrets set ASAAS_ENVIRONMENT=sandbox # or production
supabase secrets set CRON_SECRET_TOKEN=your_secret_token
```

### 2. Configure Cron Job

In Supabase Dashboard → Edge Functions → close-game:

**Cron Schedule:** `0 * * * *` (every hour)

**Environment Variables:**
- `SUPABASE_URL` (auto-configured)
- `SUPABASE_SERVICE_ROLE_KEY` (auto-configured)
- `ASAAS_API_KEY` (your Asaas API key)
- `ASAAS_ENVIRONMENT` ('sandbox' or 'production')
- `CRON_SECRET_TOKEN` (random secure token for authentication)

### 3. Test Locally

```bash
# Start function locally
supabase functions serve close-game

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/close-game' \
  --header 'Authorization: Bearer YOUR_CRON_SECRET' \
  --header 'Content-Type: application/json'
```

### 4. Manual Invocation

You can manually trigger the function via API:

```bash
curl -i --location --request POST 'https://your-project.supabase.co/functions/v1/close-game' \
  --header 'Authorization: Bearer YOUR_CRON_SECRET' \
  --header 'Content-Type: application/json'
```

## Security

- Function requires `CRON_SECRET_TOKEN` in Authorization header
- Uses Supabase Service Role Key for database access
- Only processes reservations in specific time window (2 hours before game)

## Monitoring

Check Edge Function logs in Supabase Dashboard:
- Successful closures: `✅ Reservation {id} closed successfully`
- Errors: `❌ Error processing reservation {id}`
- Summary: `{ processed: X, errors: Y, total: Z }`

## Error Handling

Function logs errors to `edge_function_logs` table (needs to be created):

```sql
CREATE TABLE edge_function_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name TEXT NOT NULL,
  reservation_id UUID REFERENCES reservas(id),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Future Improvements

- [ ] Integrate with notification service (WhatsApp, Email)
- [ ] Add retry mechanism for failed captures
- [ ] Send detailed closure summary to organizer
- [ ] Handle edge cases (all participants free, organizer with 0 to pay)
