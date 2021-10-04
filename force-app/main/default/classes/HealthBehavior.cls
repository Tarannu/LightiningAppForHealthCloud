public with sharing class HealthBehavior {
    @AuraEnabled(cacheable=true)
    public static List<CareObservation> relatedObservation(Id accountId){
        
        List <CareObservation> careObs = [
            SELECT Name, CodeId, Category, NumericValue, ObservedSubjectId
            FROM CareObservation 
            Where ObservedSubjectId = :accountId
            WITH SECURITY_ENFORCED
            ];
        System.debug('The care obs are '+careObs);
        return careObs;
    }
          
    
}