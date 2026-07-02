import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SHOP_DOMAIN = 'boletarotisseria.myshopify.com';
const API_VERSION = '2025-07';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { orderId, fulfillmentDate, fulfillmentTime } = await req.json();

    if (!orderId || !fulfillmentDate) {
      return new Response(JSON.stringify({ error: 'orderId and fulfillmentDate are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = Deno.env.get('SHOPIFY_ADMIN_TOKEN');
    if (!token) {
      return new Response(JSON.stringify({ error: 'SHOPIFY_ADMIN_TOKEN not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const numericId = String(orderId).replace(/\D/g, '');
    const deliveryTag = `entrega-${fulfillmentDate}`;

    // Fetch existing tags first
    const getResp = await fetch(
      `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/orders/${numericId}.json?fields=id,tags`,
      { headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' } }
    );
    if (!getResp.ok) {
      const text = await getResp.text();
      return new Response(JSON.stringify({ error: 'Failed to fetch order', details: text }), {
        status: getResp.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const getData = await getResp.json();
    const existingTags: string = getData?.order?.tags ?? '';
    const tagList = existingTags.split(',').map((t: string) => t.trim()).filter(Boolean);
    if (!tagList.includes(deliveryTag)) tagList.push(deliveryTag);
    if (fulfillmentTime) {
      const timeTag = `horario-${fulfillmentTime.replace(':', 'h')}`;
      if (!tagList.includes(timeTag)) tagList.push(timeTag);
    }

    const putResp = await fetch(
      `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/orders/${numericId}.json`,
      {
        method: 'PUT',
        headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: { id: Number(numericId), tags: tagList.join(', ') } }),
      }
    );

    if (!putResp.ok) {
      const text = await putResp.text();
      return new Response(JSON.stringify({ error: 'Failed to update order', details: text }), {
        status: putResp.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const putData = await putResp.json();

    // Reschedule fulfillment_orders to populate "Processar por" (fulfill_by)
    let rescheduleResult: unknown = null;
    try {
      const startTime = (fulfillmentTime ? String(fulfillmentTime).split(/[-–]/)[0].trim() : '10:00');
      const hhmm = /^\d{1,2}:\d{2}$/.test(startTime) ? startTime.padStart(5, '0') : '10:00';
      const newFulfillAt = `${fulfillmentDate}T${hhmm}:00-03:00`;

      const foResp = await fetch(
        `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/orders/${numericId}/fulfillment_orders.json`,
        { headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' } }
      );
      if (foResp.ok) {
        const foData = await foResp.json();
        const foIds: number[] = (foData?.fulfillment_orders ?? []).map((fo: any) => fo.id);
        const results = [];
        for (const foId of foIds) {
          const rr = await fetch(
            `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/fulfillment_orders/${foId}/reschedule.json`,
            {
              method: 'POST',
              headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
              body: JSON.stringify({ fulfillment_order: { new_fulfill_at: newFulfillAt } }),
            }
          );
          const rrText = await rr.text();
          results.push({ foId, status: rr.status, body: rrText.slice(0, 200) });
        }
        rescheduleResult = { newFulfillAt, results };
      } else {
        rescheduleResult = { error: 'failed to fetch fulfillment_orders', status: foResp.status };
        await foResp.text();
      }
    } catch (e) {
      rescheduleResult = { error: (e as Error).message };
    }

    return new Response(JSON.stringify({ success: true, tags: putData?.order?.tags, reschedule: rescheduleResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
