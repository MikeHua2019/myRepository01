using mike.officesupplies as officesupplies from '../db/schema';

service CatalogService {
    @odata.draft.enabled : true
    entity Products  as projection on officesupplies.Products;
    // entity Products @(restrict : [
    //     {
    //         grant : ['READ'],
    //         to    : ['Vendor']
    //     },
    //     {
    //         grant : ['*'],
    //         to    : ['ProcurementManager']
    //     },
    // ]) as projection on officesupplies.Products;
    
    entity Suppliers as projection on officesupplies.Suppliers;
    // entity Suppliers @(restrict : [
    //     {
    //         grant : ['READ'],
    //         to    : ['Vendor']
    //     },
    //     {
    //         grant : ['*'],
    //         to    : ['ProcurementManager']
    //     },
    // ]) as projection on officesupplies.Suppliers;

    function get_supplier_info() returns array of Suppliers;
};
