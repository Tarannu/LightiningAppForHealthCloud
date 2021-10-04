import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = [
    'Account.Name',
    'Account.Care_Plan_Recommendations__pc'
]

export default class HealthBehaviorDisplay extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;

    get name() {
        return this.account.data.fields.Name.value;
    }
    get carePlanRecommendations() {
        return this.account.data.fields.Care_Plan_Recommendations__pc.value;
    }
}