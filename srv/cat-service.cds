using mike.officesupplies as officesupplies from '../db/schema';

service CatalogService {
    @odata.draft.enabled :true
    entity Products as projection on officesupplies.Products;
    entity Suppliers as projection on officesupplies.Suppliers;
};