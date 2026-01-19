import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items, customer, total } = await request.json();
    
    const accessToken = process.env.MP_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Credenciales de Mercado Pago no configuradas' },
        { status: 500 }
      );
    }

    // Preparar items para Mercado Pago
    const mpItems = items.map((item: any) => ({
      title: item.product.nombre,
      description: `Ref: ${item.product.referencia}`,
      quantity: item.quantity,
      unit_price: item.product.precio,
      currency_id: 'ARS', // Pesos argentinos
    }));

    // Crear preferencia de pago
    const preference = {
      items: mpItems,
      payer: {
        name: customer.name,
        email: customer.email,
        phone: {
          number: customer.phone,
        },
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
      },
      auto_return: 'approved' as const,
      statement_descriptor: 'SAN GABRIEL',
      external_reference: `pedido-${Date.now()}`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      metadata: {
        customer_notes: customer.notes || '',
      },
    };

    // Llamar a la API de Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Mercado Pago:', errorData);
      return NextResponse.json(
        { error: 'Error al crear el pago en Mercado Pago', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      init_point: data.init_point, // URL para abrir Mercado Pago
      sandbox_init_point: data.sandbox_init_point, // URL para pruebas
      preference_id: data.id,
    });

  } catch (error) {
    console.error('Error en create-payment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    );
  }
}
