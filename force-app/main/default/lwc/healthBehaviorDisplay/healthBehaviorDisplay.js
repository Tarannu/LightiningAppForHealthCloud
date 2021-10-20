import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getCareObservations from '@salesforce/apex/LWCObservation.relatedObservation';
import getHealthConditions from '@salesforce/apex/LWCHealthCondition.relatedCondtions';
import getCareDeterminants from '@salesforce/apex/LWCCareDeterminant.relatedCareDeterminants';
const FIELDS = [
    'Account.Name',
    'Account.Care_Plan_Recommendations__pc',
    'Account.Needs_Alcohol_Consumption_Care_Plan__pc'
]

export default class HealthBehaviorDisplay extends LightningElement {

    @api recordId;
    // ADD DIABETES DIETSCORE from healthdiagnosis object

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;

    @wire(getCareObservations, { accountId: '$recordId' })
    careObsList;

    @wire(getHealthConditions, { accountId: '$recordId' })
    healthConditionList;

    @wire(getCareDeterminants, { accountId: '$recordId' })
    careDeterminantList;

    get name() {
        return this.account.data.fields.Name.value;
    }
    get carePlanRecommendations() {
        return this.account.data.fields.Care_Plan_Recommendations__pc.value;
    }
    get totalDietScore() {
        var response1 = JSON.parse(JSON.stringify(this.careObsList.data));
        var response2 = JSON.parse(JSON.stringify(this.careDeterminantList.data));
        var response3 = JSON.parse(JSON.stringify(this.healthConditionList.data));
        var dietScore = 0;
        var maxBMIDate = new Date("1961-10-10");
        var maxGrainDate = new Date("1961-10-10");
        var maxWeightDate = new Date("1961-10-10");
        var result = {
            score: '',
            value: ''
        };
        var output1 = response1.find(obj => {
            // ADD CreatedDate logic to find latest input
            var currentDate;
            // BMI Dietscore
            if (obj.Name == "BMI") {
                currentDate = new Date(Date.parse(obj.CreatedDate));
                maxBMIDate = maxBMIDate < currentDate ? currentDate : maxBMIDate;
                if (obj.CreatedDate == maxBMIDate) {
                    if (obj.NumericValue < 18.5) dietScore += 1;
                    else if (obj.NumericValue <= 24.9) dietScore += 0;
                    else if (obj.NumericValue <= 29.9) dietScore += 1;
                    else if (obj.NumericValue <= 39.9) dietScore += 2;
                    else dietScore += 3;
                } else dietScore += 0;
            }
            //Whole Grain scores 
            if (obj.Name == "More Than Half Bread Whole Grain" && obj.ObservedValueText == "true") {
                currentDate = new Date(Date.parse(obj.CreatedDate));
                maxGrainDate = maxGrainDate < currentDate ? currentDate : maxGrainDate;
                dietScore += obj.CreatedDate == maxGrainDate ? 1 : 0;
            }
            // Unintentional Weight Score 
            if (obj.Name == 'Unintentional Weight Loss Or Gain') {
                currentDate = new Date(Date.parse(obj.CreatedDate));
                maxWeightDate = maxWeightDate < currentDate ? currentDate : maxWeightDate;
                if (obj.CreatedDate == maxWeightDate) {
                    if (obj.ObservedValueText == 'No Weight Loss or Gain') dietScore += 0;
                    else if (obj.ObservedValueText == '1-2 lbs') dietScore += 1;
                    else if (obj.ObservedValueText == '3-5 lbs') dietScore += 2;
                    else if (obj.ObservedValueText == '7-10 lbs') dietScore += 3;
                } else dietScore += 0;
            }
            // Fruit Score 
            if (obj.Name == 'Serving Of Fruits Per Day') {
                if (obj.ObservedValueText == '0') dietScore += 5;
                else if (obj.ObservedValueText == '1 Serving') dietScore += 3;
                else if (obj.ObservedValueText == '2-3 Servings') dietScore += 2;
                else if (obj.ObservedValueText == '4-5 Servings') dietScore += 1;
                else if (obj.ObservedValueText == '6+ Servings') dietScore += 0;
            }
            // Vegetable Score 
            if (obj.Name == 'Serving Of Vegetables Per Day') {
                if (obj.ObservedValueText == '0') dietScore += 5;
                else if (obj.ObservedValueText == '1 Serving') dietScore += 3;
                else if (obj.ObservedValueText == '2-3 Servings') dietScore += 2;
                else if (obj.ObservedValueText == '4-5 Servings') dietScore += 1;
                else if (obj.ObservedValueText == '6+ Servings') dietScore += 0;
            }
            // Alcohol per day score
            if (obj.Name == 'Serving Of Alcohol Per Day') {
                if (obj.ObservedValueText == '0-1 drinks') dietScore += 0;
                else if (obj.ObservedValueText == '2-3 drinks') dietScore += 1;
                else if (obj.ObservedValueText == '4-5 drinks') dietScore += 2;
                else if (obj.ObservedValueText == '6+ drinks') dietScore += 3;
            }
            // Dairy Product Score
            if (obj.Name == 'Num Dairy Products Per Day') {
                if (obj.ObservedValueText == 'I Usually Do Not Eat Dairy') dietScore += 0;
                else if (obj.ObservedValueText == '1-2 Products') dietScore += 1;
                else if (obj.ObservedValueText == '2-3 Products') dietScore += 2;
                else if (obj.ObservedValueText == 'I Have A Dairy Sensitivity') dietScore += 0;
            }
            // Eat Out Frequency
            if (obj.Name == 'Eat Out Frequency') {
                if (obj.ObservedValueText == 'Never') dietScore += 0;
                else if (obj.ObservedValueText == 'Rarely') dietScore += 1;
                else if (obj.ObservedValueText == 'Sometimes') dietScore += 2;
                else if (obj.ObservedValueText == 'Most of the time') dietScore += 3;
            }
            // Sugar Drink Score
            if (obj.Name == 'Sugar-Sweetened Drinks Per Day') {
                if (obj.ObservedValueText == '0') dietScore += 0;
                else if (obj.ObservedValueText == '1 Drink') dietScore += 1;
                else if (obj.ObservedValueText == '2-3 drinks') dietScore += 2;
                else if (obj.ObservedValueText == '4-5 drinks') dietScore += 3;
                else if (obj.ObservedValueText == '6+ drinks') dietScore += 4;
            }
            // Self rating
            if (obj.Name == 'Eating Habit Self Rating') {
                if (obj.ObservedValueText == 'Excellent') dietScore += 0;
                else if (obj.ObservedValueText == 'Good') dietScore += 1;
                else if (obj.ObservedValueText == 'Fair') dietScore += 2;
                else if (obj.ObservedValueText == 'Poor') dietScore += 3;
            }
            // Meals eaten per day score
            if (obj.Name == 'Meals Eaten Per Day') {
                if (obj.ObservedValueText == '1 Meal') dietScore += 3;
                else if (obj.ObservedValueText == '2 Meals') dietScore += 2;
                else if (obj.ObservedValueText == '3 Meals') dietScore += 0;
                else if (obj.ObservedValueText == '4+ Meals') dietScore += 1;
            }
            // Add Butter Frequency Score
            if (obj.Name == 'Butter Frequency') {
                if (obj.ObservedValueText == 'Never') dietScore += 0;
                else if (obj.ObservedValueText == 'Rarely') dietScore += 1;
                else if (obj.ObservedValueText == 'Sometimes') dietScore += 2;
                else if (obj.ObservedValueText == 'Most of the time') dietScore += 3;
            }
            // Pre-packaged Snack Frequency
            if (obj.Name == 'Pre-packaged Snack Frequency') {
                if (obj.ObservedValueText == 'Never') dietScore += 0;
                else if (obj.ObservedValueText == 'Rarely') dietScore += 1;
                else if (obj.ObservedValueText == 'Sometimes') dietScore += 2;
                else if (obj.ObservedValueText == 'Most of the time') dietScore += 3;
            }
            // Eat Chicken/Turkey/Fish Frequency
            if (obj.Name == 'Eat Chicken/Turkey/Fish Frequency') {
                if (obj.ObservedValueText == 'Never') dietScore += 3;
                else if (obj.ObservedValueText == 'Rarely') dietScore += 2;
                else if (obj.ObservedValueText == 'Sometimes') dietScore += 1;
                else if (obj.ObservedValueText == 'Most of the time') dietScore += 0;
            }
            // Eat Beef/Pork/Lamb/Organ Frequency
            if (obj.Name == 'Eat Beef/Pork/Lamb/Organ Frequency') {
                if (obj.ObservedValueText == 'Never') dietScore += 0;
                else if (obj.ObservedValueText == 'Rarely') dietScore += 1;
                else if (obj.ObservedValueText == 'Sometimes') dietScore += 2;
                else if (obj.ObservedValueText == 'Most of the time') dietScore += 3;
            }
            // Eat Dessert/Sweets Frequency
            if (obj.Name == 'Eat Dessert/Sweets Frequency') {
                if (obj.ObservedValueText == 'Never') dietScore += 0;
                else if (obj.ObservedValueText == 'Rarely') dietScore += 1;
                else if (obj.ObservedValueText == 'Sometimes') dietScore += 2;
                else if (obj.ObservedValueText == 'Most of the time') dietScore += 3;
            }
        })
        var output2 = response2.find(obj => {
            if (obj.Value__c == 'Never') {
                dietScore += 0;
            } else if (obj.Value__c == 'Rarely') {
                dietScore += 1;
            } else if (obj.Value__c == 'Sometimes') {
                dietScore += 2;
            } else if (obj.Value__c == 'Most of the time') {
                dietScore += 3;
            }
        })
        var output3 = response3.find(obj => {
                // DIABETES condtion
                if (obj.ConditionCodeId == '0iP8H000000001nUAA') {
                    dietScore += 1;
                }
                // TO DO : ADD Cancer and Q3 conditions when code sets are added
            })
            //Deciding diet score
        if (dietScore < 20) {
            result.score = 'Excellent';
            result.value = dietScore;
        } else if (dietScore < 35) {
            result.score = 'Good';
            result.value = dietScore;
        } else if (dietScore < 50) {
            result.score = 'Fair';
            result.value = dietScore;
        } else {
            result.score = 'Poor';
            result.value = dietScore;
        }

        return result;
    }

    get HealthScore() {

    }



}