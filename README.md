# Healthcloud Lightning App in DX: 

The app is based on Salesforce DX. It takes in data from Salesforce objects such as account, contact and from Healthcloud. The objects used are Care Observation, Care Determinants and Health Condtions. The data is utilized to display on the person account detail page to show the custom diet score and health caregory score. It also displays the current Care Plan Reccomendations.

## How Do You Plan to Deploy Your Changes?

Do you want to deploy a set of changes, or create a self-contained application? Choose a [development model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models).
## Shortcut commands to deploy changes to you salesforce Org
You first need to authorize your code to your salesforce org. Make sure you have added the Salesforce for visual studio extenstion to you visual studio. Using the command pallette,
```
SFDX: Authorize an Org
SFDX: Deploy this to org 
```
authorize to your organization when prompted in the browser. 
You deploy changes to or whenever a new change is there without errors.


## Configure Your Salesforce DX Project

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

## Read All About It

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
