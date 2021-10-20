public with sharing class LWCHealthCondition {
    @AuraEnabled(cacheable=true)
    public static List<HealthCondition> relatedCondtions(Id accountId){
        
        List <HealthCondition> healthCondition = [
            SELECT ConditionCodeId, Severity, PatientId
            FROM HealthCondition   
            Where PatientId = :accountId
            WITH SECURITY_ENFORCED
            ];
        System.debug('The health conditions are '+healthCondition);
        return healthCondition;
    }
}
