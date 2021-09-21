import { LightningElement, track, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = [
    'Account.Name',
    'Account.High_number_of_drinks__pc',
    'Account.Cut_Down_Alcohol__pc',
    'Account.Criticized_for_Drinking__pc',
    'Account.Drink_in_Morning__pc',
    'Account.Guilt_about_Drinking__pc',
    'Account.Physical_Activity__pc'
]

export default class HealthBehaviorDisplay extends LightningElement {

    @api recordId;
    error;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS }) account;

    get name() {
            //console.log(this.account.data.fields.Name.value);
            return this.account.data.fields.Name.value;

        }
        // Dringking Problem TODO: add logic

    get highNumberOfDrinks() {
        return this.account.data.fields.High_number_of_drinks__pc.value;
    }

    get alcohol() {
        return this.account.data.fields.Cut_Down_Alcohol__pc.value;
    }
    get criticisedForAlcohol() {
        return this.account.data.fields.Criticized_for_Drinking__pc.value;
    }
    get morningDringking() {
        return this.account.data.fields.Drink_in_Morning__pc.value;
    }

    get guiltDrinking() {
        return this.account.data.fields.Guilt_about_Drinking__pc.value;
    }

    // Healthy Habits

    get physicalActivity() {

        if (this.account.data.fields.Physical_Activity.value) {
            str = "My physical activity is for " + this.account.data.fields.Physical_Activity__pc.value + " minutes"
            return str
        }

    }
}