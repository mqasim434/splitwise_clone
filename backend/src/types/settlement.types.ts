export interface NetBalance {
  user: string;
  amount: number; 
}

export interface Transfer {
  from: string;   
  to: string;
  amount: number;
}