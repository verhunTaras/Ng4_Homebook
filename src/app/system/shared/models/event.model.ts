export class WFMEvent {
  constructor(
    public type: string,
    public amount: number,
    public category: number,
    public date: string,
    public description: string,
    public id?: number,
    public catName?: string,
    public _v?: number,
    public _id?: string
  ) { }
}
