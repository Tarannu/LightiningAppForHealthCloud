import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getCareObservation from '@salesforce/apex/HealthBehavior.relatedObservation';
const FIELDS = [
    'Account.Name',
    'Account.Care_Plan_Recommendations__pc',
    'Account.Needs_Alcohol_Consumption_Care_Plan__pc'
]

export default class HealthBehaviorDisplay extends LightningElement {

    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;

    @wire(getCareObservation, { accountId: '$recordId' })
    careObsList;

    get name() {
        return this.account.data.fields.Name.value;
    }
    get alcoholFlag() {
        var xmlString = this.account.data.fields.Needs_Alcohol_Consumption_Care_Plan__pc.value;
        if (xmlString != null) {
            var needsAlcoholFlag = {
                src: xmlString.substring(9, 37),
                alt: xmlString.substring(41, 47),
                body: 0
            }
        }

        console.log("Alcohol flag is " + needsAlcoholFlag.src);
        //return "work in progress";
        return needsAlcoholFlag;
    }
    get carePlanRecommendations() {
        return this.account.data.fields.Care_Plan_Recommendations__pc.value;
    }
    get careObservation() {
        var response = JSON.parse(JSON.stringify(this.careObsList.data));
        var dietScore = 0;
        var maxBMIDate = new Date("1961-10-10");
        var maxGrainDate = new Date("1961-10-10");
        var maxWeightDate = new Date("1961-10-10");
        var result = {
            score: '',
            value: 0
        };
        var output = response.find(obj => {
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
            //ADD DIABETES DIETSCORE
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
            // ADD NOT ENOUGH MONEY SCORE

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
            // Deciding diet score
            if (dietScore < 17) { // add 3 if you add the money problem
                result.score = 'Excellent';
                result.value = dietScore;
            } else if (dietScore < 32) { // add 3 if you add the money problem
                result.score = 'Good';
                result.value = dietScore;
            } else if (dietScore < 47) { // add 3 if you add the money problem
                result.score = 'Fair';
                result.value = dietScore;
            } else {
                result.score = 'Poor';
                result.value = dietScore;
            }
        })

        return result;
    }



}