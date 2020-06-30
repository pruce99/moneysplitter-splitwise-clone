import { IPersonListItem } from "../components/actual/PeopleList";
import { IProductListItem } from "../components/actual/ProductList";

export class Product {
  public name: string;
  public value: number;
  public id: number;

  public constructor(id: number, name: string, value: number) {
    this.id = id;
    this.name = name;
    this.value = value;
  }

  public static findById(id: number, arr: Product[]): Product | null {
    return arr.find((item) => item.id === id) || null;
  }
  public static getListItemsFromPeople(arr: Person[]): IProductListItem[] {
    return arr.reduce((items: IProductListItem[], person: Person) => {
      return items.concat(
        person.products.map((prod: Product, idx: number) => {
          return {
            id: prod.id,
            name: prod.name,
            ownerName: person.name,
            value: prod.value,
          };
        })
      );
    }, []);
  }
}

export class Person {
  public id: number;
  public name: string;
  public products: Product[];

  public constructor(id: number, name: string, products: Product[] = []) {
    this.id = id;
    this.name = name;
    this.products = products;
  }

  public getTotalCost(): number {
    return this.products.reduce((prev, curr) => prev + curr.value, 0);
  }

  public static findById(id: number, arr: Person[]): Person | null {
    return arr.find((item) => item.id === id) || null;
  }
  public static getListItems(arr: Person[]): IPersonListItem[] {
    return arr.map((p, idx) => {
      return {
        id: p.id,
        name: p.name,
        cost: p.getTotalCost(),
      };
    });
  }
}

class DebtPerson {
  public person: Person;
  public amount: number;

  public constructor(person: Person, how_much: number) {
    this.person = person;
    this.amount = how_much;
  }

  public Zero() {
    this.amount = 0;
  }

  public Subtract(n: number) {
    this.amount -= n;
  }
}

export enum TransactionType {
  GIVE = 1,
  RECEIVE = 2,
}
export interface ITotalDebt {
  person: Person;
  type: TransactionType;
  amount: number;
}
export interface ITransaction {
  sender: Person;
  receiver: Person;
  amount: number;
}
export interface ICalculationResult {
  peopleCount: number;
  totalValue: number;
  costPerPerson: number;
  transactions: ITransaction[];
  totals: ITotalDebt[];
}
export function Calculate(people: Person[]): ICalculationResult {
  const ppl = people; 

  let ret: ICalculationResult = {
    peopleCount: ppl.length, 
    totalValue: ppl.reduce((sum, person) => sum + person.getTotalCost(), 0), 
    costPerPerson: 0, 
    transactions: [], 
    totals: [],
  };

  if (ppl.length === 0) return ret;

  
  ret.costPerPerson = ret.totalValue / ret.peopleCount;

  let debtors: DebtPerson[] = []; 
  let creditors: DebtPerson[] = []; 

  ppl.forEach((i) => {
    let diff = i.getTotalCost() - ret.costPerPerson; 

  

    if (diff > 0) {
      creditors.push(new DebtPerson(i, diff));

      ret.totals.push({
        person: i,
        type: TransactionType.RECEIVE,
        amount: diff,
      });
    } else if (diff < 0) {
      debtors.push(new DebtPerson(i, Math.abs(diff)));

      ret.totals.push({
        person: i,
        type: TransactionType.GIVE,
        amount: Math.abs(diff),
      });
    }
  });

 
  for (let c = 0; c < creditors.length; c++) {
    let creditor = creditors[c];
    if (creditor.amount <= 0) continue; 

   
    for (let d = 0; d < debtors.length; d++) {
      let debtor = debtors[d];
      if (debtor.amount <= 0) continue; 
      if (debtor.amount >= creditor.amount) {
        ret.transactions.push({
          sender: debtor.person,
          receiver: creditor.person,
          amount: creditor.amount,
        });
        debtor.Subtract(creditor.amount);
        creditor.Zero();

        break; 
      } 
      else {
        ret.transactions.push({
          sender: debtor.person,
          receiver: creditor.person,
          amount: debtor.amount,
        });
        creditor.Subtract(debtor.amount);
        debtor.Zero();
      }
    }
  }

  return ret;
}
