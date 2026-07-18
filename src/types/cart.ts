export type CartPenjual = {
    uuid: string;
    nama: string;
};

export type CartProduk = {
    uuid: string;
    nama_produk: string;
    harga: number;
    stock: number;
    gambar: string;
    penjual: CartPenjual;
};

export type CartItemApi = {
    uuid: string;
    quantity: number;
    subtotal: number;
    produk: CartProduk;
};

export type CartDatas = {
    uuid: string;
    total_item: number;
    total_harga: number;
    items: CartItemApi[];
};

export type AddCartItemPayload = {
    uuid_product: string;
    quantity?: number;
};