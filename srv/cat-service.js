const cds = require('@sap/cds')

module.exports = cds.service.impl(function () {
    const { Products } = this.entities()

    this.after('each', Products, row => {
        console.log(`Read Product: ${row.ID}`)
    })

    this.after(['CREATE', 'UPDATE', 'DELETE'], [Products], async (Product, req) => {
        const header = req.data
        req.on('succeeded', () => {
            global.it || console.log(`< emitting: product_Changed ${Product.ID}`)
            this.emit('prod_Change', header)
        })
    })

    this.on('get_supplier_info', async () => {
        try {
            const db = await cds.connect.to('db')
            const dbClass = require('sap-hdbext-promisfied')
            let dbConn = new dbClass(await dbClass.createConnection(db.options.credentials))
            const hdbext = require('@sap/hdbext')
            const sp = await dbConn.loadProcedurePromisified(hdbext, null, 'get_supplier_info')
            const output = await dbConn.callProcedurePromisified(sp, [])
            console.log(output.results)
            return output.results
        } catch (error) {
            console.error(error)
            return
        }
    })

    /**
     * Custom error handler
     *
     * throw a new error with: throw new Error('something bad happened');
     *
     **/
    // eslint-disable-next-line no-unused-vars
    this.on("error", (err, req) => {
        switch (err.message) {
            case "UNIQUE_CONSTRAINT_VIOLATION":
                err.message = "The entry already exists.";
                break;

            default:
                err.message =
                    "An error occured. Please retry. Technical error message: " +
                    err.message;
                break;
        }
    });

    /** 
    Raising and catching exceptions:
    You will certainly add your implementations to your services. 
    It is very likely, that you want to interrupt some operations before something crashes. 
    In this case, you can throw a Node.js exception. for error handling.
    Request response:
    You can also use the req.error() method to collect messages or errors and return them to the caller in the request-response.
    */
    // this.on("submitOrder", async (req) => {
    //     const { book, amount } = req.data;
    //     let { stock } = await db.read(Books, book, (b) => b.stock);
    //     if (stock >= amount) {
    //         await db.update(Books, book).with({ stock: (stock -= amount) });
    //         await this.emit("OrderedBook", { book, amount, buyer: req.user.id });
    //         return req.reply({ stock }); // <-- Normal reply
    //     } else {
    //         // Reply with error code 409 and a custom error message
    //         return req.error(409, `${amount} exceeds stock for book #${book}`);
    //     }
    // });
})


