public with sharing class LWCCareDeterminant {
    @AuraEnabled(cacheable=true)
    public static List<CareDeterminant> relatedCareDeterminants(Id accountId){
        
        List <CareDeterminant> careDeterminant = [
            SELECT Name, PatientId, Value__c
            FROM CareDeterminant   
            Where PatientId = :accountId AND Name = 'Not enough money or food'
            WITH SECURITY_ENFORCED
            ];
       
        return careDeterminant;
    }
}
