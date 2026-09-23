/**
 * CONFIGURACIÓN DE MATI STORE
 */
const STORE_CONFIG = {
    // Nombre de la tienda
    storeName: "Mati Store",
    bannerTitle: "Tienda Online",

    // Moneda: Pesos Argentinos ($)
    currencySymbol: "$",

    // Número de WhatsApp para pedidos directos (11 6798-3365)
    whatsappPhone: "5491167983365",
    whatsappDisplayPhone: "11 6798-3365",

    // Mensaje automático al comprar
    whatsappMessagePrefix: "Hola, me interesa comprar: ",

    // Categorías solicitadas (solo Todos, Negro y Marrón)
    categories: [
        { id: "all", label: "Todos" },
        { id: "negro", label: "Negro" },
        { id: "marron", label: "Marrón" }
    ]
};
