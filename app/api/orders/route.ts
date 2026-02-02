import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSheetsClient, getSpreadsheetId } from "@/lib/googleSheets";

// Column indices for orders sheet (0-indexed)
// A: created_at, B: order_id, C: plan_id, D: plan_name, E: customer_name,
// F: phone, G: email, H: city, I: pay_method, J: pay_type, K: amount,
// L: payment_status, M: proof_url, N: notes, O: status, P: brief_completed

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");
    const email = searchParams.get("email");

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "orders!A:P",
    });

    const rows = response.data.values || [];
    
    // Skip header row if present
    const dataRows = rows.length > 0 && rows[0][0] === "created_at" ? rows.slice(1) : rows;

    const orders = dataRows.map((row) => ({
      id: row[1] || "",
      planId: row[2] || "",
      planName: row[3] || "",
      customerName: row[4] || "",
      customerPhone: row[5] || "",
      customerEmail: row[6] || "",
      city: row[7] || "",
      paymentMethod: row[8] || "",
      payType: row[9] || "",
      totalPrice: parseFloat(row[10]) || 0,
      paymentStatus: row[11] || "pending",
      paymentProof: row[12] || "",
      notes: row[13] || "",
      status: row[14] || "pending_payment",
      briefCompleted: row[15] === "true",
      createdAt: row[0] || "",
      updatedAt: row[0] || "",
    }));

    // Filter by orderId or email if provided
    let filteredOrders = orders;
    if (orderId) {
      filteredOrders = orders.filter((o) => o.id === orderId);
    } else if (email) {
      filteredOrders = orders.filter(
        (o) => o.customerEmail.toLowerCase() === email.toLowerCase() || 
               o.id.toLowerCase().includes(email.toLowerCase())
      );
    }

    return NextResponse.json({ ok: true, orders: filteredOrders });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      plan_id,
      plan_name,
      customer_name,
      phone,
      email,
      city,
      pay_method,
      pay_type,
      amount,
      notes,
    } = body;

    if (!plan_id || !plan_name || !customer_name || !phone || !pay_method || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order_id = `IW-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
    const created_at = new Date().toISOString();

    const payment_status = "pending";
    const status = "pending_payment";

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "orders!A:P",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          created_at,
          order_id,
          plan_id,
          plan_name,
          customer_name,
          phone,
          email || "",
          city || "",
          pay_method,
          pay_type || "total",
          amount,
          payment_status,
          "", // proof_url
          notes || "",
          status,
          "false", // brief_completed
        ]],
      },
    });

    return NextResponse.json({ ok: true, order_id });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { order_id, brief_completed } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    // Get all orders to find the row index
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "orders!A:P",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[1] === order_id);

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update brief_completed column (P)
    if (brief_completed !== undefined) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `orders!P${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[brief_completed.toString()]],
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
