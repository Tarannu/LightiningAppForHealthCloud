import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getCareObservation from '@salesforce/apex/HealthBehavior.relatedObservation';
const FIELDS = [
    'Account.Name',
    'Account.Care_Plan_Recommendations__pc'
]
const CRFIELDS = [
    'CareObservation.Name',
    'CareObservation.ObservedSubjectId'
]
export default class HealthBehaviorDisplay extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;

    @wire(getCareObservation, { accountId: '$recordId', fields: CRFIELDS })
    careObsList;

    get name() {
        return this.account.data.fields.Name.value;
    }
    get carePlanRecommendations() {
        return this.account.data.fields.Care_Plan_Recommendations__pc.value;
    }
    get careObservation() {
        return this.careObsList.data.fields.Name.value;
    }


}