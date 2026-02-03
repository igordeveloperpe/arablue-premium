
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  color: string;
  image: string;
  isNew?: boolean;
  onSale?: boolean;
  oldPrice?: number;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Enviado' | 'Entregue' | 'Processando';
  total: number;
}
