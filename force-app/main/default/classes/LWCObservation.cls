public with sharing class LWCObservation {
    @AuraEnabled(cacheable=true)
    public static List<CareObservation> relatedObservation(Id accountId){
        
        List <CareObservation> careObs = [
            SELECT Name, NumericValue, ObservedSubjectId,ObservedValueText,CreatedDate
            FROM CareObservation   
            Where ObservedSubjectId = :accountId
            WITH SECURITY_ENFORCED
            ];
        
        return careObs;
    }
}
