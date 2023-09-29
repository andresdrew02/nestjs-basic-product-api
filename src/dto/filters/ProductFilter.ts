const stockTypes = {
    "all": "",
    "inStock": "quantity > 0",
    "outOfStock": "quantity = 0"
}

export class ProductFilter{
    constructor(public name?: string, public price?: string, public stock?: string, public page?: number, public limit?: number){}

    public static generateSQL(filter: ProductFilter): string{
        let query = `SELECT * FROM product WHERE `
        let counter = 0
        if (filter.name){
            if (counter > 0){
                query += ` AND `
            }
            counter++
            query += `name LIKE '%${filter.name.trim()}%'`
        }
        if (filter.price){
            if (counter > 0){
                query += ` AND `
            }
            counter++
            query += `price >= ${filter.price}`
        }
        if (filter.stock){
            if (counter > 0){
                if (stockTypes[filter.stock] !== ""){
                    query += ` AND `
                }
            }
            counter++
            
            query += stockTypes[filter.stock]
        }
        if (counter === 0 || (counter === 1 && stockTypes[filter.stock] === "")){
            query = `SELECT * FROM product`
        }
        return query
    }
}