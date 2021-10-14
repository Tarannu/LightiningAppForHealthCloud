public with sharing class HealthBehavior {
    @AuraEnabled(cacheable=true)
    public static List<CareObservation> relatedObservation(Id accountId){
        
        List <CareObservation> careObs = [
            SELECT Name, NumericValue, ObservedSubjectId,ObservedValueText,CreatedDate
            FROM CareObservation 
            Where ObservedSubjectId = :accountId
            WITH SECURITY_ENFORCED
            ];
        System.debug('The care obs are '+careObs);
        return careObs;
    }
          
    
}